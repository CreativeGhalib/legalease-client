import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import AIIntakeTrigger from './AIIntakeModal'
import * as aiIntakeApi from '../../api/aiIntakeApi'

vi.mock('../../api/aiIntakeApi')

const qualificationResponse = {
  category: 'Criminal Law',
  urgency: 'urgent',
  summary: 'Police arrested my brother during a protest.',
  matchedSpecialization: 'Criminal Law',
  recommendedLawyers: [
    {
      id: '507f1f77bcf86cd799439011',
      fullName: 'Adv. Criminal Expert',
      specialization: 'Criminal Law',
      consultationFeeMinor: 15000,
      professionalPhotoUrl: '',
    },
  ],
}

beforeEach(() => {
  vi.mocked(aiIntakeApi.qualifyIntake).mockResolvedValue(qualificationResponse)
})

afterEach(() => {
  cleanup()
  vi.mocked(aiIntakeApi.qualifyIntake).mockReset()
})

function renderTrigger() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } })
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <AIIntakeTrigger />
      </MemoryRouter>
    </QueryClientProvider>,
  )
}

describe('AIIntakeModal', () => {
  it('opens the dialog and disables submission under the 10-character minimum', async () => {
    renderTrigger()
    fireEvent.click(screen.getByRole('button', { name: /find my lawyer/i }))

    const dialog = await screen.findByRole('dialog', { name: /describe your issue/i })
    expect(dialog).toBeTruthy()

    const textarea = screen.getByLabelText('Describe your legal issue')
    fireEvent.change(textarea, { target: { value: 'too short' } })
    const submit = screen.getByRole('button', { name: /analyze my issue/i })
    expect(submit.disabled).toBe(true)
    expect(vi.mocked(aiIntakeApi.qualifyIntake)).not.toHaveBeenCalled()
  })

  it('submits the description and renders category with recommended lawyers', async () => {
    renderTrigger()
    fireEvent.click(await screen.findByRole('button', { name: /find my lawyer/i }))

    const textarea = screen.getByLabelText('Describe your legal issue')
    fireEvent.change(textarea, {
      target: { value: 'The police arrested my brother during a protest and we need bail immediately.' },
    })
    fireEvent.submit(screen.getByLabelText('Describe your legal issue').closest('form'))

    expect(await screen.findByText('Suggested category')).toBeTruthy()
    expect(screen.getByText('Criminal Law')).toBeTruthy()
    expect(screen.getByText(/Urgency: urgent/i)).toBeTruthy()
    expect(screen.getByText('Adv. Criminal Expert')).toBeTruthy()
    await waitFor(() => expect(aiIntakeApi.qualifyIntake).toHaveBeenCalledTimes(1))
  })
})
