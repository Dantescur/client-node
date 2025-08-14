export interface PaymentLinkResponse {
  name: string
  product_id: string
  amount: string
  created_at: Date
  updated_at: Date
  payment_link_url: string
}

export interface CreatePaymentLinkParams {
  name: string
  product_id: string
  amount: number
}
