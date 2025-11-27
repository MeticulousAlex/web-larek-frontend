import { Api, ApiListResponse } from '../base/api';
import { IProduct, IOrder, IOrderResult } from '../../types/data';

export class LarekAPI extends Api {
    readonly cdn: string;

    constructor(cdn: string, baseUrl: string, options?: RequestInit) {
        super(baseUrl, options);
        this.cdn = cdn;
    }

    // Получить список товаров
    getProductList(): Promise<IProduct[]> {
        return this.get('/product').then((data: ApiListResponse<IProduct>) =>
            data.items.map((item) => ({
                ...item,
                image: this.cdn + item.image
            }))
        );
    }

    // Получить товар по ID
    getProductItem(id: string): Promise<IProduct> {
        return this.get(`/product/${id}`).then((item: IProduct) => ({
            ...item,
            image: this.cdn + item.image
        }));
    }

    // Отправить заказ
    orderProducts(order: IOrder): Promise<IOrderResult> {
        return this.post('/order', order).then((data: IOrderResult) => data);
    }
}
