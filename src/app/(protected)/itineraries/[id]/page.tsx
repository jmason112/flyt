'use client'
import React, { Suspense } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api/client'

function ItineraryDetail() {
  const { id } = useParams<{ id: string }>()
  const { data, isLoading } = useQuery({
    queryKey: ['itinerary', id],
    queryFn: () => api.itineraries.get(id),
  })
  if (isLoading) return <main className="mx-auto max-w-3xl p-6"><p>Loading…</p></main>
  const it = data?.itinerary as { reference?: string } | undefined
  return (
    <main className="mx-auto max-w-3xl p-6">
      <h1 className="text-2xl font-semibold mb-2">Itinerary</h1>
      <p className="mb-4">Reference: <span className="font-mono">{it?.reference ?? ''}</span></p>
      <Link className="text-blue-600 underline" href="/itineraries">Back to list</Link>
    </main>
  )
}

export default function ItineraryPage() {
  return (
    <Suspense fallback={<main className="mx-auto max-w-3xl p-6"><p>Loading…</p></main>}>
      <ItineraryDetail />
    </Suspense>
  )
}
