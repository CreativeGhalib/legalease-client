import { useEffect, useRef } from 'react'

const candidateSelector = 'a[href], button, input, select, textarea, [tabindex]'

function isEffectivelyHidden(element) {
  let current = element
  while (current instanceof HTMLElement) {
    if (current.hidden || current.getAttribute('aria-hidden') === 'true') return true
    const style = window.getComputedStyle(current)
    if (style.display === 'none' || style.visibility === 'hidden') return true
    current = current.parentElement
  }
  return false
}

function isFocusable(element) {
  if (element.tabIndex < 0 || element.matches(':disabled')) return false
  return !isEffectivelyHidden(element)
}

export default function useModalFocus(isOpen, onClose, closeOnEscape = true) {
  const containerRef = useRef(null)
  const onCloseRef = useRef(onClose)
  const closeOnEscapeRef = useRef(closeOnEscape)
  onCloseRef.current = onClose
  closeOnEscapeRef.current = closeOnEscape

  useEffect(() => {
    if (!isOpen) return undefined
    const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null
    const focusables = () => [...(containerRef.current?.querySelectorAll(candidateSelector) ?? [])]
      .filter(isFocusable)
    const frame = requestAnimationFrame(() => {
      if (!containerRef.current || isEffectivelyHidden(containerRef.current)) return
      const first = focusables()[0]
      if (first) first.focus()
      else { containerRef.current?.setAttribute('tabindex', '-1'); containerRef.current?.focus() }
    })
    function onKeyDown(event) {
      if (!containerRef.current || isEffectivelyHidden(containerRef.current)) return
      if (event.key === 'Escape') {
        if (closeOnEscapeRef.current) { event.preventDefault(); onCloseRef.current?.() }
        return
      }
      if (event.key !== 'Tab') return
      const items = focusables()
      if (!items.length) { event.preventDefault(); containerRef.current?.focus(); return }
      const first = items[0]; const last = items[items.length - 1]
      if (!items.includes(document.activeElement)) {
        event.preventDefault()
        if (event.shiftKey) last.focus()
        else first.focus()
        return
      }
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus() }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus() }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('keydown', onKeyDown)
      if (previous?.isConnected && !isEffectivelyHidden(previous)) previous.focus()
    }
  }, [isOpen])
  return containerRef
}
