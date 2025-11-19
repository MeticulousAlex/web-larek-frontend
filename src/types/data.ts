
export interface IProduct {
	id: string;
	description: string;
	image: string;
	title: string;
	category: ProductCategory;
	price: number | null;
}

export type ProductCategory =
	| 'софт-скил'
	| 'другое'
	| 'дополнительное'
	| 'кнопка'
	| 'хард-скил';


export type PaymentMethod = 'Онлайн' | 'При получении';

export interface IOrder {
	payment: PaymentMethod;
	email: string;
	phone: string;
	address: string;
	total: number;
	items: string[];
}

export interface IOrderResult {
	id: string;
	total: number;
}

export type FormErrors = Partial<Record<keyof IOrder, string>>;

export interface IAppState {
	catalog: IProduct[];
	basket: IProduct[];
	order: IOrder | null;
	formErrors: FormErrors;
}

export interface IAppStateModel {
	catalog: IProduct[];
	basket: IProduct[];
	order: IOrder;
	formErrors: FormErrors;


	setCatalog(items: IProduct[]): void;
	addToBasket(item: IProduct): void;
	removeFromBasket(id: string): void;
	clearBasket(): void;
	getTotal(): number;
	setOrderField(field: keyof IOrder, value: string): void;
	validateOrder(): boolean;
	validateContacts(): boolean;
}