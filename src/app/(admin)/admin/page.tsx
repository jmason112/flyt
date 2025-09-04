'use client'
import React, { Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api/client'

function AdminContent() {
  const sp = useSearchParams()
  const page = Number(sp.get('page') || '1')
  const pageSize = 10
  const qc = useQueryClient()
  const { data, isLoading } = useQuery({
    queryKey: ['admin-bookings', page, pageSize],
    queryFn: () => api.admin.bookings(page, pageSize),
  })
  const refund = useMutation({
    mutationFn: (id: string) => api.admin.refund(id, 100),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-bookings'] }),
  })
  if (isLoading) return <main className="mx-auto max-w-4xl p-6"><p>Loading…</p></main>
  return (
    <main className="mx-auto max-w-4xl p-6">
      <h1 className="text-2xl font-semibold mb-4">Admin</h1>
      <table className="w-full border text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="p-2 text-left">ID</th>
            <th className="p-2 text-left">Reference</th>
            <th className="p-2 text-left">Status</th>
            <th className="p-2 text-left">Amount</th>
            <th className="p-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data?.items?.map((b) => {
            const p = b.payments?.[0]
            const amount = p?.amount ?? ''
            const currency = p?.currency ?? ''
            return (
              <tr key={b.id} className="border-t">
                <td className="p-2">{b.id}</td>
                <td className="p-2">{b.reference}</td>
                <td className="p-2">{b.status}</td>
                <td className="p-2">{amount} {currency}</td>
                <td className="p-2 flex gap-2">
                  <Link className="text-blue-600 underline" href={`/admin/${b.id}`}>Open</Link>
                  <button className="rounded bg-red-600 text-white px-2 py-1 disabled:opacity-60" onClick={() => refund.mutate(b.id)} disabled={refund.isPending}>
                    {refund.isPending ? 'Refunding…' : 'Refund'}
                  </button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
      <div className="mt-4 flex gap-2">
        <Link className="rounded border px-3 py-1 disabled:opacity-60" href={`?page=${Math.max(1, page - 1)}`}>Prev</Link>
        <Link className="rounded border px-3 py-1" href={`?page=${page + 1}`}>Next</Link>
      </div>
    </main>
  )
}

export default function AdminPage() {
  return (
    <Suspense fallback={<main className="mx-auto max-w-4xl p-6"><p>Loading…</p></main>}>
      <AdminContent />
    </Suspense>
  )
}
