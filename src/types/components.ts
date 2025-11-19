import { IEvents } from "../components/base/events";
import { PaymentMethod } from "./data";


//Component

export interface IComponent<T> {
    render(data?: Partial<T>): HTMLElement;
}


export interface IComponentConstructor<T> {
    new (container: HTMLElement): IComponent<T>;
}

// Page

export interface IPage {
	counter: number;
	catalog: HTMLElement[];
	locked: boolean;
}

export interface IPageConstructor {
	new (container: HTMLElement, events: IEvents): Page;
}

//Card

export interface ICard {
	id: string;
	title: string;
	image: string;
	category: string;
	price: number | null;
	description?: string;
	button?: string;
}

export interface ICardConstructor {
    new (
        container: HTMLElement,
        actions?: ICardActions
    ): Card;
}

export interface ICardActions {
	onClick: (event: MouseEvent) => void;
}


// Basket 

export interface IBasket {
    items: HTMLElement[];
    total: number;
    selected: string[];
}

export interface IBasketConstructor {
	new (container: HTMLElement, events: IEvents): Basket;
}

// Modal

export interface IModal {
	content: HTMLElement;
}

export interface IModalActions {
	onClick: () => void;
}

export interface IModalConstructor {
    new (container: HTMLElement, events: IEvents): Modal;
}

//Form

export interface IFormState {
	valid: boolean;
	errors: string[];
}

export interface IFormConstructor<T> {
	new (container: HTMLElement, events: IEvents): Form<T>;
}

// OrderForm

export interface IOrderForm {
	payment: PaymentMethod;
	address: string;
	valid: boolean;
	errors: string[];
}

export interface IOrderConstructor {
    new (container: HTMLElement, events: IEvents): Order;
}

// ContactsForm

export interface IContactsForm {
	email: string;
	phone: string;
	valid: boolean;
	errors: string[];
}

export interface IContactsConstructor {
	new (container: HTMLElement, events: IEvents): Contacts;
}

//Success

export interface ISuccess {
	total: number;
}

export interface ISuccessActions {
	onClick: () => void;
}

export interface ISuccessConstructor {
    new (container: HTMLElement, actions: ISuccessActions): Success;
}

////////// Abstracts

export abstract class Page implements IComponent<IPage> {
	protected container: HTMLElement;
	protected events: IEvents;
	protected _counter: HTMLElement;
	protected _catalog: HTMLElement;
	protected _wrapper: HTMLElement;
	protected _basket: HTMLElement;

	constructor(container: HTMLElement, events: IEvents) {
		this.container = container;
		this.events = events;
	}

	abstract set counter(value: number);
	abstract set catalog(items: HTMLElement[]);
	abstract set locked(value: boolean);
	abstract render(data?: Partial<IPage>): HTMLElement;
}

export abstract class Card implements IComponent<ICard> {
    protected container: HTMLElement;
    protected _title: HTMLElement;
    protected _image?: HTMLImageElement;
    protected _category?: HTMLElement;
    protected _price: HTMLElement;
    protected _description?: HTMLElement;
    protected _button?: HTMLButtonElement;

    constructor(container: HTMLElement, actions?: ICardActions) {
        this.container = container;
    }

    abstract set id(value: string);
    abstract set title(value: string);
    abstract set image(value: string);
    abstract set category(value: string);
    abstract set price(value: number | null);
    abstract set description(value: string);
    abstract render(data?: Partial<ICard>): HTMLElement;
}

export abstract class Basket implements IComponent<IBasket> {
    protected container: HTMLElement;
    protected _list: HTMLElement;
    protected _total: HTMLElement;
    protected _button: HTMLButtonElement;

    constructor(container: HTMLElement, events: IEvents) {
        this.container = container;
    }

    abstract set items(items: HTMLElement[]);
    abstract set total(value: number);
    abstract set selected(items: string[]);
    abstract render(data?: Partial<IBasket>): HTMLElement;
}

export abstract class Modal implements IComponent<IModal> {
	protected container: HTMLElement;
	protected _closeButton: HTMLButtonElement;
	protected _content: HTMLElement;

	constructor(container: HTMLElement, events: IEvents) {
		this.container = container;
	}

	abstract set content(value: HTMLElement);
	abstract open(): void;
	abstract close(): void;
	abstract render(data: IModal): HTMLElement;
}

export abstract class Form<T> implements IComponent<IFormState> {
	protected container: HTMLFormElement;
	protected _submit: HTMLButtonElement;
	protected _errors: HTMLElement;

	constructor(container: HTMLFormElement, events: IEvents) {
		this.container = container;
	}

	abstract set valid(value: boolean);
	abstract set errors(value: string);
	abstract render(state: Partial<T> & IFormState): HTMLElement;
}

export abstract class Order extends Form<IOrderForm> {
	protected _payment: HTMLElement;
	protected _address: HTMLInputElement;

	abstract set payment(value: PaymentMethod);
	abstract set address(value: string);
}

export abstract class Contacts extends Form<IContactsForm> {
	protected _email: HTMLInputElement;
	protected _phone: HTMLInputElement;

	abstract set email(value: string);
	abstract set phone(value: string);
}

export abstract class Success implements IComponent<ISuccess> {
	protected container: HTMLElement;
	protected _total: HTMLElement;
	protected _close: HTMLButtonElement;

	constructor(container: HTMLElement, actions: ISuccessActions) {
		this.container = container;
	}

	abstract set total(value: number);
	abstract render(data: ISuccess): HTMLElement;
}