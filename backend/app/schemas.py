#Pydantic for API validation

from pydantic import BaseModel

class UserCreate(BaseModel):
    username: str
    email: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class ChannelCreate(BaseModel):
    name: str

class ContentCreate(BaseModel):
    type: str
    description: str