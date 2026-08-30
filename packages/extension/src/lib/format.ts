export function timeLabel(value: number) {
  const date = new Date(value)
  const today = new Date().toDateString() === date.toDateString()
  return date.toLocaleString(
    undefined,
    today ? { hour: "numeric", minute: "2-digit" } : { month: "short", day: "numeric" }
  )
}

export function fullTimeLabel(value: number) {
  return new Date(value).toLocaleString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  })
}
