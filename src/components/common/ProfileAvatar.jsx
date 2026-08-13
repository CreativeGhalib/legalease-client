import { useEffect, useState } from 'react'

function initials(name) {
  return name?.trim().split(/\s+/).map((part) => part[0]).slice(0, 2).join('').toUpperCase() || 'LE'
}

export default function ProfileAvatar({ src, name, alt, className = 'h-12 w-12', textClassName = 'text-sm' }) {
  const [failed, setFailed] = useState(false)
  useEffect(() => setFailed(false), [src])

  return (
    <div className={`shrink-0 overflow-hidden rounded-full bg-gradient-to-br from-indigo-100 to-violet-50 ring-1 ring-slate-200 ${className}`}>
      {src && !failed
        ? <img src={src} alt={alt} onError={() => setFailed(true)} className="h-full w-full object-cover" />
        : <span aria-label={alt} className={`grid h-full w-full place-items-center font-semibold text-indigo-700 ${textClassName}`}>{initials(name)}</span>}
    </div>
  )
}
