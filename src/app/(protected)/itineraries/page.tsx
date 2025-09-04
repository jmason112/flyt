'use client'
import React, { Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api/client'

function ItinerariesContent() {
  const sp = useSearchParams()
  const page = Number(sp.get('page') || '1')
  const pageSize = 10
  const { data, isLoading } = useQuery({
    queryKey: ['itineraries', page, pageSize],
    queryFn: () => api.itineraries.list(page, pageSize),
  })
  if (isLoading) return <main className="mx-auto max-w-3xl p-6"><p>Loading…</p></main>
  return (
    <main className="mx-auto max-w-3xl p-6">
      <h1 className="text-2xl font-semibold mb-4">Itineraries</h1>
      <ul className="space-y-2">
        {(data?.items as Array<{ id: string; reference: string; createdAt: string; status: string }> | undefined)?.map((it) => (
          <li key={it.id} className="rounded border p-3 flex justify-between">
            <div>
              <div className="font-medium">{it.reference}</div>
              <div className="text-sm text-gray-600">{new Date(it.createdAt).toLocaleString()} • {it.status}</div>
            </div>
            <Link className="text-blue-600 underline" href={`/itineraries/${it.id}`}>Open</Link>
          </li>
        ))}
      </ul>
      <div className="mt-4 flex gap-2">
        <Link className="rounded border px-3 py-1 disabled:opacity-60" href={`?page=${Math.max(1, page - 1)}`}>Prev</Link>
        <Link className="rounded border px-3 py-1" href={`?page=${page + 1}`}>Next</Link>
      </div>
    </main>
  )
}

export default function ItinerariesPage() {
  return (
    <Suspense fallback={<main className="mx-auto max-w-3xl p-6"><p>Loading…</p></main>}>
      <ItinerariesContent />
    </Suspense>
  )
}
