from sqlalchemy.orm import Session
from .database import SessionLocal
from .models import User, Channel

def seed_data():
    db = SessionLocal()
    try:
        user = User(
            username="testuser",
            email="test@example.com",
            hashed_password="hashedpass123",
            affiliate_id="AFF001"
        )
        db.add(user)
        db.commit()
        db.refresh(user)

        channel = Channel(
            name="Art Channel",
            creator_id=user.id
        )
        db.add(channel)
        db.commit()
        db.refresh(channel)

        print("Test data added successfully!")
    finally:
        db.close()

if __name__ == "__main__":
    seed_data()