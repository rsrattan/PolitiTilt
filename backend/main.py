from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from datetime import datetime
import statistics

from database import get_db, init_db, Hashtag, Tweet
from fetcher import TweetFetcher
from nlp import NLPAnalyzer

app = FastAPI(title="PolitiTilt API")

# Setup CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize database
init_db()

# Initialize fetcher and NLP
fetcher = TweetFetcher(use_mock=True) # Will use credentials from env if available, otherwise mock
analyzer = NLPAnalyzer()

@app.get("/")
def read_root():
    return {"message": "Welcome to PolitiTilt API"}

@app.get("/api/analyze")
def analyze_hashtag(hashtag: str, limit: int = 20, db: Session = Depends(get_db)):
    if not hashtag.startswith("#"):
        hashtag = "#" + hashtag

    # Fetch tweets (mock or real)
    raw_tweets = fetcher.fetch_tweets(hashtag, limit=limit)
    if not raw_tweets:
        raise HTTPException(status_code=404, detail="No tweets found for this hashtag")

    # Get or create hashtag in DB
    db_hashtag = db.query(Hashtag).filter(Hashtag.name == hashtag).first()
    if not db_hashtag:
        db_hashtag = Hashtag(name=hashtag)
        db.add(db_hashtag)
        db.commit()
        db.refresh(db_hashtag)

    spectrum_scores = []
    sentiments = []

    # Process and store tweets
    for t in raw_tweets:
        # Check if tweet already exists to avoid duplicates
        existing_tweet = db.query(Tweet).filter(Tweet.id == t["id"]).first()
        if existing_tweet:
            spectrum_scores.append(existing_tweet.spectrum_score)
            sentiments.append(existing_tweet.sentiment_label)
            continue

        # Analyze tweet
        analysis = analyzer.analyze_tweet(t["text"])

        new_tweet = Tweet(
            id=t["id"],
            text=t["text"],
            author_username=t["author_username"],
            created_at=t["created_at"],
            hashtag_id=db_hashtag.id,
            sentiment_label=analysis["sentiment_label"],
            sentiment_score=analysis["sentiment_score"],
            spectrum_score=analysis["spectrum_score"]
        )
        db.add(new_tweet)

        spectrum_scores.append(analysis["spectrum_score"])
        sentiments.append(analysis["sentiment_label"])

    db.commit()

    # Aggregate results for the hashtag
    if spectrum_scores:
        # Map spectrum score from [-1.0, 1.0] to [-100, 100] for frontend
        avg_spectrum = statistics.mean(spectrum_scores) * 100

        # Determine dominant sentiment
        dominant_sentiment = max(set(sentiments), key=sentiments.count)

        # Update hashtag stats
        db_hashtag.spectrum_score = avg_spectrum
        db_hashtag.tweet_count += len(raw_tweets)
        db_hashtag.dominant_sentiment = dominant_sentiment
        db_hashtag.last_analyzed = datetime.utcnow()
        db.commit()

        # Build response to match frontend expectations
        return {
            "id": str(db_hashtag.id),
            "hashtag": db_hashtag.name,
            "spectrumScore": round(avg_spectrum, 2),
            "tweetCount": db_hashtag.tweet_count,
            "trendingRank": 1, # Placeholder
            "breakdown": {
                "policyStance": "Analyzed dynamically via NLP.",
                "keyThemes": ["Analyzed", "Live Data"],
                "sentiment": dominant_sentiment,
                "dominantLanguage": "English/Mixed"
            },
            "echoChamberDensity": 0.5, # Placeholder
            "topInfluencers": [] # Placeholder for now
        }

    return {"message": "Analysis failed."}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
