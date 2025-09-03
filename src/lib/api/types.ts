export type User = {
  id: string
  role: 'traveler' | 'agency' | 'admin'
  name: string
  email: string
  phone?: string
}

export type FlightOffer = {
  id: string
  price: { total: string; currency: string }
  slices: Array<{ origin: string; destination: string; departAt: string; arriveAt: string; carrier: string; durationMins: number; stops: number }>
}

export type Booking = {
  id: string
  reference: string
  status: 'pending' | 'confirmed' | 'canceled' | 'refunded'
  items: Array<{ type: 'flight' | 'hotel' | 'package'; offerId: string; price: { total: string; currency: string } }>
  payments: Array<{ id: string; status: string; amount: string; currency: string }>
  userId: string
  createdAt: string
}

export type AuthLoginBody = { email: string; password: string }
export type AuthRegisterBody = { email: string; password: string; name: string }
export type AuthLoginResponse = { user: User; accessToken: string }
export type AuthRegisterResponse = { user: User; accessToken: string }
export type RefreshResponse = { accessToken: string }

export type FlightSearchBody = {
  origin: string
  destination: string
  departDate: string
  returnDate?: string
  adults: number
  children?: number
  cabin?: string
  sort?: string
  filters?: Record<string, unknown>
}
export type CursorPage<T> = { results: T[]; cursor?: string }

export type RecheckResponse = { available: boolean; price: { total: string; currency: string }; expiresAt: string }

export type CreatePaymentIntentBody = { amount: number; currency: string; paymentMethodType: string; captureMethod?: string }
export type PaymentIntent = { id: string; clientSecret: string; status: string }
export type ConfirmPaymentBody = { paymentMethod: Record<string, unknown> }
export type RefundBody = { chargeId: string; amount: number }

export type CreateBookingBody = {
  offerId: string
  travelers: Array<Record<string, unknown>>
  contacts: Record<string, unknown>
  extras?: Record<string, unknown>
  paymentIntentId: string
}
export type CreateBookingResponse = { bookingId: string; status: string; reference: string }

export type ItineraryListResponse = { items: Array<Record<string, unknown>>; total: number }

export type AdminBookingListQuery = { status?: string; dateFrom?: string; dateTo?: string; product?: string; userId?: string; agencyId?: string }
