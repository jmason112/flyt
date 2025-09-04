import ky, { HTTPError, KyInstance } from 'ky'
import { tokenStore } from './tokenStore'
import type {
  AuthLoginBody,
  AuthLoginResponse,
  AuthRegisterBody,
  AuthRegisterResponse,
  RefreshResponse,
  FlightSearchBody,
  CursorPage,
  FlightOffer,
  RecheckResponse,
  CreatePaymentIntentBody,
  PaymentIntent,
  ConfirmPaymentBody,
  RefundBody,
  CreateBookingBody,
  CreateBookingResponse,
  ItineraryListResponse,
  AdminBookingListQuery,
  Booking,
} from './types'

const BASE_URL = (process.env.NEXT_PUBLIC_LITE_API_BASE_URL || '') as string
const LOG_LEVEL = process.env.LOG_LEVEL || 'info'

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))
const jitter = (base: number) => Math.floor(base * (0.5 + Math.random()))

async function refreshAccessToken(client: KyInstance) {
  try {
    const res = await client.post('auth/refresh', { credentials: 'include' }).json<RefreshResponse>()
    tokenStore.set(res.accessToken)
    return res.accessToken
  } catch {
    tokenStore.clear()
    throw new Error('refresh_failed')
  }
}

function createClient(): KyInstance {
  const client: KyInstance = ky.create({
    prefixUrl: BASE_URL || '/',
    headers: {
      'Content-Type': 'application/json',
    },
    hooks: {
      beforeRequest: [
        (req) => {
          const t = tokenStore.get()
          if (t) req.headers.set('Authorization', `Bearer ${t}`)
        },
      ],
      afterResponse: [
        async (req, _opt, res) => {
          if (res.status === 429) {
            const ra = res.headers.get('Retry-After')
            const ms = ra ? Number(ra) * 1000 : 1000
            await sleep(ms)
            return client(req)
          }
          if (res.status === 401) {
            try {
              const newToken = await refreshAccessToken(client)
              const retry = new Request(req, {
                headers: { ...Object.fromEntries(req.headers), Authorization: `Bearer ${newToken}` },
              })
              return client(retry)
            } catch {
              return res
            }
          }
          if (res.status >= 500 && res.status < 600) {
            for (let i = 0; i < 2; i++) {
              await sleep(jitter(500 * (i + 1)))
              try {
                return await client(req)
              } catch {}
            }
          }
          return res
        },
      ],
    },
    retry: { limit: 0 },
  })
  return client
}

const http = createClient()

export const api = {
  async register(body: AuthRegisterBody) {
    const res = await http.post('auth/register', { json: body, credentials: 'include' }).json<AuthRegisterResponse>()
    tokenStore.set(res.accessToken)
    return res
  },
  async login(body: AuthLoginBody) {
    const res = await http.post('auth/login', { json: body, credentials: 'include' }).json<AuthLoginResponse>()
    tokenStore.set(res.accessToken)
    return res
  },
  async logout() {
    try {
      await http.post('auth/logout', { credentials: 'include' })
    } finally {
      tokenStore.clear()
    }
  },
  flights: {
    search: (body: FlightSearchBody) => http.post('search/flights', { json: body }).json<CursorPage<FlightOffer>>(),
  },
  offers: {
    recheck: (id: string) => http.post(`offers/${id}/recheck`).json<RecheckResponse>(),
  },
  payments: {
    createIntent: (body: CreatePaymentIntentBody) => http.post('payments/intents', { json: body }).json<PaymentIntent>(),
    confirm: (id: string, body: ConfirmPaymentBody) =>
      http.post(`payments/intents/${id}/confirm`, { json: body }).json<{ status: string; chargeId?: string }>(),
    refund: (body: RefundBody) => http.post('payments/refunds', { json: body }).json<{ refundId: string; status: string }>(),
  },
  bookings: {
    create: (body: CreateBookingBody) => http.post('bookings', { json: body }).json<CreateBookingResponse>(),
    get: (id: string) => http.get(`bookings/${id}`).json<{ booking: Booking }>(),
    cancel: (id: string) => http.post(`bookings/${id}/cancel`).json<{ status: string }>(),
  },
  itineraries: {
    list: (page: number, pageSize: number) => http.get('itineraries', { searchParams: { page: String(page), pageSize: String(pageSize) } }).json<ItineraryListResponse>(),
    get: (id: string) => http.get(`itineraries/${id}`).json<{ itinerary: Record<string, unknown> }>(),
  },
  admin: {
    bookings: (page: number, pageSize: number) =>
      http
        .get('admin/bookings', { searchParams: { page: String(page), pageSize: String(pageSize) } })
        .json<{ items: Booking[]; total: number }>(),
    booking: (id: string) => http.get(`admin/bookings/${id}`).json<{ booking: Booking; events: Array<Record<string, unknown>> }>(),
    refund: (id: string, amount: number) => http.post(`admin/bookings/${id}/refund`, { json: { amount } }).json<{ status: string }>(),
  },
}

export class ApiError extends Error {
  status?: number
  constructor(message: string, status?: number) {
    super(message)
    this.status = status
  }
}

export async function safe<T>(p: Promise<T>): Promise<[T | null, ApiError | null]> {
  try {
    const data = await p
    return [data, null]
  } catch (e) {
    if (e instanceof HTTPError) {
      const status = e.response.status
      return [null, new ApiError(`HTTP ${status}`, status)]
    }
    return [null, new ApiError('Unknown error')]
  }
}

if (LOG_LEVEL === 'debug') {
}
