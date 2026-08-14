import { act, fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { TOAST_EVENT } from '../../utils/toast'
import ToastViewport from './ToastViewport'

describe('ToastViewport', () => {
  it('announces and dismisses an API error notification', () => {
    render(<ToastViewport />)
    act(() => window.dispatchEvent(new CustomEvent(TOAST_EVENT, { detail: { message: 'The request failed safely.' } })))

    expect(screen.getByRole('alert').textContent).toContain('The request failed safely.')
    fireEvent.click(screen.getByRole('button', { name: 'Dismiss notification' }))
    expect(screen.queryByRole('alert')).toBeNull()
  })
})
