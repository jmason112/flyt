'use client'
import React, { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { api } from '@/lib/api/client'
import type { FlightOffer } from '@/lib/api/types'

const schema = z.object({
  origin: z.string().min(3),
  destination: z.string().min(3),
  departDate: z.string().min(4),
  adults: z.number().min(1),
})

type FormData = z.infer<typeof schema>

export default function FlightSearchPage() {
  const [results, setResults] = useState<FlightOffer[] | null>(null)
  const { register, handleSubmit } = useForm<FormData>({ resolver: zodResolver(schema), defaultValues: { adults: 1 } as Partial<FormData> })
  const search = useMutation({
    mutationFn: (data: FormData) => api.flights.search({ ...data, children: 0 }),
    onSuccess: (data) => setResults(data.results),
  })

  const onSubmit: SubmitHandler<FormData> = (data) => search.mutate(data)

  return (
    <main className="mx-auto max-w-3xl p-6">
      <h1 className="text-2xl font-semibold mb-4">Search Flights</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-2 gap-3 mb-6">
        <input className="rounded border p-2" placeholder="Origin (e.g. SFO)" {...register('origin')} />
        <input className="rounded border p-2" placeholder="Destination (e.g. LAX)" {...register('destination')} />
        <input className="rounded border p-2" type="date" {...register('departDate')} />
        <input className="rounded border p-2" type="number" min={1} {...register('adults', { valueAsNumber: true })} />
        <button className="col-span-2 rounded bg-blue-600 text-white py-2 disabled:opacity-60" disabled={search.isPending}>{search.isPending ? 'Searching...' : 'Search'}</button>
      </form>

      {results && (
        <ul className="space-y-3">
          {results.map((o) => (
            <li key={o.id} className="rounded border p-3 flex items-center justify-between">
              <div>
                <div className="font-medium">{o.slices[0].origin} → {o.slices[0].destination}</div>
                <div className="text-sm text-gray-600">{o.slices[0].carrier} • {o.slices[0].stops} stops • {o.slices[0].durationMins} mins</div>
              </div>
              <div className="text-right">
                <div className="text-lg font-semibold">{o.price.total} {o.price.currency}</div>
                <a className="text-blue-600 underline" href={`/offer/${o.id}`}>Select</a>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}
