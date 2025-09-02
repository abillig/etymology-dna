# Etymology DNA

Analyze the linguistic ancestry of English sentences with a DNA report-style interface. Discover what percentage of your sentence is Germanic, French, Latin, or other language origins.

## Setup

### Backend (Python)
```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# Add your Anthropic API key to .env
python main.py
```

### Frontend (React)
```bash
cd frontend
npm install
npm run dev
```

## Features

- **DNA-Style Reports**: Percentage breakdown of linguistic origins with colored bars
- **Google-Inspired UX**: Centered search that transforms to compact header after analysis
- **Interactive Analysis**: Color-coded sentences with detailed etymological tooltips
- **Modern Stack**: FastAPI backend with Vite + React + TypeScript frontend

## Usage

1. Enter an English sentence in the search bar
2. Click "Analyze Sentence"
3. View your sentence's linguistic DNA composition
4. Hover over colored words for detailed etymological information

## Tech Stack

- **Backend**: FastAPI, Anthropic Claude API, Pydantic
- **Frontend**: Vite, React, TypeScript
- **Styling**: Custom CSS with Material UI-inspired inputs

## Requirements

- Python 3.8+
- Node.js 16+
- Anthropic API key