import { http, HttpResponse, delay } from 'msw'
import type {
  AuthLoginBody,
  AuthRegisterBody,
  FlightSearchBody,
  FlightOffer,
  CreatePaymentIntentBody,
  ConfirmPaymentBody,
  CreateBookingBody,
  Booking,
} from '@/lib/api/types'

const BASE = process.env.NEXT_PUBLIC_LITE_API_BASE_URL || 'https://mock.liteapi'

let mockAccess = 'mock_access'
const user = { id: 'u1', role: 'traveler', name: 'Alex Traveler', email: 'alex@example.com' }

function randomRef() {
  return `REF${Math.floor(100000 + Math.random() * 900000)}`
}

export const handlers = [
  http.post(`${BASE}/auth/login`, async ({ request }) => {
    const body = (await request.json()) as AuthLoginBody
    if (!body.email || !body.password) return HttpResponse.json({ message: 'invalid' }, { status: 400 })
    mockAccess = `mock_access_${Date.now()}`
    await delay(150)
    return HttpResponse.json({ user, accessToken: mockAccess })
  }),
  http.post(`${BASE}/auth/register`, async ({ request }) => {
    const body = (await request.json()) as AuthRegisterBody
    if (!body.email || !body.password || !body.name) return HttpResponse.json({ message: 'invalid' }, { status: 400 })
    mockAccess = `mock_access_${Date.now()}`
    await delay(200)
    return HttpResponse.json({ user: { ...user, name: body.name, email: body.email }, accessToken: mockAccess })
  }),
  http.post(`${BASE}/auth/refresh`, async () => {
    await delay(100)
    mockAccess = `mock_access_${Date.now()}`
    return HttpResponse.json({ accessToken: mockAccess })
  }),
  http.post(`${BASE}/auth/logout`, async () => {
    await delay(50)
    return HttpResponse.json({}, { status: 200 })
  }),

  http.post(`${BASE}/search/flights`, async ({ request }) => {
    const body = (await request.json()) as FlightSearchBody
    if (!body.origin || !body.destination || !body.departDate) return HttpResponse.json({ message: 'invalid' }, { status: 400 })
    await delay(300)
    const results: FlightOffer[] = [
      {
        id: 'fl1',
        price: { total: '199.00', currency: 'USD' },
        slices: [
          { origin: body.origin, destination: body.destination, departAt: `${body.departDate}T08:00:00Z`, arriveAt: `${body.departDate}T12:00:00Z`, carrier: 'LA', durationMins: 240, stops: 0 },
        ],
      },
      {
        id: 'fl2',
        price: { total: '249.00', currency: 'USD' },
        slices: [
          { origin: body.origin, destination: body.destination, departAt: `${body.departDate}T10:00:00Z`, arriveAt: `${body.departDate}T15:00:00Z`, carrier: 'UA', durationMins: 300, stops: 1 },
        ],
      },
    ]
    return HttpResponse.json({ results, cursor: null })
  }),

  http.post(`${BASE}/offers/fl1/recheck`, async () => {
    await delay(150)
    return HttpResponse.json({ available: true, price: { total: '199.00', currency: 'USD' }, expiresAt: new Date(Date.now() + 5 * 60 * 1000).toISOString() })
  }),

  http.post(`${BASE}/payments/intents`, async ({ request }) => {
    await delay(150)
    await request.json() as CreatePaymentIntentBody
    return HttpResponse.json({ id: 'pi_1', clientSecret: 'cs_123', status: 'requires_confirmation' })
  }),
  http.post(`${BASE}/payments/intents/pi_1/confirm`, async ({ request }) => {
    await delay(250)
    await request.json() as ConfirmPaymentBody
    return HttpResponse.json({ status: 'succeeded', chargeId: 'ch_1' })
  }),

  http.post(`${BASE}/bookings`, async ({ request }) => {
    await delay(200)
    const body = (await request.json()) as CreateBookingBody
    if (!body.offerId || !body.paymentIntentId) return HttpResponse.json({ message: 'invalid' }, { status: 400 })
    const reference = randomRef()
    return HttpResponse.json({ bookingId: 'b_1', status: 'confirmed', reference })
  }),
  http.get(`${BASE}/bookings/b_1`, async () => {
    const booking: Booking = {
      id: 'b_1',
      reference: randomRef(),
      status: 'confirmed',
      items: [{ type: 'flight', offerId: 'fl1', price: { total: '199.00', currency: 'USD' } }],
      payments: [{ id: 'ch_1', status: 'succeeded', amount: '199.00', currency: 'USD' }],
      userId: user.id,
      createdAt: new Date().toISOString(),
    }
    return HttpResponse.json({ booking })
  }),
]
