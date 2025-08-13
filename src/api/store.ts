import type { QvaPayClient } from '../core/client'
import type {
  BuyProductParams,
  PurchasedProduct,
  PurchasedProductsResponse,
  SingleProductResponse,
  StoreProductsResponse,
} from '../interfaces'

export class Store {
  constructor(private readonly client: QvaPayClient) {}

  /**
   * Get my purchased products
   */
  async getMyPurchases(): Promise<PurchasedProductsResponse> {
    return await this.client.request<PurchasedProductsResponse>({
      method: 'GET',
      url: '/store/my',
    })
  }

  /**
   * Get a product by his uuid
   */
  async get(uuid: string): Promise<SingleProductResponse> {
    return await this.client.request({
      method: 'GET',
      url: `/store/${uuid}`,
    })
  }

  /**
   * List all products
   */
  async getAll(): Promise<StoreProductsResponse> {
    return await this.client.request({
      method: 'GET',
      url: '/store',
    })
  }

  /**
   * Get specific purchased product details
   */
  async getPurchaseDetails(id: number): Promise<PurchasedProduct> {
    return await this.client.request<PurchasedProduct>({
      method: 'GET',
      url: `/store/my/${id}`,
    })
  }

  /**
   * Buy a product
   */
  async buyProduct(params: BuyProductParams): Promise<any> {
    return await this.client.request({
      method: 'POST',
      url: '/store/buy',
      data: params,
    })
  }
}
