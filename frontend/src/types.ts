export interface WordOrigin {
  word: string;
  origin: string;
  color: string;
  details: string;
  confidence: number;
}

export interface OriginPercentage {
  origin: string;
  percentage: number;
  color: string;
}

export interface EtymologyResponse {
  words: WordOrigin[];
  percentages: OriginPercentage[];
  total_words: number;
}