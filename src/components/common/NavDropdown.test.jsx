import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import NavDropdown from './NavDropdown'

afterEach(cleanup)

const userItems = [
  { label: 'Dashboard overview', to: '/dashboard' },
  { label: 'My hiring requests', to: '/dashboard/user/hiring-history' },
  { label: 'Comments', to: '/dashboard/user/comments' },
]

function renderDropdown(items = userItems) {
  return render(
    <MemoryRouter initialEntries={['/']}>
      <NavDropdown label="Dashboard" items={items} />
    </MemoryRouter>,
  )
}

describe('NavDropdown', () => {
  it('renders a collapsed trigger with ARIA state and opens the role menu on click', () => {
    renderDropdown()
    const trigger = screen.getByRole('button', { name: /dashboard/i })
    expect(trigger.getAttribute('aria-haspopup')).toBe('true')
    expect(trigger.getAttribute('aria-expanded')).toBe('false')
    expect(screen.queryByRole('menu')).toBeNull()

    fireEvent.click(trigger)
    expect(trigger.getAttribute('aria-expanded')).toBe('true')
    expect(screen.getByRole('menu', { name: /dashboard navigation/i })).toBeTruthy()
    expect(screen.getAllByRole('menuitem').length).toBe(userItems.length)
  })

  it('closes on Escape and returns focus to the trigger', () => {
    renderDropdown()
    const trigger = screen.getByRole('button', { name: /dashboard/i })
    fireEvent.click(trigger)
    fireEvent.keyDown(trigger.parentElement, { key: 'Escape' })
    expect(trigger.getAttribute('aria-expanded')).toBe('false')
  })

  it('focuses the first item on open and arrow keys cycle with wrap-around', () => {
    renderDropdown()
    const trigger = screen.getByRole('button', { name: /dashboard/i })
    fireEvent.click(trigger)
    const menuItems = screen.getAllByRole('menuitem')

    expect(document.activeElement).toBe(menuItems[0])

    fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' })
    expect(document.activeElement).toBe(menuItems[1])

    fireEvent.keyDown(document.activeElement, { key: 'ArrowUp' })
    expect(document.activeElement).toBe(menuItems[0])

    fireEvent.keyDown(document.activeElement, { key: 'ArrowUp' })
    expect(document.activeElement).toBe(menuItems[menuItems.length - 1])
  })

  it('ArrowDown on a closed trigger opens the menu directly into the first item', () => {
    renderDropdown()
    const trigger = screen.getByRole('button', { name: /dashboard/i })
    fireEvent.keyDown(trigger, { key: 'ArrowDown' })
    expect(trigger.getAttribute('aria-expanded')).toBe('true')
    expect(document.activeElement).toBe(screen.getAllByRole('menuitem')[0])
  })

  it('closes on click outside without swallowing focus order', () => {
    renderDropdown()
    const trigger = screen.getByRole('button', { name: /dashboard/i })
    fireEvent.click(trigger)
    expect(screen.getByRole('menu')).toBeTruthy()

    fireEvent.mouseDown(document.body)
    expect(screen.queryByRole('menu')).toBeNull()
  })

  it('shows only the supplied role items', () => {
    renderDropdown([
      { label: 'Dashboard overview', to: '/dashboard' },
      { label: 'Manage users', to: '/dashboard/admin/manage-users' },
      { label: 'Analytics', to: '/dashboard/admin/analytics' },
    ])
    fireEvent.click(screen.getByRole('button', { name: /dashboard/i }))
    expect(screen.getByText('Manage users')).toBeTruthy()
    expect(screen.getByText('Analytics')).toBeTruthy()
    expect(screen.queryByText('My hiring requests')).toBeNull()
  })
})
