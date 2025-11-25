import { IEvents } from '../base/events';
import { IProduct, IOrder, FormErrors, IAppState } from '../../types/data';

export class AppState implements IAppState {
    catalog: IProduct[] = [];
    basket: IProduct[] = [];
    order: IOrder = {
        payment: '',
        email: '',
        phone: '',
        address: '',
        total: 0,
        items: []
    };
    formErrors: FormErrors = {};

    constructor(data: Partial<IAppState>, protected events: IEvents) {
        Object.assign(this, data);
    }

    setCatalog(items: IProduct[]): void {
        this.catalog = items;
        this.events.emit('catalog:changed', { catalog: this.catalog });
    }

    addToBasket(item: IProduct): void {
        if (item.price === null) {
            return;
        }
        if (!this.basket.find(basketItem => basketItem.id === item.id)) {
            this.basket.push(item);
            this.events.emit('basket:changed', { basket: this.basket });
        }
    }

    removeFromBasket(id: string): void {
        this.basket = this.basket.filter(item => item.id !== id);
        this.events.emit('basket:changed', { basket: this.basket });
    }

    // Очистить корзину когда заказ завершен
    clearBasket(): void {
        this.basket = [];
        this.events.emit('basket:changed', { basket: this.basket });
    }

    // Получить всю сумму заказа
    getTotal(): number {
        return this.basket.reduce((total, item) => total + (item.price || 0), 0);
    }

    setOrderField(field: keyof IOrder, value: string): void {
        this.order[field] = value as never;

        if (this.validateOrder()) {
            this.events.emit('order:ready', this.order);
        }
    }
    
    setContactsField(field: keyof IOrder, value: string): void {
        this.order[field] = value as never;

        if (this.validateContacts()) {
            this.events.emit('order:ready', this.order);
        }
    }

    // Валидация данных (оплата/адрес)
    validateOrder(): boolean {
        const errors: FormErrors = {};
        if (!this.order.payment) {
            errors.payment = 'Необходимо указать способ оплаты';
        }
        if (!this.order.address) {
            errors.address = 'Необходимо указать адрес';
        }

        this.formErrors = errors;
        this.events.emit('formErrors:changed', this.formErrors);
        return Object.keys(errors).length === 0;
    }

    // Валидация контактных данных
    validateContacts(): boolean {
        const errors: FormErrors = {};
        
        if (!this.order.email) {
            errors.email = 'Необходимо указать email';
        }
        if (!this.order.phone) {
            errors.phone = 'Необходимо указать телефон';
        }

        this.formErrors = errors;
        this.events.emit('formErrors:changed', this.formErrors);
        return Object.keys(errors).length === 0;
    }
}
