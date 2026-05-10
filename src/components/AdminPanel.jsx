import { useState } from 'react'
import {
  getStats, getSessions, getEntries, getEmailOptIns,
  getLastReset, resetLeaderboard, resetAll,
} from '../lib/leaderboard'
import { toCsv, downloadCsv, fileStamp } from '../lib/csv'

// ─── CSV column maps ─────────────────────────────────────────────────────
const SESSION_COLS = [
  { key: 'id',                header: 'ID' },
  { key: 'date',              header: 'Date' },
  { key: 'institution',       header: 'Institution' },
  { key: 'discipline',        header: 'Discipline' },
  { key: 'score',             header: 'Score' },
  { key: 'flagsCount',        header: 'Flags' },
  { key: 'correctlyFlagged',  header: 'Correctly Flagged' },
  { key: 'falseFlags',        header: 'False Flags' },
  { key: 'timeUsed',          header: 'Time Used (s)' },
]
const LEADERBOARD_COLS = [
  { key: 'id',          header: 'ID' },
  { key: 'date',        header: 'Date' },
  { key: 'name',        header: 'Name' },
  { key: 'institution', header: 'Institution' },
  { key: 'discipline',  header: 'Discipline' },
  { key: 'score',       header: 'Score' },
  { key: 'email',       header: 'Email' },
  { key: 'optIn',       header: 'Email Opt-In' },
]
const OPTIN_COLS = [
  { key: 'date',        header: 'Date' },
  { key: 'name',        header: 'Name' },
  { key: 'email',       header: 'Email' },
  { key: 'institution', header: 'Institution' },
  { key: 'discipline',  header: 'Discipline' },
  { key: 'score',       header: 'Score' },
]

function formatLastReset(iso) {
  if (!iso) return 'never'
  return new Date(iso).toLocaleString()
}

// ─── Stat card ────────────────────────────────────────────────────────────
function Stat({ label, value }) {
  return (
    <div className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-3">
      <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">{label}</p>
      <p className="text-2xl font-black text-gray-900 tabular-nums">{value}</p>
    </div>
  )
}

