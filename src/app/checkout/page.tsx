'use client'
import React, { useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useMutation } from '@tanstack/react-query'
import { api } from '@/lib/api/client'

function CheckoutContent() {
  const sp = useSearchParams()
  const router = useRouter()
  const offerId = sp.get('offerId') || 'fl1'
  const [intentId, setIntentId] = useState<string | null>(null)
  const createIntent = useMutation({
    mutationFn: () => api.payments.createIntent({ amount: 19900, currency: 'USD', paymentMethodType: 'card' }),
    onSuccess: (d: { id: string }) => setIntentId(d.id),
  })
  const confirm = useMutation({
    mutationFn: () => api.payments.confirm('pi_1', { paymentMethod: { type: 'card', last4: '4242' } }),
    onSuccess: async () => {
      const res = await api.bookings.create({
        offerId,
        travelers: [{}],
        contacts: {},
        paymentIntentId: 'pi_1',
      })
      router.push(`/confirmation?ref=${res.reference}&id=${res.bookingId}`)
    },
  })

  return (
    <main className="mx-auto max-w-2xl p-6">
      <h1 className="text-2xl font-semibold mb-4">Checkout</h1>
      <div className="space-x-3">
        <button className="rounded bg-blue-600 text-white py-2 px-3" onClick={()=>createIntent.mutate()} disabled={createIntent.isPending}>
          {createIntent.isPending ? 'Creating intent...' : 'Create payment intent'}
        </button>
        <button className="rounded bg-green-600 text-white py-2 px-3" onClick={()=>confirm.mutate()} disabled={!intentId || confirm.isPending}>
          {confirm.isPending ? 'Confirming...' : 'Confirm and book'}
        </button>
      </div>
    </main>
  )
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<main className="mx-auto max-w-2xl p-6"><p>Loading…</p></main>}>
      <CheckoutContent />
    </Suspense>
  )
}
