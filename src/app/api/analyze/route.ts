import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const CHARACTER_LIMIT = 120;

const ORIGIN_COLORS = {
  "Germanic": "#00B4A6",  // Teal
  "French": "#7CB342",    // Vibrant green
  "Latin": "#FFC107",     // Sunny yellow
  "Greek": "#673AB7",     // Purple
  "Arabic": "#FF5722",    // Orange-red
  "Norse": "#2196F3",     // Bright blue
  "Celtic": "#4CAF50",    // Green
  "Spanish": "#FF9800",   // Amber
  "Italian": "#E91E63",   // Pink
  "Dutch": "#795548",     // Brown
  "Unknown": "#9E9E9E"    // Gray
};

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

export async function POST(request: NextRequest) {
  try {
    const { sentence } = await request.json();

    // Validate character limit
    if (!sentence || typeof sentence !== 'string') {
      return NextResponse.json(
        { error: 'Invalid input' },
        { status: 400 }
      );
    }

    const trimmedSentence = sentence.trim();
    if (trimmedSentence.length > CHARACTER_LIMIT) {
      return NextResponse.json(
        { error: `Input too long. Maximum ${CHARACTER_LIMIT} characters allowed.` },
        { status: 400 }
      );
    }

    if (trimmedSentence.length === 0) {
      return NextResponse.json(
        { error: 'Empty input not allowed.' },
        { status: 400 }
      );
    }

    const prompt = `
        Analyze the etymological origins of each word in this English sentence: "${trimmedSentence}"
        
        This must be completely historically accurate and you are forbidden from making up information.

        For each word, provide:
        1. The word itself
        2. Its primary etymological origin (Germanic, French, Latin, Greek, Arabic, Norse, Celtic, Spanish, Italian, Dutch, or Unknown)
        3. A brief explanation of its etymology and interesting details
        4. A confidence score from 0.0 to 1.0

        Return the response in this exact JSON format:
        {
            "words": [
                {
                    "word": "example",
                    "origin": "Latin",
                    "details": "From Latin 'exemplum' meaning pattern or sample",
                    "confidence": 0.95
                }
            ]
        }

        Include all words including articles and prepositions, but EXCLUDE punctuation marks.
        `;

    const message = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 2000,
      messages: [{ role: "user", content: prompt }]
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const responseText = (message.content[0] as any).text;
    
    let etymologyData;
    try {
      etymologyData = JSON.parse(responseText);
    } catch {
      // Try to extract JSON from the response
      const start = responseText.indexOf('{');
      const end = responseText.lastIndexOf('}') + 1;
      if (start !== -1 && end > start) {
        etymologyData = JSON.parse(responseText.substring(start, end));
      } else {
        throw new Error('Could not parse JSON response');
      }
    }

    const wordsWithColors = [];
    const originCounts: Record<string, number> = {};
    
    for (const wordData of etymologyData.words) {
      const origin = wordData.origin;
      const color = ORIGIN_COLORS[origin as keyof typeof ORIGIN_COLORS] || ORIGIN_COLORS["Unknown"];
      
      wordsWithColors.push({
        word: wordData.word,
        origin: origin,
        color: color,
        details: wordData.details,
        confidence: wordData.confidence
      });
      
      // Count words by origin
      originCounts[origin] = (originCounts[origin] || 0) + 1;
    }

    // Calculate percentages
    const totalWords = wordsWithColors.length;
    const percentages = [];
    
    for (const [origin, count] of Object.entries(originCounts)) {
      const percentage = (count / totalWords) * 100;
      const color = ORIGIN_COLORS[origin as keyof typeof ORIGIN_COLORS] || ORIGIN_COLORS["Unknown"];
      percentages.push({
        origin: origin,
        percentage: percentage,
        color: color
      });
    }
    
    // Sort by percentage descending
    percentages.sort((a, b) => b.percentage - a.percentage);

    return NextResponse.json({
      words: wordsWithColors,
      percentages: percentages,
      total_words: totalWords
    });

  } catch (error) {
    console.error('Error analyzing sentence:', error);
    return NextResponse.json(
      { error: 'Failed to analyze sentence' },
      { status: 500 }
    );
  }
}