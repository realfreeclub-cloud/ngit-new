/**
 * Core Typing Engine Logic
 * Standard: 1 Word = 5 Characters (including spaces)
 */

export interface TypingMetrics {
  wpm: number;
  rawWpm: number;
  accuracy: number;
  errorCount: number;
  totalCharacters: number;
}

/**
 * Calculates typing metrics based on the provided input and original passage
 * @param typedText The text entered by the user
 * @param passage The original text to compare against
 * @param timeMinutes Time elapsed in minutes
 * @returns Object containing WPM, Raw WPM, Accuracy, and Error Count
 */
export const calculateMetrics = (
  typedText: string,
  passage: string,
  timeMinutes: number
): TypingMetrics => {
  if (timeMinutes <= 0) timeMinutes = 0.01; // Avoid division by zero

  const originalWords = passage.trim().split(/\s+/);
  const typedWords = typedText.trim().split(/\s+/);
  
  let errors = 0;
  const totalCharacters = typedText.length;

  // Word-by-word error detection
  typedWords.forEach((word, idx) => {
    if (idx < originalWords.length) {
      if (word !== originalWords[idx]) {
        errors++;
      }
    } else {
      // Extra words typed are also counted as errors
      errors++;
    }
  });

  // Gross WPM (Raw Speed): (Total Characters / 5) / Time
  const rawWpm = Math.round((totalCharacters / 5) / timeMinutes);

  // Net WPM (Adjusted Speed): Gross WPM - (Errors / Time)
  // Standard Government Formula: Net WPM = ((Total Characters / 5) - Errors) / Time
  const netWpm = Math.round(((totalCharacters / 5) - errors) / timeMinutes);

  // Accuracy: ((Correct Characters) / Total Characters) * 100
  // Note: We use a simplified character-based accuracy for live feedback
  const accuracy = totalCharacters > 0 
    ? Math.max(0, Math.round(((totalCharacters - errors) / totalCharacters) * 100)) 
    : 100;

  return {
    wpm: Math.max(0, netWpm),
    rawWpm: Math.max(0, rawWpm),
    accuracy,
    errorCount: errors,
    totalCharacters
  };
};

/**
 * Detailed Character Comparison for highlighting
 * Returns state for each character in the current word
 */
export const compareCharacters = (original: string, typed: string) => {
  return original.split('').map((char, index) => {
    if (index >= typed.length) return 'pending';
    return char === typed[index] ? 'correct' : 'incorrect';
  });
};
