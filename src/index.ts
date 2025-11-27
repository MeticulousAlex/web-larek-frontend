import './scss/styles.scss';

import { EventEmitter } from './components/base/events';
import { AppState } from './components/model/AppState';
import { LarekAPI } from './components/api/LarekAPI';
import { Page } from './components/view/Page';
import { Card } from './components/view/Card';
import { Basket } from './components/view/Basket';
import { Modal } from './components/view/Modal';
import { Order } from './components/view/Order';
import { Contacts } from './components/view/Contacts';
import { Success } from './components/view/Success';
import { API_URL, CDN_URL } from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils';
import { IOrder, IProduct} from './types/data';
import {IOrderForm, IContactsForm } from './types/components';
import { Events } from './types/events';

const events = new EventEmitter();
const api = new LarekAPI(CDN_URL, API_URL);
const appState = new AppState({}, events);

const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);

const basket = new Basket(cloneTemplate<HTMLElement>('#basket'), events);
const order = new Order(cloneTemplate<HTMLFormElement>('#order'), events);
const contacts = new Contacts(cloneTemplate<HTMLFormElement>('#contacts'), events);
const success = new Success(cloneTemplate<HTMLElement>('#success'), {onClick: () => modal.close()});

api.getProductList()
    .then(appState.setCatalog.bind(appState))
    .catch(console.error);

// Смена каталога
events.on(Events.CATALOG_CHANGED, () => {
    page.catalog = appState.catalog.map(item => {
        const card = new Card(cloneTemplate<HTMLElement>('#card-catalog'), {
            onClick: () => events.emit(Events.CARD_SELECT, item)
        });
        return card.render({
            id: item.id,
            title: item.title,
            image: item.image,
            category: item.category,
            price: item.price
        });
    });
});

// Открыть превью товара
events.on(Events.CARD_SELECT, (item: IProduct) => {
    const card = new Card(cloneTemplate<HTMLElement>('#card-preview'), {
        onClick: () => {
            if (appState.basket.find(basketItem => basketItem.id === item.id)) {
                events.emit(Events.BASKET_REMOVE, item);
                events.emit(Events.CARD_SELECT, item);
            } else {
                events.emit(Events.BASKET_ADD, item);
            }
        }
    });

    modal.render({
        content: card.render({
            id: item.id,
            title: item.title,
            image: item.image,
            category: item.category,
            description: item.description,
            price: item.price,
            button: appState.basket.find(basketItem => basketItem.id === item.id) 
                ? 'Убрать из корзины' 
                : 'В корзину'
        })
    });
});

// Добавить в корзину
events.on(Events.BASKET_ADD, (item: IProduct) => {
    appState.addToBasket(item);
    events.emit(Events.CARD_SELECT, item);
});

// Удалить из корзины
events.on(Events.BASKET_REMOVE, (item: IProduct) => {
    appState.removeFromBasket(item.id);
});

// Изменилась корзина
events.on(Events.BASKET_CHANGED, () => {
    page.counter = appState.basket.length;
    
    basket.items = appState.basket.map((item, index) => {
        const card = new Card(cloneTemplate<HTMLElement>('#card-basket'), {
            onClick: () => events.emit(Events.BASKET_REMOVE, item)
        });
        return card.render({
            id: item.id,
            title: item.title,
            price: item.price,
            index: index + 1
        });
    });
    
    basket.total = appState.getTotal();
    basket.selected = appState.basket.map(item => item.id);
});

// Открыть корзину
events.on(Events.BASKET_OPEN, () => {
    basket.selected = appState.basket.map(item => item.id);
    modal.render({
        content: basket.render()
    });
});

// Открыть форму заказа
events.on(Events.ORDER_OPEN, () => {
    modal.render({
        content: order.render({
            payment: '',
            address: '',
            valid: false,
            errors: []
        })
    });
});

// Изменение оплаты
events.on(Events.ORDER_PAYMENT_CHANGE, (data: { field: string; value: string }) => {
    appState.setOrderField(data.field as keyof IOrder, data.value);
});

// Изменение адреса
events.on(Events.ORDER_ADDRESS_CHANGE, (data: { field: string; value: string }) => {
    appState.setOrderField(data.field as keyof IOrder, data.value);
});

// Отправка первой формы
events.on(Events.ORDER_SUBMIT, () => {
    if (appState.validateOrder()) {
        
        modal.render({
            content: contacts.render({
                email: '',
                phone: '',
                valid: false,
                errors: []
            })
        });
    }
});

// Изменилось поле email
events.on(Events.CONTACTS_EMAIL_CHANGE, (data: { field: string; value: string }) => {
    appState.setContactsField(data.field as keyof IOrder, data.value);
});

// Изменение телефона
events.on(Events.CONTACTS_PHONE_CHANGE, (data: { field: string; value: string }) => {
    appState.setContactsField(data.field as keyof IOrder, data.value);
});

// Отправка формы контактов
events.on(Events.CONTACTS_SUBMIT, () => {
    if (appState.validateContacts()) {
        appState.order.total = appState.getTotal();
        appState.order.items = appState.basket.map(item => item.id);
        
        api.orderProducts(appState.order)
            .then((result) => {
                events.emit(Events.ORDER_SUCCESS, result);
                appState.clearBasket();
            })
            .catch(console.error);
    }
});

// Если вернулось без ошибки - успех
events.on(Events.ORDER_SUCCESS, (result: { id: string; total: number }) => {
    modal.render({
        content: success.render({
            total: result.total
        })
    });
});

// Смена ошибок
events.on(Events.FORM_ERRORS_CHANGED, (errors: Partial<Record<keyof IOrderForm | keyof IContactsForm, string>>) => {
    const { payment, address, email, phone } = errors;
    
    order.valid = !payment && !address;
    order.errors = Object.values({ payment, address }).filter(i => !!i).join('; ');
    
    contacts.valid = !email && !phone;
    contacts.errors = Object.values({ email, phone }).filter(i => !!i).join('; ');
});

// Блокировка прокрутки
events.on(Events.MODAL_OPEN, () => {
    page.locked = true;
});

// Разблокировка прокрутки + очистка форм
events.on(Events.MODAL_CLOSE, () => {
    page.locked = false;

    appState.order = {
        payment: '',
        email: '',
        phone: '',
        address: '',
        total: 0,
        items: []
    };
    appState.formErrors = {};
});
