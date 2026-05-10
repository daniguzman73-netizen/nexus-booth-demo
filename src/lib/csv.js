// Small CSV helpers — no external deps.

function escape(v) {
  if (v == null) return ''
  const s = String(v)
  if (/[",\n\r]/.test(s)) return '"' + s.replace(/"/g, '""') + '"'
  return s
}

/**
 * Convert an array of objects to a CSV string.
 * @param {Array<object>} rows
 * @param {Array<{key:string, header?:string}>} columns
 */
export function toCsv(rows, columns) {
  const header = columns.map(c => escape(c.header || c.key)).join(',')
  const body = rows.map(r => columns.map(c => escape(r[c.key])).join(',')).join('\r\n')
  return header + '\r\n' + body + (rows.length ? '\r\n' : '')
}

/**
 * Trigger a browser download of a CSV string with the given filename.
 */
export function downloadCsv(filename, csv) {
  const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  setTimeout(() => {
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }, 1000)
}

/** Filename-safe timestamp like "2026-05-10T15-04-22". */
export function fileStamp() {
  return new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-')
}
