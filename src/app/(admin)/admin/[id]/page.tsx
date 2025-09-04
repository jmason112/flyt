'use client'
import React, { Suspense } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useQuery, useMutation } from '@tanstack/react-query'
import { api } from '@/lib/api/client'

function AdminBookingDetail() {
  const { id } = useParams<{ id: string }>()
  const { data, isLoading } = useQuery({
    queryKey: ['admin-booking', id],
    queryFn: () => api.admin.booking(id),
  })
  const refund = useMutation({
    mutationFn: () => api.admin.refund(id as string, 100),
  })
  if (isLoading) return <main className="mx-auto max-w-3xl p-6"><p>Loading…</p></main>
  const b = data?.booking
  return (
    <main className="mx-auto max-w-3xl p-6">
      <h1 className="text-2xl font-semibold mb-4">Booking {b?.id ?? ''}</h1>
      <p className="mb-2">Reference: <span className="font-mono">{b?.reference ?? ''}</span></p>
      <p className="mb-4">Status: {b?.status ?? ''}</p>
      <button className="rounded bg-red-600 text-white px-3 py-2 disabled:opacity-60" onClick={()=>refund.mutate()} disabled={refund.isPending}>
        {refund.isPending ? 'Refunding…' : 'Refund'}
      </button>
      <div className="mt-6">
        <Link className="text-blue-600 underline" href="/admin">Back to admin</Link>
      </div>
    </main>
  )
}

export default function AdminBookingPage() {
  return (
    <Suspense fallback={<main className="mx-auto max-w-3xl p-6"><p>Loading…</p></main>}>
      <AdminBookingDetail />
    </Suspense>
  )
}
