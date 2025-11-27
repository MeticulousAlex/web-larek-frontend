import { Component } from './Component';
import { IEvents } from '../base/events';
import { ensureElement, createElement } from '../../utils/utils';
import { Events } from '../../types/events';

interface IBasketView {
    items: HTMLElement[];
    total: number;
    selected: string[];
}

export class Basket extends Component<IBasketView> {
    protected _list: HTMLElement;
    protected _total: HTMLElement;
    protected _button: HTMLButtonElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);

        this._list = ensureElement<HTMLElement>('.basket__list', container);
        this._total = ensureElement<HTMLElement>('.basket__price', container);
        this._button = ensureElement<HTMLButtonElement>('.basket__button', container);

        if (this._button) {
            this._button.addEventListener('click', () => {
                this.events.emit(Events.ORDER_OPEN);
            });
        }

        this.items = [];
    }

    set items(items: HTMLElement[]) {
        if (items.length) {
            this._list.replaceChildren(...items);
        } else {
            this._list.replaceChildren(
                createElement<HTMLParagraphElement>('p', {
                    textContent: 'Корзина пуста'
                })
            );
        }
    }

    set selected(items: string[]) {
        this.setDisabled(this._button, items.length === 0);
    }

    set total(value: number) {
        this.setText(this._total, `${value} синапсов`);
    }
}
