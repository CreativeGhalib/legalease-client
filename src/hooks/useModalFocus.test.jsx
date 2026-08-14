import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { useState } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import useBodyScrollLock from './useBodyScrollLock'
import useCloseOnDesktop from './useCloseOnDesktop'
import useModalFocus from './useModalFocus'

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
  document.body.style.overflow = ''
  document.body.removeAttribute('tabindex')
})

function Overlay({ children, closeOnEscape = true, onClose, open, style }) {
  const ref = useModalFocus(open, onClose, closeOnEscape)
  return open ? <div ref={ref} role="dialog" style={style}>{children ?? <><button>First</button><button>Last</button></>}</div> : null
}

function ResponsiveDrawer() {
  const [open, setOpen] = useState(false)
  const [desktop, setDesktop] = useState(false)
  useBodyScrollLock(open)
  useCloseOnDesktop(() => { setDesktop(true); setOpen(false) })
  const ref = useModalFocus(open, () => setOpen(false))
  return <><button style={desktop ? { display: 'none' } : undefined} onClick={() => setOpen(true)}>Open drawer</button>{open && <div ref={ref} role="dialog" aria-label="Test drawer"><button>Drawer link</button></div>}</>
}

function PendingCommentDialog() {
  const [pending, setPending] = useState(false)
  const ref = useModalFocus(true, vi.fn())
  return <div ref={ref} role="dialog"><textarea aria-label="Comment" /><button>Cancel</button><button disabled={pending} onClick={() => setPending(true)}>Save</button></div>
}

function RemovingControlDialog() {
  const [showAction, setShowAction] = useState(true)
  const ref = useModalFocus(true, vi.fn())
  return <div ref={ref} role="dialog"><button>First remaining</button>{showAction && <button onClick={() => setShowAction(false)}>Remove action</button>}<button>Last remaining</button></div>
}

