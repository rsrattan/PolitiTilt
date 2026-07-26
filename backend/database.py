from sqlalchemy import create_engine, Column, Integer, String, Float, ForeignKey, DateTime
from sqlalchemy.orm import declarative_base, relationship, sessionmaker
from datetime import datetime

DATABASE_URL = "sqlite:///./polititilt.db"

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class Hashtag(Base):
    __tablename__ = "hashtags"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    last_analyzed = Column(DateTime, default=datetime.utcnow)

    # Aggregated stats
    spectrum_score = Column(Float, default=0.0)
    tweet_count = Column(Integer, default=0)

    # NLP Breakdown stats
    dominant_sentiment = Column(String, default="Neutral")

    tweets = relationship("Tweet", back_populates="hashtag")

class Tweet(Base):
    __tablename__ = "tweets"

    id = Column(String, primary_key=True, index=True) # Twitter's tweet ID
    text = Column(String)
    author_username = Column(String)
    created_at = Column(DateTime)

    hashtag_id = Column(Integer, ForeignKey("hashtags.id"))

    # NLP Analysis
    sentiment_label = Column(String) # Positive, Negative, Neutral
    sentiment_score = Column(Float)
    spectrum_score = Column(Float) # Left (-1.0) to Right (1.0)

    hashtag = relationship("Hashtag", back_populates="tweets")

def init_db():
    Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
