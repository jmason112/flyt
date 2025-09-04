'use client'
import React, { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useMutation } from '@tanstack/react-query'
import { api } from '@/lib/api/client'
import type { RecheckResponse } from '@/lib/api/types'

export default function OfferPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const [price, setPrice] = useState<{ total: string; currency: string } | null>(null)
  const recheck = useMutation({
    mutationFn: () => api.offers.recheck(params.id as string),
    onSuccess: (d: RecheckResponse) => setPrice(d.price),
  })
  const startCheckout = () => {
    router.push(`/checkout?offerId=${params.id}`)
  }
  return (
    <main className="mx-auto max-w-2xl p-6">
      <h1 className="text-2xl font-semibold mb-4">Offer {params.id}</h1>
      <button className="rounded bg-blue-600 text-white py-2 px-3" onClick={()=>recheck.mutate()} disabled={recheck.isPending}>
        {recheck.isPending ? 'Rechecking...' : 'Recheck availability'}
      </button>
      {price && <p className="mt-3">Price: {price.total} {price.currency}</p>}
      <div className="mt-6">
        <button className="rounded bg-green-600 text-white py-2 px-3" onClick={startCheckout}>Proceed to checkout</button>
      </div>
    </main>
  )
}