describe('useModalFocus', () => {
  it('traps focus, uses the latest close callback, and restores trigger focus', async () => {
    const firstClose = vi.fn()
    const latestClose = vi.fn()
    const trigger = document.createElement('button')
    document.body.append(trigger)
    trigger.focus()

    const view = render(<Overlay open onClose={firstClose} />)
    await waitFor(() => expect(screen.getByRole('button', { name: 'First' })).toBe(document.activeElement))

    screen.getByRole('button', { name: 'Last' }).focus()
    fireEvent.keyDown(window, { key: 'Tab' })
    expect(screen.getByRole('button', { name: 'First' })).toBe(document.activeElement)

    fireEvent.keyDown(window, { key: 'Tab', shiftKey: true })
    expect(screen.getByRole('button', { name: 'Last' })).toBe(document.activeElement)

    view.rerender(<Overlay open onClose={latestClose} />)
    expect(screen.getByRole('button', { name: 'Last' })).toBe(document.activeElement)
    fireEvent.keyDown(window, { key: 'Escape' })
    expect(firstClose).not.toHaveBeenCalled()
    expect(latestClose).toHaveBeenCalledTimes(1)

    view.rerender(<Overlay open={false} onClose={latestClose} />)
    expect(trigger).toBe(document.activeElement)
    trigger.remove()
  })

  it('excludes drawer backdrops, disabled controls, and hidden controls from focus boundaries', async () => {
    render(
      <Overlay open onClose={vi.fn()}>
        <button tabIndex={-1}>Backdrop</button>
        <button disabled>Disabled</button>
        <button hidden>Hidden</button>
        <button aria-hidden="true">ARIA hidden</button>
        <button style={{ display: 'none' }}>CSS hidden</button>
        <div style={{ display: 'none' }}><button>CSS ancestor hidden</button></div>
        <div style={{ visibility: 'hidden' }}><button>Visibility ancestor hidden</button></div>
        <div aria-hidden="true"><button>ARIA ancestor hidden</button></div>
        <button>First valid</button>
        <button tabIndex={-1}>Skipped middle</button>
        <button>Last valid</button>
      </Overlay>,
    )

    const first = screen.getByRole('button', { name: 'First valid' })
    const last = screen.getByRole('button', { name: 'Last valid' })
    await waitFor(() => expect(first).toBe(document.activeElement))

    last.focus()
    fireEvent.keyDown(window, { key: 'Tab' })
    expect(first).toBe(document.activeElement)

    fireEvent.keyDown(window, { key: 'Tab', shiftKey: true })
    expect(last).toBe(document.activeElement)
  })

  it('focuses and contains focus on the region when it has no focusable descendants', async () => {
    render(<Overlay open onClose={vi.fn()}><p>No controls</p></Overlay>)
    const dialog = screen.getByRole('dialog')

    await waitFor(() => expect(dialog).toBe(document.activeElement))
    expect(dialog.getAttribute('tabindex')).toBe('-1')

    fireEvent.keyDown(window, { key: 'Tab' })
    expect(dialog).toBe(document.activeElement)
  })

  it('recovers Tab and Shift+Tab when focus is outside the overlay', async () => {
    render(<><button>Outside</button><Overlay open onClose={vi.fn()} /></>)
    const outside = screen.getByRole('button', { name: 'Outside' })
    const first = screen.getByRole('button', { name: 'First' })
    const last = screen.getByRole('button', { name: 'Last' })
    await waitFor(() => expect(first).toBe(document.activeElement))

    outside.focus()
    fireEvent.keyDown(window, { key: 'Tab' })
    expect(first).toBe(document.activeElement)

    outside.focus()
    fireEvent.keyDown(window, { key: 'Tab', shiftKey: true })
    expect(last).toBe(document.activeElement)
  })

  it('recovers Tab and Shift+Tab when focus is on BODY', async () => {
    render(<Overlay open onClose={vi.fn()} />)
    const first = screen.getByRole('button', { name: 'First' })
    const last = screen.getByRole('button', { name: 'Last' })
    await waitFor(() => expect(first).toBe(document.activeElement))

    first.blur()
    expect(document.activeElement).toBe(document.body)
    fireEvent.keyDown(window, { key: 'Tab' })
    expect(first).toBe(document.activeElement)

    first.blur()
    fireEvent.keyDown(window, { key: 'Tab', shiftKey: true })
    expect(last).toBe(document.activeElement)
  })

  it('recovers inside a comment dialog after the focused action becomes disabled', async () => {
    render(<PendingCommentDialog />)
    const comment = screen.getByRole('textbox', { name: 'Comment' })
    const cancel = screen.getByRole('button', { name: 'Cancel' })
    const save = screen.getByRole('button', { name: 'Save' })
    await waitFor(() => expect(comment).toBe(document.activeElement))

    save.focus()
    fireEvent.click(save)
    expect(save.disabled).toBe(true)
    document.body.setAttribute('tabindex', '-1')
    document.body.focus()
    expect(document.activeElement).toBe(document.body)
    fireEvent.keyDown(window, { key: 'Tab' })
    expect(comment).toBe(document.activeElement)

    comment.blur()
    fireEvent.keyDown(window, { key: 'Tab', shiftKey: true })
    expect(cancel).toBe(document.activeElement)
  })

  it('recovers focus after the active candidate is removed', async () => {
    render(<RemovingControlDialog />)
    const first = screen.getByRole('button', { name: 'First remaining' })
    const action = screen.getByRole('button', { name: 'Remove action' })
    await waitFor(() => expect(first).toBe(document.activeElement))

    action.focus()
    fireEvent.click(action)
    expect(screen.queryByRole('button', { name: 'Remove action' })).toBe(null)
    expect(document.activeElement).toBe(document.body)
    fireEvent.keyDown(window, { key: 'Tab' })
    expect(first).toBe(document.activeElement)
  })

  it('does not focus or trap Tab when the focus container is CSS-hidden', async () => {
    const trigger = document.createElement('button')
    document.body.append(trigger)
    trigger.focus()
    const view = render(<Overlay open onClose={vi.fn()} style={{ display: 'none' }}><p>No controls</p></Overlay>)
    const dialog = view.container.querySelector('[role="dialog"]')

    await act(() => new Promise((resolve) => requestAnimationFrame(resolve)))
    expect(document.activeElement).toBe(trigger)
    expect(dialog.getAttribute('tabindex')).toBe(null)

    const tab = new KeyboardEvent('keydown', { bubbles: true, cancelable: true, key: 'Tab' })
    window.dispatchEvent(tab)
    expect(tab.defaultPrevented).toBe(false)
    expect(document.activeElement).toBe(trigger)
    trigger.remove()
  })

  it('blocks Escape when configured and removes its listener after unmount', async () => {
    const onClose = vi.fn()
    const trigger = document.createElement('button')
    document.body.append(trigger)
    trigger.focus()

    const view = render(<Overlay open onClose={onClose} closeOnEscape={false} />)
    await waitFor(() => expect(screen.getByRole('button', { name: 'First' })).toBe(document.activeElement))

    fireEvent.keyDown(window, { key: 'Escape' })
    expect(onClose).not.toHaveBeenCalled()

    view.rerender(<Overlay open onClose={onClose} closeOnEscape />)
    fireEvent.keyDown(window, { key: 'Escape' })
    expect(onClose).toHaveBeenCalledTimes(1)

    view.unmount()
    expect(trigger).toBe(document.activeElement)
    fireEvent.keyDown(window, { key: 'Escape' })
    expect(onClose).toHaveBeenCalledTimes(1)
    trigger.remove()
  })

  it('closes an open drawer and releases focus and body lock at the lg breakpoint', async () => {
    const listeners = new Set()
    const media = {
      matches: false,
      media: '(min-width: 1024px)',
      addEventListener: vi.fn((type, listener) => { if (type === 'change') listeners.add(listener) }),
      removeEventListener: vi.fn((type, listener) => { if (type === 'change') listeners.delete(listener) }),
    }
    vi.stubGlobal('matchMedia', vi.fn(() => media))

    render(<ResponsiveDrawer />)
    const trigger = screen.getByRole('button', { name: 'Open drawer' })
    trigger.focus()
    fireEvent.click(trigger)
    await waitFor(() => expect(screen.getByRole('button', { name: 'Drawer link' })).toBe(document.activeElement))
    expect(document.body.style.overflow).toBe('hidden')
    const hiddenTriggerFocus = vi.spyOn(trigger, 'focus')

    act(() => {
      media.matches = true
      listeners.forEach((listener) => listener({ matches: true, media: media.media }))
    })

    expect(screen.queryByRole('dialog', { name: 'Test drawer' })).toBe(null)
    expect(document.body.style.overflow).toBe('')
    expect(document.activeElement).not.toBe(trigger)
    expect(hiddenTriggerFocus).not.toHaveBeenCalled()
    const tab = new KeyboardEvent('keydown', { bubbles: true, cancelable: true, key: 'Tab' })
    window.dispatchEvent(tab)
    expect(tab.defaultPrevented).toBe(false)
  })
})
