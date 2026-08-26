import { useEffect, useRef, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { NavLink, useLocation } from 'react-router-dom'

/**
 * Accessible dashboard dropdown for the public navbar.
 *
 * Keyboard contract: Escape closes (returning focus to the trigger),
 * ArrowDown/ArrowUp cycle items with wrap-around, Enter activates the
 * focused link natively, Space activates the focused item, and Tab closes
 * while continuing natural focus order. Click-outside closes as well.
 */
export default function NavDropdown({ label = 'Dashboard', items = [], onNavigate }) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef(null)
  const triggerRef = useRef(null)
  const itemRefs = useRef([])
  const location = useLocation()

  useEffect(() => {
    setOpen(false)
  }, [location.pathname, location.search])

  useEffect(() => {
    if (!open) return undefined

    function onPointerDown(event) {
      if (rootRef.current && !rootRef.current.contains(event.target)) setOpen(false)
    }

    document.addEventListener('mousedown', onPointerDown)
    return () => document.removeEventListener('mousedown', onPointerDown)
  }, [open])

  useEffect(() => {
    if (open) itemRefs.current[0]?.focus()
  }, [open])

  function toggleViaKeyboard(event) {
    if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      setOpen(true)
    }
  }

  function handleRootKeyDown(event) {
    if (!open) return

    if (
      document.activeElement === triggerRef.current &&
      (event.key === 'ArrowDown' || event.key === 'ArrowUp')
    ) {
      event.preventDefault()
      const index = event.key === 'ArrowDown' ? 0 : items.length - 1
      itemRefs.current[index]?.focus()
      return
    }

    if (event.key === 'Escape') {
      event.preventDefault()
      setOpen(false)
      triggerRef.current?.focus()
      return
    }

    if (event.key === 'Tab') {
      setOpen(false)
      return
    }

    const count = items.length
    if (count === 0) return
    const currentIndex = itemRefs.current.indexOf(document.activeElement)

    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault()
      let nextIndex
      if (currentIndex === -1) {
        nextIndex = event.key === 'ArrowDown' ? 0 : count - 1
      } else {
        nextIndex = (currentIndex + (event.key === 'ArrowDown' ? 1 : -1) + count) % count
      }
      itemRefs.current[nextIndex]?.focus()
      return
    }

    if (event.key === ' ' && currentIndex !== -1) {
      event.preventDefault()
      itemRefs.current[currentIndex]?.click()
    }
  }

  const itemClass = ({ isActive }) =>
    `flex min-h-11 items-center rounded-lg px-3 text-sm font-semibold transition focus:outline-none ${
      isActive
        ? 'bg-[#e8eef8] text-[#1b3a6b] dark:bg-[#d4a843]/10 dark:text-[#d4a843]'
        : 'text-[#364358] hover:bg-[#e5dccf] dark:text-[#96a8b8] dark:hover:bg-[#22303e]'
    }`

  return (
    <div ref={rootRef} className="relative" onKeyDown={handleRootKeyDown}>
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="true"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        onKeyDown={toggleViaKeyboard}
        className="inline-flex min-h-11 items-center gap-1.5 border-b-2 border-transparent px-0.5 py-2 text-sm font-semibold tracking-[0.01em] text-[#364358] transition hover:border-[#c5b89e] hover:text-[#0c1827] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1b3a6b] dark:text-[#96a8b8] dark:hover:border-[#374c62] dark:hover:text-[#e4d9c5]"
      >
        {label}
        <ChevronDown size={15} className={`transition-transform ${open ? 'rotate-180' : ''}`} aria-hidden="true" />
      </button>

      {open && (
        <nav
          role="menu"
          aria-label={`${label} navigation`}
          className="absolute right-0 top-full z-50 mt-2 w-60 overflow-hidden rounded-xl border border-[#d8ccb8] bg-[#fdf9f2] p-1.5 shadow-xl dark:border-[#2a3850] dark:bg-[#161d27]"
        >
          {items.map((item, index) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/dashboard'}
              role="menuitem"
              ref={(node) => {
                itemRefs.current[index] = node
              }}
              className={itemClass}
              onClick={() => {
                setOpen(false)
                onNavigate?.(item)
              }}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      )}
    </div>
  )
}
