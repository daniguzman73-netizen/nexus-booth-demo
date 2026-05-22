// Given a base scenario (pool of citations + intro/outro), build a concrete
// game scenario: pick 1 verified citation + 4 bad citations with a guaranteed
// difficulty spread, shuffle their positions, assign sequential ids 1..5,
// and synthesize the AI response text from each citation's claim_text.

// Bucketing of bad statuses:
//   CATCHABLE — a player can plausibly catch these by careful reading
//               (predatory journals, unreviewed preprints).
//   HARD      — virtually impossible to catch without database access;
//               this is the territory Nexus uniquely covers.
const CATCHABLE = new Set(['predatory', 'preprint'])
const HARD      = new Set(['unverified', 'inaccessible', 'retracted'])

function shuffle(arr, rng = Math.random) {
  const a = arr.slice()
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function pickOne(arr, rng) {
  return arr[Math.floor(rng() * arr.length)]
}

function sampleN(arr, n, rng) {
  return shuffle(arr, rng).slice(0, n)
}

function meetsDifficultySpread(bad) {
  const catchableCount = bad.filter(c => CATCHABLE.has(c.status)).length
  const hardCount      = bad.filter(c => HARD.has(c.status)).length
  return catchableCount >= 1 && hardCount >= 1
}

/**
 * Pick 4 bad citations satisfying the difficulty-spread guarantee.
 * Strategy: take one from CATCHABLE, one from HARD, then fill the remaining
 * slots from whatever is still available in the bad pool.
 */
function pickBadCitations(badPool, rng) {
  const catchablePool = badPool.filter(c => CATCHABLE.has(c.status))
  const hardPool      = badPool.filter(c => HARD.has(c.status))

  // Defensive fallback — if a scenario somehow lacks a bucket, just sample 4
  // from the bad pool. (Shouldn't happen with the data we ship.)
  if (catchablePool.length === 0 || hardPool.length === 0) {
    return sampleN(badPool, 4, rng)
  }

  // Seed one from each required bucket
  const seedCatchable = pickOne(catchablePool, rng)
  const seedHard      = pickOne(hardPool.filter(c => c !== seedCatchable), rng) ?? pickOne(hardPool, rng)

  const remainingPool = badPool.filter(c => c !== seedCatchable && c !== seedHard)
  const fillers = sampleN(remainingPool, Math.max(0, 4 - 2), rng)

  const bad = [seedCatchable, seedHard, ...fillers].slice(0, 4)

  // Sanity: if we ended up under quota (very small pool), top up from full
  // bad pool to reach 4. Then verify the spread; if it fails (only possible
  // with degenerate data), accept anyway.
  if (bad.length < 4) {
    const others = badPool.filter(c => !bad.includes(c))
    bad.push(...sampleN(others, 4 - bad.length, rng))
  }
  return bad.slice(0, 4)
}

/**
 * Build the AI response paragraph from intro + selected claim_texts + outro.
 * Each claim becomes "<claim_text> [N]." and they are joined with single
 * spaces to form one body paragraph. Triple-newline gap between paragraphs
 * is preserved by the renderer's `whitespace-pre-line`.
 */
function buildResponseText(intro, positioned, outro) {
  const body = positioned
    .map(c => `${c.claim_text} [${c.id}].`)
    .join(' ')
  const parts = []
  if (intro) parts.push(intro)
  parts.push(body)
  if (outro) parts.push(outro)
  return parts.join('\n\n')
}

/**
 * @param {object} scenario  Base scenario from scenarios.json.
 * @param {() => number} [rng]  RNG hook (mainly for tests).
 * @returns {object} A concrete game scenario with 5 citations and ai_response.
 */
export function buildGameScenario(scenario, rng = Math.random) {
  const verifiedPool = scenario.citations.filter(c => c.status === 'verified')
  const badPool      = scenario.citations.filter(c => c.status !== 'verified')

  const verified = pickOne(verifiedPool, rng)

  // Try up to a few times to satisfy the spread, then accept the last try.
  let bad = pickBadCitations(badPool, rng)
  for (let attempt = 0; attempt < 8 && !meetsDifficultySpread(bad); attempt++) {
    bad = pickBadCitations(badPool, rng)
  }

  const selected = shuffle([verified, ...bad], rng)
  const positioned = selected.map((c, i) => ({ ...c, id: i + 1 }))

  return {
    ...scenario,
    citations: positioned,
    ai_response: buildResponseText(scenario.intro, positioned, scenario.outro),
  }
}
