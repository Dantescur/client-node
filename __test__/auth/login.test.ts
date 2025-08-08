import process from 'node:process'
import { describe, expect, it } from 'vitest'
import { login } from '../../src'

import type { Login, Me } from '../../src/interfaces'
import 'dotenv/config'

describe('login', () => {
  it('should return a LoginResponse when the request is successful', async () => {
    const loginData: Login = {
      email: process.env.EMAIL as string,
      password: process.env.PASSWORD as string,
    }

    const expectedResult: Me = {
      uuid: 'fcc52d8c-e37d-49ad-a276-4613664c9a88',
      username: 'd3vqba',
      name: 'David',
      lastname: '',
      bio: 'Ingeniero de Software',
      profile_photo_path: '',
      balance: 0,
      complete_name: 'David ',
      name_verified: 'David',
      profile_photo_url:
        'https://ui-avatars.com/api/?name=D&color=7F9CF5&background=EBF4FF',
      average_rating: '0.00',
    }

    const { me } = await login(loginData)

    expect(me).toEqual(expectedResult)
  })

  it('should return an AxiosResponse when the request fails', async () => {
    const loginData: Login = {
      email: 'asd@asd.asd',
      password: process.env.PASSWORD as string,
    }

    const expectedResult = {
      error: 'User does not exist',
    }

    const result = await login(loginData)

    expect(result).toEqual(expectedResult)
  })
})
