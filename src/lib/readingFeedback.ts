export function getReadingFeedback(band: number): string {
  if (band >= 9.0) return '🌟 Excellent! Near-perfect performance with very high accuracy.';
  if (band >= 8.0) return '✅ Very good. You understand complex texts well — minor errors only.';
  if (band >= 7.0) return '👍 Good level of reading comprehension. Improve attention to detail.';
  if (band >= 6.0) return '🙂 Fair. Try to work on scanning and identifying key information.';
  if (band >= 5.0) return '😐 Moderate. Accuracy needs improvement — review question types.';
  if (band >= 4.0) return '⚠️ Weak. Focus on vocabulary and understanding passage structure.';
  return '❌ Very limited reading ability. Consider basic reading practice and strategy videos.';
}
