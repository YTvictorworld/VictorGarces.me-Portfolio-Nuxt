/**
 * An album's date as the page shows it: `Sep 2025` for a day or a month, `2025` for a year.
 * The day is left out on purpose: an album is an event, and the month is what people remember.
 * UTC, so the prerendered text and the hydrated text never fall on different days.
 */
export function formatAlbumDate(date: string | undefined, locale: string): string | undefined {
  if (!date) return undefined
  const [year, month] = date.split('-')
  if (!month) return year
  return new Intl.DateTimeFormat(locale, { month: 'short', year: 'numeric', timeZone: 'UTC' })
    .format(new Date(Date.UTC(Number(year), Number(month) - 1, 1)))
}
