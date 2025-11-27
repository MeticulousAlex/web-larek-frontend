import { Form } from './Form';
import { IEvents } from '../base/events';
import { IOrderForm } from '../../types/components';
import { ensureAllElements } from '../../utils/utils';
import { Events } from '../../types/events';

export class Order extends Form<IOrderForm> {
    protected _paymentButtons: HTMLButtonElement[];
    protected _addressInput: HTMLInputElement;

    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);

        this._paymentButtons = ensureAllElements<HTMLButtonElement>('.button_alt', container);
        this._addressInput = container.elements.namedItem('address') as HTMLInputElement;

        this._paymentButtons.forEach(button => {
            button.addEventListener('click', () => {
                this.payment = button.textContent;
                events.emit(Events.ORDER_PAYMENT_CHANGE, { field: 'payment', value: button.textContent });
            });
        });

        this._addressInput.addEventListener('change', () => {
            this.address = this._addressInput.value;
            events.emit(Events.ORDER_ADDRESS_CHANGE, {field: 'address', value: this._addressInput.value})
        })
    }

    set payment(value: string) {
        this._paymentButtons.forEach(button => {
            this.toggleClass(button, 'button_alt-active', button.textContent === value);
        });
    }

    set address(value: string) {
        this._addressInput.value = value;
    }
}
