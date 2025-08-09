export function toUTC(date: Date) {
  return new Date(date.toISOString());
}

export function toEgyptTime(date: Date) {
  return new Date(date.getTime() + 3 * 60 * 60 * 1000);
}
