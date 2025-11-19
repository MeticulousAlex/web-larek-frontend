import { IProduct, IOrder, IOrderResult } from "./data";

export interface ILarekAPI { 
	getProductList: () => Promise<IProduct[]>;
	getProductItem: (id: string) => Promise<IProduct>;
	orderProducts: (order: IOrder) => Promise<IOrderResult>;
}
