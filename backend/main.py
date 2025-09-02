from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from anthropic import Anthropic
from dotenv import load_dotenv
import os
import json

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

client = Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

class SentenceRequest(BaseModel):
    sentence: str

CHARACTER_LIMIT = 120

class WordOrigin(BaseModel):
    word: str
    origin: str
    color: str
    details: str
    confidence: float

class OriginPercentage(BaseModel):
    origin: str
    percentage: float
    color: str

class EtymologyResponse(BaseModel):
    words: list[WordOrigin]
    percentages: list[OriginPercentage]
    total_words: int

ORIGIN_COLORS = {
    "Germanic": "#00B4A6",  # Teal
    "French": "#7CB342",    # Vibrant green
    "Latin": "#FFC107",     # Sunny yellow
    "Greek": "#673AB7",     # Purple
    "Arabic": "#FF5722",    # Orange-red
    "Norse": "#2196F3",     # Bright blue
    "Celtic": "#4CAF50",    # Green
    "Spanish": "#FF9800",   # Amber
    "Italian": "#E91E63",   # Pink
    "Dutch": "#795548",     # Brown
    "Unknown": "#9E9E9E"    # Gray
}

@app.post("/analyze", response_model=EtymologyResponse)
async def analyze_etymology(request: SentenceRequest):
    # Validate character limit
    if len(request.sentence.strip()) > CHARACTER_LIMIT:
        raise HTTPException(
            status_code=400, 
            detail=f"Input too long. Maximum {CHARACTER_LIMIT} characters allowed."
        )
    
    if not request.sentence.strip():
        raise HTTPException(status_code=400, detail="Empty input not allowed.")
    
    try:
        prompt = f"""
        Analyze the etymological origins of each word in this English sentence: "{request.sentence}"

        For each word, provide:
        1. The word itself
        2. Its primary etymological origin (Germanic, French, Latin, Greek, Arabic, Norse, Celtic, Spanish, Italian, Dutch, or Unknown)
        3. A brief explanation of its etymology and interesting details
        4. A confidence score from 0.0 to 1.0

        Return the response in this exact JSON format:
        {{
            "words": [
                {{
                    "word": "example",
                    "origin": "Latin",
                    "details": "From Latin 'exemplum' meaning pattern or sample",
                    "confidence": 0.95
                }}
            ]
        }}

        Include all words including articles and prepositions, but EXCLUDE punctuation marks.
        """

        message = client.messages.create(
            model="claude-3-5-sonnet-20241022",
            max_tokens=2000,
            messages=[{"role": "user", "content": prompt}]
        )

        response_text = message.content[0].text
        
        try:
            etymology_data = json.loads(response_text)
        except json.JSONDecodeError:
            start = response_text.find('{')
            end = response_text.rfind('}') + 1
            if start != -1 and end > start:
                etymology_data = json.loads(response_text[start:end])
            else:
                raise ValueError("Could not parse JSON response")

        words_with_colors = []
        origin_counts = {}
        
        for word_data in etymology_data["words"]:
            origin = word_data["origin"]
            color = ORIGIN_COLORS.get(origin, ORIGIN_COLORS["Unknown"])
            
            words_with_colors.append(WordOrigin(
                word=word_data["word"],
                origin=origin,
                color=color,
                details=word_data["details"],
                confidence=word_data["confidence"]
            ))
            
            # Count words by origin
            origin_counts[origin] = origin_counts.get(origin, 0) + 1

        # Calculate percentages
        total_words = len(words_with_colors)
        percentages = []
        
        for origin, count in origin_counts.items():
            percentage = (count / total_words) * 100
            color = ORIGIN_COLORS.get(origin, ORIGIN_COLORS["Unknown"])
            percentages.append(OriginPercentage(
                origin=origin,
                percentage=percentage,
                color=color
            ))
        
        # Sort by percentage descending
        percentages.sort(key=lambda x: x.percentage, reverse=True)

        return EtymologyResponse(
            words=words_with_colors,
            percentages=percentages,
            total_words=total_words
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)