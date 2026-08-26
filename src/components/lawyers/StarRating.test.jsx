import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import StarRatingInput, { StarDisplay } from './StarRating'

afterEach(cleanup)

describe('StarRating', () => {
  it('display mode exposes an accessible rating label and fills rounded stars', () => {
    render(<StarDisplay value={4.4} />)
    const group = screen.getByRole('img', { name: 'Rated 4.4 out of 5' })
    expect(group.querySelectorAll('.fill-\\[\\#d4a843\\]').length).toBe(4)
  })

  it('input mode selects a rating on click with correct radio state', () => {
    const onChange = vi.fn()
    render(<StarRatingInput value={0} onChange={onChange} />)
    const threeStars = screen.getByRole('radio', { name: 'Rate 3 stars' })
    expect(threeStars.getAttribute('aria-checked')).toBe('false')
    fireEvent.click(threeStars)
    expect(onChange).toHaveBeenCalledWith(3)
  })

  it('arrow keys step the value within the 1-5 range', () => {
    const onChange = vi.fn()
    render(<StarRatingInput value={2} onChange={onChange} />)
    const group = screen.getByRole('radiogroup', { name: 'Your rating' })
    fireEvent.keyDown(group, { key: 'ArrowRight' })
    expect(onChange).toHaveBeenLastCalledWith(3)
    fireEvent.keyDown(group, { key: 'ArrowDown' })
    expect(onChange).toHaveBeenLastCalledWith(1)
    fireEvent.keyDown(group, { key: 'Home' })
    expect(onChange).toHaveBeenLastCalledWith(1)
    fireEvent.keyDown(group, { key: 'End' })
    expect(onChange).toHaveBeenLastCalledWith(5)
  })
})
