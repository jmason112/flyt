import { tokenStore } from './tokenStore'

describe('tokenStore', () => {
  it('sets and gets token', () => {
    tokenStore.set('abc')
    expect(tokenStore.get()).toBe('abc')
  })

  it('clears token', () => {
    tokenStore.set('abc')
    tokenStore.clear()
    expect(tokenStore.get()).toBeNull()
  })
})
