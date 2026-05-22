const ISSUE_STATUSES = new Set(['predatory', 'preprint', 'inaccessible', 'unverified', 'retracted'])

export function isIssue(status) {
  return ISSUE_STATUSES.has(status)
}

export function computeScore({ citations, flags, timeUsed }) {
  const correctlyFlagged = flags.filter(id => {
    const c = citations.find(c => c.id === id)
    return c && isIssue(c.status)
  }).length

  const falseFlags = flags.filter(id => {
    const c = citations.find(c => c.id === id)
    return c && !isIssue(c.status)
  }).length

  const timePenalty = Math.max(0, timeUsed - 20)
  return Math.max(0, correctlyFlagged * 100 - falseFlags * 50 - timePenalty)
}

export function scoreBreakdown({ citations, flags, timeUsed }) {
  const correctlyFlagged = flags.filter(id => {
    const c = citations.find(c => c.id === id)
    return c && isIssue(c.status)
  }).length

  const falseFlags = flags.filter(id => {
    const c = citations.find(c => c.id === id)
    return c && !isIssue(c.status)
  }).length

  const timePenalty = Math.max(0, timeUsed - 20)
  const total = Math.max(0, correctlyFlagged * 100 - falseFlags * 50 - timePenalty)

  return { correctlyFlagged, falseFlags, timePenalty, total }
}
