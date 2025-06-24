import torch
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Optional
import logging
import io
import base64
from diffusers import StableDiffusionPipeline, AudioLDMPipeline
from fish_speech.models.text2semantic import Text2SemanticModel
from opensora.models.ae import getae
from opensora.models.dit import getdit
from opensora.sampling import sample

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

# SD3.5 Model
sd_pipe = None
if torch.cuda.is_available():
    sd_pipe = StableDiffusionPipeline.from_pretrained(
        "stabilityai/stable-diffusion-3-5",
        torch_dtype=torch.float16
    ).to("cuda")

# AudioLDM Model
audio_pipe = None
if torch.cuda.is_available():
    audio_pipe = AudioLDMPipeline.from_pretrained(
        "cvssp/audioldm",
        torch_dtype=torch.float16
    ).to("cuda")

# FishSpeech Model
fish_model = None
if torch.cuda.is_available():
    fish_model = Text2SemanticModel(
        config_path="fish_speech/configs/text2semantic.yaml",
        ckpt_path="fish_speech/checkpoints/text2semantic.pth"
    ).to("cuda").eval()

# OpenSora Model
opensora_ae = None
opensora_dit = None
if torch.cuda.is_available():
    opensora_ae = getae(pretrained_path="opensora/checkpoints/ae.pth").to("cuda")
    opensora_dit = getdit(pretrained_path="opensora/checkpoints/dit.pth").to("cuda")

class GenerateRequest(BaseModel):
    prompt: str
    duration: Optional[float] = None  # For video/audio length

@app.post("/generate")
async def generate_content(request: GenerateRequest):
    try:
        # Determine content type from prompt (similar to frontend logic)
        prompt = request.prompt.lower()
        
        if 'video' in prompt or 'movie' in prompt or 'clip' in prompt:
            # Video generation with OpenSora and AudioLDM
            video = generate_video(request.prompt, request.duration or 5.0)
            audio = generate_audio(request.prompt, request.duration or 5.0)
            
            if 'speak' in prompt or 'voice' in prompt:
                speech = generate_speech(request.prompt)
                return {
                    "status": "success",
                    "type": "video",
                    "output": video,
                    "audio": audio,
                    "speech": speech
                }
            else:
                return {
                    "status": "success",
                    "type": "video",
                    "output": video,
                    "audio": audio
                }
                
        elif 'music' in prompt or 'song' in prompt or 'beat' in prompt:
            # Audio generation only
            audio = generate_audio(request.prompt, request.duration or 30.0)
            return {
                "status": "success",
                "type": "audio",
                "output": audio
            }
            
        else:
            # Default to image generation
            image = generate_image(request.prompt)
            return {
                "status": "success",
                "type": "image",
                "output": image
            }
            
    except Exception as e:
        logger.error(f"Generation failed: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

def generate_image(prompt: str):
    if not sd_pipe:
        raise HTTPException(status_code=503, detail="SD3.5 model not loaded")
    
    image = sd_pipe(prompt).images[0]
    buffered = io.BytesIO()
    image.save(buffered, format="PNG")
    return base64.b64encode(buffered.getvalue()).decode("utf-8")

def generate_audio(prompt: str, duration: float):
    if not audio_pipe:
        raise HTTPException(status_code=503, detail="AudioLDM model not loaded")
    
    audio = audio_pipe(
        prompt,
        audio_length_in_s=duration,
        num_inference_steps=50
    ).audios[0]
    
    buffered = io.BytesIO()
    # Convert numpy array to bytes (simplified)
    return base64.b64encode(audio.tobytes()).decode("utf-8")

def generate_speech(prompt: str):
    if not fish_model:
        raise HTTPException(status_code=503, detail="FishSpeech model not loaded")
    
    # Simplified speech generation
    semantic_tokens = fish_model.generate(prompt)
    # Convert to audio bytes (placeholder)
    return base64.b64encode(semantic_tokens.numpy().tobytes()).decode("utf-8")

def generate_video(prompt: str, duration: float):
    if not opensora_ae or not opensora_dit:
        raise HTTPException(status_code=503, detail="OpenSora model not loaded")
    
    # Simplified video generation
    video = sample(
        opensora_dit,
        opensora_ae,
        prompt=prompt,
        video_length=duration,
        fps=24
    )
    # Convert to base64 (placeholder)
    return base64.b64encode(video.numpy().tobytes()).decode("utf-8")

@app.get("/health")
async def health_check():
    models_loaded = {
        "sd35": sd_pipe is not None,
        "audioldm": audio_pipe is not None,
        "fishspeech": fish_model is not None,
        "opensora": opensora_ae is not None and opensora_dit is not None
    }
    return {
        "status": "healthy",
        "models_loaded": models_loaded
    }