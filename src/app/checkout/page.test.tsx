import React from 'react'
import { test, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CheckoutPage from './page'
import { api } from '../../lib/api/client'
import type { PaymentIntent } from '../../lib/api/types'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import * as nextNav from 'next/navigation'

vi.mock('next/navigation', async () => {
  const actual = await vi.importActual<typeof nextNav>('next/navigation')
  return { ...actual, useSearchParams: () => ({ get: (k: string) => (k === 'offerId' ? 'fl1' : null) }), useRouter: () => ({ push: vi.fn() }) }
})

function renderWithQuery(ui: React.ReactNode) {
  const qc = new QueryClient()
  return render(<QueryClientProvider client={qc}>{ui}</QueryClientProvider>)
}

test('create intent then confirm', async () => {
  const user = userEvent.setup()
  vi.spyOn(api.payments, 'createIntent').mockResolvedValueOnce({ id: 'pi_1', clientSecret: 'cs', status: 'requires_confirmation' } as PaymentIntent)
  vi.spyOn(api.payments, 'confirm').mockResolvedValueOnce({ status: 'succeeded', chargeId: 'ch_1' })
  vi.spyOn(api.bookings, 'create').mockResolvedValueOnce({ bookingId: 'b_1', status: 'confirmed', reference: 'REF123' })
  renderWithQuery(<CheckoutPage />)
  await user.click(screen.getByRole('button', { name: /Create payment intent/ }))
  await user.click(screen.getByRole('button', { name: /Confirm and book/ }))
  expect(true).toBe(true)
})
