from fastapi import FastAPI, Depends, HTTPException, UploadFile, File
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from backend.app.models import User,Channel,Subscription
from .database import get_db, Base, engine
from .auth import create_access_token, get_current_user, verify_password
from .crud import create_user, create_channel, create_content, subscribe_to_channel
from .schemas import UserCreate, Token, ChannelCreate, ContentCreate
from .ai_generate import generate_image, generate_music, generate_video

app = FastAPI()

# CORS for Next.js (localhost:3000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create database tables
Base.metadata.create_all(bind=engine)

@app.post("/signup", response_model=Token)
def signup(user: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.username == user.username).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    new_user = create_user(db, user)
    access_token = create_access_token(data={"sub": new_user.username})
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/token", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    access_token = create_access_token(data={"sub": user.username})
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/channels", response_model=ChannelCreate)
def create_new_channel(channel: ChannelCreate, user=Depends(get_current_user), db: Session = Depends(get_db)):
    return create_channel(db, channel, user.id)

@app.post("/generate")
def generate_content(type: str, prompt: str, user=Depends(get_current_user)):
    if type == "image":
        url = generate_image(prompt)
    elif type == "music":
        url = generate_music(prompt)
    elif type == "video":
        url = generate_video(prompt)
    else:
        raise HTTPException(status_code=400, detail="Invalid content type")
    return {"url": url}

@app.post("/generate-from-file")
async def generate_from_file(file: UploadFile = File(...), type: str = "image", user=Depends(get_current_user)):
    file_bytes = await file.read()
    if type == "image":
        url = generate_image(file=file_bytes)
    return {"url": url}

@app.post("/channels/{channel_id}/content")
def post_content(channel_id: int, content: ContentCreate, user=Depends(get_current_user), db: Session = Depends(get_db)):
    channel = db.query(Channel).filter(Channel.id == channel_id, Channel.creator_id == user.id).first()
    if not channel:
        raise HTTPException(status_code=403, detail="Not your channel")
    return create_content(db, content, channel_id, content.url)

@app.post("/subscribe/{channel_id}")
def subscribe(channel_id: int, user=Depends(get_current_user), db: Session = Depends(get_db)):
    return subscribe_to_channel(db, user.id, channel_id)

@app.get("/subscriptions")
def get_subscriptions(user=Depends(get_current_user), db: Session = Depends(get_db)):
    subs = db.query(Subscription).filter(Subscription.user_id == user.id).all()
    return [{"channel_name": sub.channel.name, "creator": sub.channel.creator.username} for sub in subs]