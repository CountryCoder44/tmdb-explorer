import { motion, useReducedMotion } from 'motion/react'

// Driven entirely by Motion's JS `animate` prop rather than a CSS
// @keyframes block, so no styling lives outside this component file.
const BLOBS = [
  { className: 'bg-amber-500/20', size: 480, start: { top: '5%', left: '10%' }, range: { x: [0, 120, -40, 0], y: [0, -60, 80, 0] }, duration: 26 },
  { className: 'bg-fuchsia-500/15', size: 520, start: { top: '40%', left: '65%' }, range: { x: [0, -100, 60, 0], y: [0, 90, -50, 0] }, duration: 32 },
  { className: 'bg-sky-500/15', size: 420, start: { top: '65%', left: '20%' }, range: { x: [0, 80, -90, 0], y: [0, -70, 40, 0] }, duration: 28 },
]

// Random x start, re-rolled once per full page load (this runs once at
// module evaluation, not per render) — the y position stays curated so the
// spread across the full viewport height is deliberate rather than left to chance.
// Biased toward the outer margins: the page content sits in a centered
// max-w-7xl column, so a uniform 0-100% roll mostly landed embers behind
// posters. Picking from the outer ~30% on each side keeps them in the open
// background instead.
const randomLeft = () => {
  const inLeftMargin = Math.random() < 0.5
  const start = inLeftMargin ? 0 : 70
  return `${start + Math.random() * 30}%`
}

// Smaller, sharper "ember" particles rendered behind the blobs (earlier in
// DOM order = lower in paint order, since neither layer sets an explicit
// z-index). Each one rises, fades in and out, then pauses (`repeatDelay`)
// before repeating. `repeatDelay` here is the original values divided by
// 1.5 — shortening the pause between cycles is what raises how often an
// ember drifts by (frequency) without changing how fast any single one moves.
const EMBERS = [
  { className: 'bg-orange-400', size: 5, top: '4%', left: randomLeft(), xDrift: 24, yDrift: -180, duration: 10, delay: 0, repeatDelay: 2 },
  { className: 'bg-purple-400', size: 4, top: '14%', left: randomLeft(), xDrift: -18, yDrift: -220, duration: 13, delay: 2.5, repeatDelay: 2.7 },
  { className: 'bg-orange-400', size: 6, top: '24%', left: randomLeft(), xDrift: 30, yDrift: -160, duration: 9, delay: 1, repeatDelay: 3.3 },
  { className: 'bg-purple-400', size: 3, top: '34%', left: randomLeft(), xDrift: -26, yDrift: -200, duration: 12, delay: 4, repeatDelay: 1.7 },
  { className: 'bg-orange-400', size: 4, top: '44%', left: randomLeft(), xDrift: 18, yDrift: -190, duration: 11, delay: 0.8, repeatDelay: 2.3 },
  { className: 'bg-purple-400', size: 5, top: '54%', left: randomLeft(), xDrift: -22, yDrift: -170, duration: 10, delay: 3.2, repeatDelay: 3 },
  { className: 'bg-orange-400', size: 3, top: '64%', left: randomLeft(), xDrift: 20, yDrift: -210, duration: 14, delay: 1.6, repeatDelay: 2 },
  { className: 'bg-purple-400', size: 6, top: '74%', left: randomLeft(), xDrift: -28, yDrift: -150, duration: 9, delay: 5, repeatDelay: 3.3 },
  { className: 'bg-orange-400', size: 4, top: '84%', left: randomLeft(), xDrift: 16, yDrift: -230, duration: 13, delay: 2, repeatDelay: 1.7 },
  { className: 'bg-purple-400', size: 5, top: '94%', left: randomLeft(), xDrift: -20, yDrift: -180, duration: 11, delay: 4.4, repeatDelay: 2.7 },
]

export function AnimatedBackground() {
  const reduceMotion = useReducedMotion()

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-neutral-950" aria-hidden="true">
      {!reduceMotion &&
        EMBERS.map((ember, index) => (
          <motion.div
            key={index}
            className={`absolute rounded-full blur-[1px] ${ember.className}`}
            style={{ width: ember.size, height: ember.size, top: ember.top, left: ember.left }}
            animate={{ y: [0, ember.yDrift], x: [0, ember.xDrift], opacity: [0, 0.9, 0] }}
            transition={{
              duration: ember.duration,
              delay: ember.delay,
              repeat: Infinity,
              repeatDelay: ember.repeatDelay,
              ease: 'easeInOut',
            }}
          />
        ))}

      {BLOBS.map((blob, index) => (
        <motion.div
          key={index}
          className={`absolute rounded-full blur-3xl ${blob.className}`}
          style={{ width: blob.size, height: blob.size, ...blob.start }}
          animate={reduceMotion ? undefined : { x: blob.range.x, y: blob.range.y }}
          transition={{ duration: blob.duration, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </div>
  )
}
