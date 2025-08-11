import { describe, expect, it } from 'vitest'
import {
  ENABLED_CURRENCIES,
  type EnabledCurrencies,
} from '../../src/core/constants.ts'

describe('ENABLED_CURRENCIES', () => {
  const expectedCurrencies = [
    'SOL',
    'SBERBANK',
    'ZELLE',
    'TROPIPAY',
    'BANK_CUP',
    'USDCASH',
    'BANK_EUR',
    'EURCASH',
    'CLASICA',
    'ETECSA',
    'BANK_MLC',
    'USDT',
    'USDTERC20',
    'QVAPAY',
    'BANDECPREPAGO',
    'BOLSATM',
    'PAYPAL',
    'NEOMOON',
    'CUPCASH',
    'REMESITA',
    'USDTBSC',
  ]

  it('contains all expected currency codes', () => {
    const actualCurrencies = Object.values(ENABLED_CURRENCIES)
    expect(actualCurrencies).toEqual(expectedCurrencies)
  })

  it('has keys matching values', () => {
    for (const [key, value] of Object.entries(ENABLED_CURRENCIES)) {
      expect(key).toBe(value)
    }
  })

  it('has the correct number of currencies', () => {
    expect(Object.keys(ENABLED_CURRENCIES).length).toBe(
      expectedCurrencies.length,
    )
  })

  it('does not contain unexpected keys', () => {
    const actualKeys = Object.keys(ENABLED_CURRENCIES)
    expect(actualKeys).toEqual(expectedCurrencies)
  })
})

describe('EnabledCurrencies type', () => {
  it('allows valid currency values', () => {
    const validCurrency: EnabledCurrencies = 'SOL'
    expect(ENABLED_CURRENCIES[validCurrency]).toBe('SOL')

    const anotherValidCurrency: EnabledCurrencies = 'USDT'
    expect(ENABLED_CURRENCIES[anotherValidCurrency]).toBe('USDT')
  })
})
