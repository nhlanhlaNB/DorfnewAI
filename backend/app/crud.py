from sqlalchemy.orm import Session
from ...database.models import User, Channel, Content, Subscription
from .schemas import UserCreate, ChannelCreate, ContentCreate
from .auth import get_password_hash

def create_user(db: Session, user: UserCreate):
    hashed_password = get_password_hash(user.password)
    db_user = User(username=user.username, email=user.email, hashed_password=hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def create_channel(db: Session, channel: ChannelCreate, user_id: int):
    db_channel = Channel(name=channel.name, creator_id=user_id)
    db.add(db_channel)
    db.commit()
    db.refresh(db_channel)
    return db_channel

def create_content(db: Session, content: ContentCreate, channel_id: int, url: str):
    db_content = Content(channel_id=channel_id, type=content.type, url=url, description=content.description)
    db.add(db_content)
    db.commit()
    db.refresh(db_content)
    return db_content

def subscribe_to_channel(db: Session, user_id: int, channel_id: int):
    subscription = Subscription(user_id=user_id, channel_id=channel_id)
    db.add(subscription)
    db.commit()
    db.refresh(subscription)
    return subscription