// ─── Confirmation modal ──────────────────────────────────────────────────
function ConfirmModal({ scope, counts, onConfirm, onCancel }) {
  const isAll = scope === 'all'
  const summary = isAll
    ? `${counts.leaderboardCount + counts.sessionsCount} entries (${counts.leaderboardCount} leaderboard · ${counts.sessionsCount} sessions${counts.emailOptIns ? ` · ${counts.emailOptIns} email opt-ins` : ''})`
    : `${counts.leaderboardCount} leaderboard ${counts.leaderboardCount === 1 ? 'entry' : 'entries'}`

  return (
    <div className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 max-w-md w-full p-6">
        <p className="text-lg font-black text-gray-900 mb-2">
          {isAll ? 'Reset everything?' : 'Reset leaderboard?'}
        </p>
        <p className="text-sm text-gray-600 leading-relaxed mb-5">
          This will permanently delete <strong>{summary}</strong>. A CSV backup will be downloaded to your machine before deletion. Continue?
        </p>
        <div className="flex gap-3 justify-end">
          <button
            onPointerDown={onCancel}
            className="px-5 py-2.5 rounded-lg border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition-colors touch-target"
          >
            Cancel
          </button>
          <button
            onPointerDown={onConfirm}
            className="px-5 py-2.5 rounded-lg bg-nexus-red hover:bg-nexus-red-dark text-white font-bold transition-colors touch-target"
          >
            Yes, delete
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Main panel ──────────────────────────────────────────────────────────
export default function AdminPanel({ onClose }) {
  const [stats,     setStats]     = useState(getStats())
  const [lastReset, setLastResetState] = useState(getLastReset())
  const [confirm,   setConfirm]   = useState(null) // 'leaderboard' | 'all' | null
  const [message,   setMessage]   = useState(null) // { kind, text }

  function refresh() {
    setStats(getStats())
    setLastResetState(getLastReset())
  }

  function flash(kind, text) {
    setMessage({ kind, text })
    if (kind === 'success' || kind === 'info') {
      setTimeout(() => setMessage(null), 6000)
    }
  }

  // ── Manual exports ────────────────────────────────────────
  function exportSessions() {
    const data = getSessions()
    if (!data.length) { flash('info', 'No sessions to export.'); return }
    downloadCsv(`nexus-sessions-${fileStamp()}.csv`, toCsv(data, SESSION_COLS))
    flash('success', `Exported ${data.length} session${data.length === 1 ? '' : 's'}.`)
  }

  function exportOptIns() {
    const data = getEmailOptIns()
    if (!data.length) { flash('info', 'No email opt-ins to export.'); return }
    downloadCsv(`nexus-optins-${fileStamp()}.csv`, toCsv(data, OPTIN_COLS))
    flash('success', `Exported ${data.length} email opt-in${data.length === 1 ? '' : 's'}.`)
  }

  // ── Resets — auto-export first, then delete ──────────────
  function performReset() {
    const stamp = fileStamp()
    let backups = 0
    let deleted = 0

    if (confirm === 'leaderboard') {
      const lb = getEntries()
      if (lb.length) {
        downloadCsv(`nexus-leaderboard-backup-${stamp}.csv`, toCsv(lb, LEADERBOARD_COLS))
        backups++
      }
      deleted = resetLeaderboard()
      flash('success',
        `Data reset complete. ${deleted} leaderboard entr${deleted === 1 ? 'y' : 'ies'} deleted.${
          backups ? ' Backup saved to your downloads.' : ''
        }`)
    } else if (confirm === 'all') {
      const lb = getEntries()
      const sessions = getSessions()
      const opt = getEmailOptIns()
      if (lb.length)       { downloadCsv(`nexus-leaderboard-backup-${stamp}.csv`, toCsv(lb, LEADERBOARD_COLS));  backups++ }
      if (sessions.length) { downloadCsv(`nexus-sessions-backup-${stamp}.csv`,    toCsv(sessions, SESSION_COLS)); backups++ }
      if (opt.length)      { downloadCsv(`nexus-optins-backup-${stamp}.csv`,      toCsv(opt, OPTIN_COLS));        backups++ }
      deleted = resetAll()
      flash('success',
        `Data reset complete. ${deleted} entr${deleted === 1 ? 'y' : 'ies'} deleted.${
          backups ? ` Backups saved to your downloads (${backups} file${backups === 1 ? '' : 's'}).` : ''
        }`)
    }

    setConfirm(null)
    refresh()
  }

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 max-w-2xl w-full max-h-[88vh] overflow-y-auto">

          {/* Header */}
          <div className="flex items-center justify-between gap-4 px-6 py-5 border-b border-gray-100 sticky top-0 bg-white z-10">
            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-gray-400">🛠 Admin Panel</p>
              <p className="text-xs text-gray-500 mt-0.5">Data last reset: <strong className="text-gray-700">{formatLastReset(lastReset)}</strong></p>
            </div>
            <button
              onPointerDown={onClose}
              className="w-9 h-9 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-100 hover:text-gray-800 transition-colors touch-target"
              aria-label="Close"
            >
              ✕
            </button>
          </div>

          {/* Body */}
          <div className="px-6 py-5 flex flex-col gap-6">

            {/* Stats */}
            <section>
              <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Stats overview</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <Stat label="Sessions"    value={stats.sessionsCount} />
                <Stat label="Leaderboard" value={stats.leaderboardCount} />
                <Stat label="Email opt-ins" value={stats.emailOptIns} />
                <Stat label="Top score"   value={stats.topScore} />
              </div>
            </section>

            {/* Export */}
            <section>
              <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Export</p>
              <div className="flex flex-wrap gap-3">
                <button
                  onPointerDown={exportSessions}
                  className="flex-1 min-w-[200px] bg-[#5E33BF] hover:bg-[#4A25A0] active:scale-[0.99] text-white font-bold text-sm px-5 py-3 rounded-xl transition-all touch-target"
                >
                  📥 Export sessions CSV
                </button>
                <button
                  onPointerDown={exportOptIns}
                  className="flex-1 min-w-[200px] bg-[#5E33BF] hover:bg-[#4A25A0] active:scale-[0.99] text-white font-bold text-sm px-5 py-3 rounded-xl transition-all touch-target"
                >
                  📥 Export email opt-ins CSV
                </button>
              </div>
            </section>

            {/* Reset */}
            <section>
              <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Reset</p>
              <div className="flex flex-wrap gap-3">
                <button
                  onPointerDown={() => setConfirm('leaderboard')}
                  disabled={stats.leaderboardCount === 0}
                  className="flex-1 min-w-[200px] border-2 border-nexus-red text-nexus-red hover:bg-nexus-red hover:text-white active:scale-[0.99] font-bold text-sm px-5 py-3 rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed touch-target"
                >
                  Reset leaderboard only
                </button>
                <button
                  onPointerDown={() => setConfirm('all')}
                  disabled={stats.leaderboardCount === 0 && stats.sessionsCount === 0}
                  className="flex-1 min-w-[200px] bg-nexus-red hover:bg-nexus-red-dark active:scale-[0.99] text-white font-bold text-sm px-5 py-3 rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed touch-target"
                >
                  Reset everything
                </button>
              </div>
              <p className="text-[11px] text-gray-400 leading-relaxed mt-2">
                A CSV backup of the affected data is automatically downloaded to your machine before any deletion.
              </p>
            </section>

            {/* Message */}
            {message && (
              <div
                className="rounded-xl px-4 py-3 text-sm leading-relaxed"
                style={{
                  background: message.kind === 'success' ? '#DCFCE7' : '#F3F4F6',
                  color:      message.kind === 'success' ? '#166534' : '#374151',
                  border:     message.kind === 'success' ? '1px solid #86EFAC' : '1px solid #E5E7EB',
                }}
              >
                {message.text}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-100 flex justify-end">
            <button
              onPointerDown={onClose}
              className="px-5 py-2.5 rounded-lg border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition-colors touch-target"
            >
              Close
            </button>
          </div>
        </div>
      </div>

      {confirm && (
        <ConfirmModal
          scope={confirm}
          counts={stats}
          onConfirm={performReset}
          onCancel={() => setConfirm(null)}
        />
      )}
    </>
  )
}
