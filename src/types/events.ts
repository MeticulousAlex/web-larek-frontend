import { IProduct, IOrder } from "./data";

export enum Events { // кастомные ивенты для брокера
	// смена данных
	CATALOG_CHANGED = 'catalog:changed',
	BASKET_CHANGED = 'basket:changed',
	ORDER_READY = 'order:ready',
	FORM_ERRORS_CHANGED = 'formErrors:changed',

	//UI ивенты
	CARD_SELECT = 'card:select',
	BASKET_OPEN = 'basket:open',
	BASKET_ADD = 'basket:add',
	BASKET_REMOVE = 'basket:remove',
	ORDER_OPEN = 'order:open',
	ORDER_SUBMIT = 'order:submit',
	CONTACTS_SUBMIT = 'contacts:submit',
	ORDER_SUCCESS = 'order:success',
	MODAL_OPEN = 'modal:open',
	MODAL_CLOSE = 'modal:close',

	// Ивенты формы
	ORDER_PAYMENT_CHANGE = 'order.payment:change',
	ORDER_ADDRESS_CHANGE = 'order.address:change',
	CONTACTS_EMAIL_CHANGE = 'contacts.email:change',
	CONTACTS_PHONE_CHANGE = 'contacts.phone:change',
}

// Данные ивентов

export interface ICardSelectEvent {
	card: IProduct;
}

export interface IBasketAddEvent {
	product: IProduct;
}

export interface IBasketRemoveEvent {
	id: string;
}

export interface IOrderFieldChangeEvent {
	field: keyof IOrder;
	value: string;
}

export interface IOrderSuccessEvent {
	total: number;
}