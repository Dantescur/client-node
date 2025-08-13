export interface Me {
  uuid: string
  username: string
  name: string
  lastname: string
  bio: string
  profile_photo_path: string
  balance: number
  complete_name: string
  name_verified: string
  profile_photo_url: string
  average_rating: string
}

export interface MeExtendedResponse {
  uuid: string
  username: string
  name: string
  lastname: string
  bio: string
  kyc: number
  goldenCheck: number
  completed_p2p: number
  ranking_position: number
  sales: number
  complete_name: string
  name_verified: string
  cover_photo_url: string
  profile_photo_url: string
  average_rating: string
}

export interface UpdateUserParams {
  name: string
  lastname: string
  bio: string
  address: string
  country: string
  telegram: string
  twitter: string
}

export interface UpdateUserResponse {
  uuid: string
  username: string
  name: string
  lastname: string
  bio: string
  logo: string
  balance: string
  kyc: number
}

export interface TopUpParams {
  pay_method: string
  amount: number
  webhook_url?: string
}

export interface TopUpResponse {
  response: number
  coin: string
  value: number | string
  wallet: string
  price: number
  transaction_id: string
}

export interface WithdrawRequest {
  pay_method: string
  amount: number
  details: Record<string, string>
  pin?: number
  note?: string
}

export interface UserWithdrawResponse {
  userId: number
  transaction_id: number
  amount: number
  receive: number
  payment_method: string
  details: string
  status: string
  updated_at: string
  created_at: string
  id: number
}

export interface GoldPurchaseResponse {
  success: boolean
  message?: string
}

export interface UserSearchResult {
  uuid: string
  name: string
  lastname: string
  username: string
  kyc: boolean
  golden_check: boolean
  image: string
  cover: string
}
