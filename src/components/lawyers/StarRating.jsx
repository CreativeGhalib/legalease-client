import { useRef } from 'react'
import { Star } from 'lucide-react'

function StarGlyph({ filled, size = 16 }) {
  return (
    <Star
      size={size}
      aria-hidden="true"
      className={filled ? 'fill-[#d4a843] text-[#d4a843]' : 'fill-transparent text-slate-300 dark:text-[#374c62]'}
    />
  )
}

export function StarDisplay({ value = 0, size = 15 }) {
  return (
    <span
      role="img"
      aria-label={`Rated ${Math.round(value * 10) / 10} out of 5`}
      className="inline-flex items-center gap-0.5"
    >
      {[1, 2, 3, 4, 5].map((star) => (
        <StarGlyph key={star} filled={star <= Math.round(value)} size={size} />
      ))}
    </span>
  )
}

export default function StarRatingInput({ value = 0, onChange, label = 'Your rating' }) {
  const refs = useRef([])

  function move(next, focusIndex) {
    const clamped = Math.min(5, Math.max(1, next))
    onChange(clamped)
    requestAnimationFrame(() => refs.current[clamped - 1]?.focus())
    void focusIndex
  }

  return (
    <div
      role="radiogroup"
      aria-label={label}
      onKeyDown={(event) => {
        const keys = { ArrowRight: 1, ArrowUp: 1, ArrowLeft: -1, ArrowDown: -1 }
        if (event.key in keys) {
          event.preventDefault()
          move((value || 0) + keys[event.key])
        }
        if (event.key === 'Home') { event.preventDefault(); move(1) }
        if (event.key === 'End') { event.preventDefault(); move(5) }
      }}
      className="inline-flex items-center gap-1"
    >
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          ref={(node) => { refs.current[star - 1] = node }}
          type="button"
          role="radio"
          aria-checked={value === star}
          aria-label={`Rate ${star} star${star === 1 ? '' : 's'}`}
          tabIndex={value === star || (value === 0 && star === 1) ? 0 : -1}
          onClick={() => onChange(star)}
          className="grid h-9 w-9 place-items-center rounded-md transition hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1b3a6b] dark:hover:bg-[#162236]"
        >
          <StarGlyph filled={star <= value} size={20} />
        </button>
      ))}
    </div>
  )
}
