import React from 'react'
import { test, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import FlightSearchPage from './page'
import { api } from '../../../../lib/api/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

function renderWithQuery(ui: React.ReactNode) {
  const qc = new QueryClient()
  return render(<QueryClientProvider client={qc}>{ui}</QueryClientProvider>)
}

test('submits valid form and shows results', async () => {
  const user = userEvent.setup()
  const mockResults: { results: { id: string; price: { total: string; currency: string }; slices: { origin: string; destination: string; departAt: string; arriveAt: string; carrier: string; durationMins: number; stops: number }[] }[] } = {
    results: [
      { id: 'fl1', price: { total: '199.00', currency: 'USD' }, slices: [{ origin: 'SFO', destination: 'LAX', departAt: '', arriveAt: '', carrier: 'LA', durationMins: 120, stops: 0 }] },
    ],
  }
  vi.spyOn(api.flights, 'search').mockResolvedValueOnce(mockResults)
  renderWithQuery(<FlightSearchPage />)
  await user.type(screen.getByPlaceholderText(/Origin/), 'SFO')
  await user.type(screen.getByPlaceholderText(/Destination/), 'LAX')
  const date = screen.getByLabelText(/depart date/i)
  await user.clear(date)
  await user.type(date, '2025-10-01')
  await user.click(screen.getByRole('button', { name: /Search/ }))
  expect(await screen.findByText(/199\.00/)).toBeInTheDocument()
})
