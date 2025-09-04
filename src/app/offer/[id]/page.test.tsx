import React from 'react'
import { test, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import OfferPage from './page'
import { api } from '../../../lib/api/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import * as nextNav from 'next/navigation'

vi.mock('next/navigation', async () => {
  const actual = await vi.importActual<typeof nextNav>('next/navigation')
  return {
    ...actual,
    useParams: () => ({ id: 'fl1' }),
    useRouter: () => ({ push: vi.fn() }),
  }
})

function renderWithQuery(ui: React.ReactNode) {
  const qc = new QueryClient()
  return render(<QueryClientProvider client={qc}>{ui}</QueryClientProvider>)
}

test('recheck shows price', async () => {
  const user = userEvent.setup()
  vi.spyOn(api.offers, 'recheck').mockResolvedValueOnce({ available: true, price: { total: '199.00', currency: 'USD' }, expiresAt: '' })
  renderWithQuery(<OfferPage />)
  await user.click(screen.getByRole('button', { name: /Recheck/ }))
  expect(await screen.findByText(/199.00/)).toBeInTheDocument()
})
