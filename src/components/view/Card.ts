import { Component } from './Component';
import { ensureElement } from '../../utils/utils';

interface ICardActions {
    onClick: (event: MouseEvent) => void;
}

export interface ICard {
    id: string;
    title: string;
    category: string;
    description: string;
    image: string;
    price: number | null;
    button: string;
    index: number;
}

const categoryClasses: Record<string, string> = {
    'софт-скил': 'card__category_soft',
    'хард-скил': 'card__category_hard',
    'другое': 'card__category_other',
    'дополнительное': 'card__category_additional',
    'кнопка': 'card__category_button'
};

export class Card extends Component<ICard> {
    protected _title: HTMLElement;
    protected _image?: HTMLImageElement;
    protected _category?: HTMLElement;
    protected _price: HTMLElement;
    protected _description?: HTMLElement;
    protected _button?: HTMLButtonElement;
    protected _index?: HTMLElement;

    constructor(container: HTMLElement, actions?: ICardActions) {
        super(container);

        this._title = ensureElement<HTMLElement>('.card__title', container);
        this._price = ensureElement<HTMLElement>('.card__price', container);
        this._image = container.querySelector('.card__image');
        this._category = container.querySelector('.card__category');
        this._description = container.querySelector('.card__text');
        this._button = container.querySelector('.card__button');
        this._index = container.querySelector('.basket__item-index');

        if (actions?.onClick) {
            if (this._button) {
                this._button.addEventListener('click', actions.onClick);
            } else {
                container.addEventListener('click', actions.onClick);
            }
        }
    }

    set id(value: string) {
        this.container.dataset.id = value;
    }

    get id(): string {
        return this.container.dataset.id || '';
    }

    set title(value: string) {
        this.setText(this._title, value);
    }

    get title(): string {
        return this._title.textContent || '';
    }

    set image(value: string) {
        this.setImage(this._image, value, this.title);
    }

    set category(value: string) {
        this.setText(this._category, value);
        const categoryClass = categoryClasses[value] || 'card__category_other';
        this._category.className = 'card__category';
        this.toggleClass(this._category, categoryClass, true);
        
    }

    set price(value: number | null) {
        if (value === null) {
            this.setText(this._price, 'Бесценно');
            if (this._button) {
                this.setDisabled(this._button, true);
            }
        } else {
            this.setText(this._price, `${value} синапсов`);
        }
    }

    set description(value: string) {
        this.setText(this._description, value);
    }

    set button(value: string) {
        this.setText(this._button, value);
    }

    set index(value: number) {
        this.setText(this._index, String(value));
    }
}
