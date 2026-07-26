from transformers import AutoModelForSequenceClassification, AutoTokenizer
import torch
import numpy as np

class NLPAnalyzer:
    def __init__(self):
        print("Loading CardiffNLP Twitter-RoBERTa models...")
        # Using CardiffNLP's sentiment model as a proxy for the analysis pipeline
        self.sentiment_model_name = "cardiffnlp/twitter-roberta-base-sentiment-latest"

        try:
            self.tokenizer = AutoTokenizer.from_pretrained(self.sentiment_model_name)
            self.model = AutoModelForSequenceClassification.from_pretrained(self.sentiment_model_name)
            self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
            self.model.to(self.device)
            print("Models loaded successfully.")
        except Exception as e:
            print(f"Error loading models: {e}. Ensure you have internet access or the models are cached.")
            self.model = None

    def analyze_tweet(self, text: str):
        """
        Analyzes a tweet text and returns a sentiment and a simulated 'spectrum' score.
        For true stance detection on Indian politics, a fine-tuned model would be needed.
        Here we use sentiment + heuristics to approximate the spectrum score for demonstration.
        """
        if not self.model:
            return {"sentiment": "Neutral", "sentiment_score": 0.0, "spectrum_score": 0.0}

        # Tokenize and predict sentiment
        inputs = self.tokenizer(text, return_tensors="pt", truncation=True, max_length=512).to(self.device)
        with torch.no_grad():
            outputs = self.model(**inputs)

        scores = outputs.logits[0].cpu().numpy()
        scores = np.exp(scores) / np.exp(scores).sum() # softmax

        # Labels for cardiffnlp/twitter-roberta-base-sentiment-latest:
        # 0 -> Negative, 1 -> Neutral, 2 -> Positive
        labels = ["Negative", "Neutral", "Positive"]
        ranking = np.argsort(scores)[::-1]

        top_label = labels[ranking[0]]
        top_score = float(scores[ranking[0]])

        # --- Simulated Spectrum Scoring (Left/Right) ---
        # In a real app, this would use a dedicated Stance Detection model trained on
        # Indian political manifestos. For now, we simulate a score based on keywords and sentiment.
        text_lower = text.lower()

        # Very rudimentary heuristics for demonstration
        spectrum_score = 0.0

        # Words often associated with Right-leaning discourse (in some Indian contexts: pro-business, nationalism, etc.)
        right_keywords = ["growth", "deregulation", "capital", "infrastructure", "business", "nation", "pride"]
        # Words often associated with Left-leaning discourse (welfare, labor rights, protest, etc.)
        left_keywords = ["welfare", "labor", "rights", "protest", "unfair", "taxing", "middle class", "solidarity"]

        right_count = sum(1 for w in right_keywords if w in text_lower)
        left_count = sum(1 for w in left_keywords if w in text_lower)

        if right_count > left_count:
            spectrum_score = 0.5 + (right_count * 0.1)
        elif left_count > right_count:
            spectrum_score = -0.5 - (left_count * 0.1)
        else:
            # Random slight lean for neutral/unmatched text just for variance
            spectrum_score = np.random.uniform(-0.2, 0.2)

        # Clamp score between -1.0 and 1.0
        spectrum_score = max(min(spectrum_score, 1.0), -1.0)

        return {
            "sentiment_label": top_label,
            "sentiment_score": top_score,
            "spectrum_score": spectrum_score
        }

if __name__ == "__main__":
    analyzer = NLPAnalyzer()
    res1 = analyzer.analyze_tweet("The new policies are great for business growth! 📈")
    print(f"Res1: {res1}")
    res2 = analyzer.analyze_tweet("We must stand with the farmers! No to corporate exploitation. 🌾")
    print(f"Res2: {res2}")
