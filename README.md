# Etymology Explorer

Visualize the etymological origins of English sentences through interactive word clouds.

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
npm start
```

## Usage

1. Enter an English sentence in the text area
2. Click "Analyze Etymology" 
3. Watch words organize into color-coded origin language clouds
4. Hover over words to see etymological details
5. Click "Reassemble" to see the original sentence with color-coded words

## Features

- **Word Clouds**: Words grouped by etymological origin with color coding
- **Interactive Tooltips**: Hover for detailed etymological information
- **Sentence Reassembly**: Original sentence with etymology-based coloring
- **Multiple Origins**: Germanic, French, Latin, Greek, Arabic, Norse, Celtic, and more

## Requirements

- Python 3.8+
- Node.js 14+
- Anthropic API key