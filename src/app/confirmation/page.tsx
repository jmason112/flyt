'use client'
import React, { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'

function ConfirmationContent() {
  const sp = useSearchParams()
  const ref = sp.get('ref')
  const id = sp.get('id')
  return (
    <main className="mx-auto max-w-xl p-6">
      <h1 className="text-2xl font-semibold mb-2">Booking Confirmed</h1>
      <p className="mb-4">Reference: <span className="font-mono">{ref}</span></p>
      <a className="text-blue-600 underline" href={`/itineraries/${id}`}>View itinerary</a>
    </main>
  )
}

export default function ConfirmationPage() {
  return (
    <Suspense fallback={<main className="mx-auto max-w-xl p-6"><p>Loading…</p></main>}>
      <ConfirmationContent />
    </Suspense>
  )
}
