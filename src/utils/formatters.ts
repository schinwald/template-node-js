/**
 * Adds a prefix determiner to a word using proper vowel or cosonant identification
 * @param determiner a determiner word used for prefixing
 * @param word a word to use after the prefix
 * @returns a human-readable phrase
 */
export const prefixDeterminer = (determiner: 'a', word: string): string => {
  if (word.length === 0) return ''

  switch (determiner) {
    case 'a':
      // Prefix an if first letter of word is a vowel
      if (['a', 'e', 'i', 'o', 'u'].includes(word[0])) {
        return `an ${word}`
      // Prefix a if first letter of word is a consonant
      } else {
        return `a ${word}`
      }
  }
}

/**
 * Joins a list of words so that it is human-readable
 * @param conjunction a word to combine the list of words
 * @param words a list of words
 * @returns a human-readable list of words
 */
export const humanReadableJoin = (conjunction: 'and' | 'or', words: string[]): string => {
  if (words.length === 0) return ''

  // Check if conjuncation is reguired
  if (words.length === 1) {
    return words[0]
  } else {
    return `${words.slice(0, -1).join(', ')} ${conjunction} ${words[words.length - 1]}`
  }
}
