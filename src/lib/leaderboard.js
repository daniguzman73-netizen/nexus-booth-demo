// All booth-side data lives in localStorage under three keys:
//   nexus_leaderboard — leaderboard entries (player + score)
//   nexus_sessions    — every challenge submission (analytics)
//   nexus_last_reset  — ISO timestamp of the last admin-panel reset
const KEY_LB    = 'nexus_leaderboard'
const KEY_SESS  = 'nexus_sessions'
const KEY_RESET = 'nexus_last_reset'
const MAX_LB    = 50
const MAX_SESS  = 500

// ─── Leaderboard ──────────────────────────────────────────────────────────
export function getEntries() {
  try { return JSON.parse(localStorage.getItem(KEY_LB) || '[]') } catch { return [] }
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
  const updated = [entry, ...entries].slice(0, MAX_LB)
  localStorage.setItem(KEY_LB, JSON.stringify(updated))
  return entry
}

export function getRank(score) {
  return getEntries().filter(e => e.score > score).length + 1
}

export function getTopEntries(n = 10) {
  return getEntries().sort((a, b) => b.score - a.score).slice(0, n)
}

// ─── Sessions ─────────────────────────────────────────────────────────────
export function getSessions() {
  try { return JSON.parse(localStorage.getItem(KEY_SESS) || '[]') } catch { return [] }
}

export function recordSession(session) {
  const sessions = getSessions()
  const record = {
    id: Date.now(),
    date: new Date().toISOString(),
    institution:      session.institution      ?? '',
    discipline:       session.discipline       ?? '',
    score:            session.score            ?? 0,
    flagsCount:       session.flagsCount       ?? 0,
    correctlyFlagged: session.correctlyFlagged ?? 0,
    falseFlags:       session.falseFlags       ?? 0,
    timeUsed:         session.timeUsed         ?? 0,
  }
  const updated = [record, ...sessions].slice(0, MAX_SESS)
  localStorage.setItem(KEY_SESS, JSON.stringify(updated))
  return record
}

// ─── Email opt-ins (derived from leaderboard entries) ────────────────────
export function getEmailOptIns() {
  return getEntries().filter(e => e.optIn && e.email)
}

// ─── Stats ────────────────────────────────────────────────────────────────
export function getStats() {
  const entries  = getEntries()
  const sessions = getSessions()
  return {
    sessionsCount:    sessions.length,
    leaderboardCount: entries.length,
    emailOptIns:      entries.filter(e => e.optIn && e.email).length,
    topScore:         entries.reduce((m, e) => Math.max(m, e.score), 0),
  }
}

// ─── Last-reset timestamp ─────────────────────────────────────────────────
export function getLastReset() {
  return localStorage.getItem(KEY_RESET) || null
}

function stampReset() {
  const ts = new Date().toISOString()
  localStorage.setItem(KEY_RESET, ts)
  return ts
}

// ─── Resets ───────────────────────────────────────────────────────────────
export function resetLeaderboard() {
  const count = getEntries().length
  localStorage.removeItem(KEY_LB)
  stampReset()
  return count
}

export function resetAll() {
  const lbCount   = getEntries().length
  const sessCount = getSessions().length
  localStorage.removeItem(KEY_LB)
  localStorage.removeItem(KEY_SESS)
  stampReset()
  return lbCount + sessCount
}
