export function getBandColorClass(band: number): string {
  if (band >= 8.0) return 'bg-green-200 text-green-800';
  if (band >= 6.0) return 'bg-yellow-200 text-yellow-800';
  return 'bg-red-200 text-red-800';
}
