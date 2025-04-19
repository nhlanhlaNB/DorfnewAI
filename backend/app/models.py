#This page is used to define database models

from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from .database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    channels = relationship("Channel", back_populates="creator")
    #add ID for affirliate program

class Channel(Base):
    __tablename__ = "channels"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    creator_id = Column(Integer, ForeignKey("users.id"))
    creator = relationship("User", back_populates="channels")
    contents = relationship("Content", back_populates="channel")
    subscriptions = relationship("Subscription", back_populates="channel")

class Content(Base):
    __tablename__ = "content"
    id = Column(Integer, primary_key=True, index=True)
    channel_id = Column(Integer, ForeignKey("channels.id"))
    type = Column(String)  # "image", "music", "video"
    url = Column(String)
    description = Column(String)
    channel = relationship("Channel", back_populates="contents")

class Subscription(Base):
    __tablename__ = "subscriptions"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    channel_id = Column(Integer, ForeignKey("channels.id"))
    channel = relationship("Channel", back_populates="subscriptions")