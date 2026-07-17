export const formatDate = (date: Date | string, locale = 'en-US'): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return dateObj.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    // front-matter dates are date-only UTC values; format them as written
    timeZone: 'UTC'
  })
}
