import torch
from diffusers import StableDiffusionPipeline
from fastapi import FastAPI, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from supabase import create_client, Client
import io
import base64
import logging
from typing import Optional

# Adjust imports for new folder structure
from ..database.database import SessionLocal, get_db
from ..database.models import User, Channel, Content

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

app = FastAPI(title="Dorfnew Image Generator API")

SUPABASE_URL = "https://idnnpycamnmainvjetyb.supabase.co"
SUPABASE_KEY = "[eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlkbm5weWNhbW5tYWludmpldHliIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYwNDg0NzksImV4cCI6MjA2MTYyNDQ3OX0.1_sNgbUiPuKFOQLXx9oPSguHEOcUcf-TjPe2XvgwLig]"
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

device = "cuda" if torch.cuda.is_available() else "cpu"
logger.info(f"Using device: {device}")

model_id = "CompVis/stable-diffusion-v1-4"
try:
    pipe = StableDiffusionPipeline.from_pretrained(
        model_id,
        torch_dtype=torch.float16 if device == "cuda" else torch.float32,
        use_auth_token=False
    )
    pipe = pipe.to(device)
    logger.info("Model loaded successfully!")
except Exception as e:
    logger.error(f"Error loading model: {e}")
    raise

class ImageRequest(BaseModel):
    prompt: str
    channel_id: int

async def generate_image(prompt: str, channel_id: int, db: Session):
    try:
        image = pipe(prompt, num_inference_steps=50).images[0]

        buffered = io.BytesIO()
        image.save(buffered, format="PNG")
        image_bytes = buffered.getvalue()

        file_name = f"{prompt[:20]}_{channel_id}.png"
        response = supabase.storage.from_("images").upload(file_name, image_bytes, {"content-type": "image/png"})
        if response.status_code != 200:
            raise Exception("Failed to upload image to Supabase Storage")

        image_url = supabase.storage.from_("images").get_public_url(file_name)

        content = Content(
            channel_id=channel_id,
            type="image",
            url=image_url,
            description=prompt
        )
        db.add(content)
        db.commit()
        db.refresh(content)

        img_str = base64.b64encode(image_bytes).decode("utf-8")

        logger.info(f"Successfully generated and saved image for prompt: {prompt}")
        return image, img_str
    except Exception as e:
        logger.error(f"Error generating image for prompt '{prompt}': {e}")
        return None, None

@app.post("/generate_image")
async def generate_image_endpoint(request: ImageRequest, db: Session = Depends(get_db)):
    if not request.prompt.strip():
        raise HTTPException(status_code=400, detail="Prompt must be a non-empty string")

    channel = db.query(Channel).filter(Channel.id == request.channel_id).first()
    if not channel:
        raise HTTPException(status_code=404, detail="Channel not found")

    image, img_base64 = await generate_image(request.prompt, request.channel_id, db)
    if image is None:
        raise HTTPException(status_code=500, detail="Failed to generate image")

    return {"image_base64": img_base64}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}