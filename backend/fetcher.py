import os
import random
from datetime import datetime, timedelta
try:
    from twikit import Client
except ImportError:
    Client = None

class TweetFetcher:
    def __init__(self, use_mock=True):
        self.use_mock = use_mock
        if not self.use_mock and Client:
            self.client = Client()
            # Requires credentials. For now, fallback to mock if credentials are not provided via env vars.
            username = os.environ.get("TWITTER_USERNAME")
            email = os.environ.get("TWITTER_EMAIL")
            password = os.environ.get("TWITTER_PASSWORD")

            if username and email and password:
                try:
                    self.client.login(auth_info_1=username, auth_info_2=email, password=password)
                except Exception as e:
                    print(f"Login failed: {e}. Falling back to mock data.")
                    self.use_mock = True
            else:
                print("Twitter credentials not found in environment. Falling back to mock data.")
                self.use_mock = True

    def fetch_tweets(self, hashtag: str, limit: int = 20):
        """Fetches tweets for a given hashtag. Returns mock data if use_mock is True."""
        if self.use_mock:
            return self._generate_mock_tweets(hashtag, limit)

        # Real Twikit logic
        try:
            # Twikit uses search_tweet. We'll try to fetch recent ones.
            tweets = self.client.search_tweet(hashtag, 'Latest')

            results = []
            for tweet in tweets:
                if len(results) >= limit:
                    break
                results.append({
                    "id": str(tweet.id),
                    "text": tweet.text,
                    "author_username": tweet.user.screen_name,
                    "created_at": datetime.strptime(tweet.created_at, "%a %b %d %H:%M:%S %z %Y").replace(tzinfo=None) if tweet.created_at else datetime.utcnow()
                })
            return results
        except Exception as e:
            print(f"Error fetching from Twikit: {e}. Falling back to mock data.")
            return self._generate_mock_tweets(hashtag, limit)

    def _generate_mock_tweets(self, hashtag: str, limit: int = 20):
        """Generates realistic-looking mock tweets based on the hashtag."""
        print(f"Generating {limit} mock tweets for {hashtag}...")

        # Determine some context based on the hashtag to make mock data somewhat coherent
        hashtag_lower = hashtag.lower()
        if "budget" in hashtag_lower or "economy" in hashtag_lower:
            themes = [
                "The new policies are great for business growth! 📈",
                "Why are we taxing the middle class so much? This is unfair.",
                "Infrastructure spending looks solid this year.",
                "Capital gains tax changes are a disaster for investors.",
                "Finally some focus on deregulation and growth."
            ]
        elif "farmer" in hashtag_lower or "protest" in hashtag_lower:
            themes = [
                "We must stand with the farmers! No to corporate exploitation. 🌾",
                "The reforms are necessary for modernizing agriculture.",
                "MSP guarantee is a fundamental right.",
                "Blocking roads is not the way to protest.",
                "Solidarity with the working class!"
            ]
        else:
            themes = [
                f"Just saw the news about {hashtag}. Thoughts?",
                f"Completely disagree with the prevailing narrative on {hashtag}.",
                f"This {hashtag} situation is getting out of hand.",
                f"I fully support the recent moves regarding {hashtag}!",
                f"Can we get some actual facts about {hashtag} instead of propaganda?"
            ]

        results = []
        for i in range(limit):
            results.append({
                "id": f"mock_{random.randint(1000000000, 9999999999)}",
                "text": f"{random.choice(themes)} {hashtag}",
                "author_username": f"user_{random.randint(1000, 9999)}",
                "created_at": datetime.utcnow() - timedelta(minutes=random.randint(1, 1000))
            })
        return results

if __name__ == "__main__":
    fetcher = TweetFetcher(use_mock=True)
    tweets = fetcher.fetch_tweets("#UnionBudget2024", limit=2)
    print(tweets)
