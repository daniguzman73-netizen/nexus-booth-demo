const KEY = 'nexus_leaderboard'
const MAX_ENTRIES = 50

export function getEntries() {
  try {
    return JSON.parse(localStorage.getItem(KEY) || '[]')
  } catch {
    return []
  }
}

export function addEntry({ name, institution, email, optIn, score, discipline }) {
  const entries = getEntries()
  const entry = {
    id: Date.now(),
    name: name.trim(),
    institution: institution || '',
    email: email?.trim() || '',
    optIn: Boolean(optIn),
    score,
    discipline,
    date: new Date().toISOString(),
  }
  const updated = [entry, ...entries].slice(0, MAX_ENTRIES)
  localStorage.setItem(KEY, JSON.stringify(updated))
  return entry
}

export function getRank(score) {
  const entries = getEntries()
  return entries.filter(e => e.score > score).length + 1
}

export function getTopEntries(n = 10) {
  return getEntries()
    .sort((a, b) => b.score - a.score)
    .slice(0, n)
}
