# Проектная работа "Веб-ларек"

Интернет-магазин товаров для веб-разработчиков с возможностью просмотра каталога, добавления товаров в корзину и оформления заказа.

## Стек технологий

- **TypeScript**
- **HTML**
- **Webpack**
- **SCSS**

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/ — файлы с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами


## Архитектура приложения

Проект реализован по паттерну **MVP (Model-View-Presenter)** с использованием брокера событий (EventEmitter).


### Основные слои

1. **Model (Модель данных)** - управляет данными приложения
2. **View (Отображение)** - отображает данные и обрабатывает действия пользователя
3. **Presenter (Представитель)** - связывает Model и View через события

<img width="2042" height="1418" alt="image" src="https://github.com/user-attachments/assets/df9c7dd7-f8dc-4d28-a027-e5fc0af8d41e" />


## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```

## Базовые классы

### EventEmitter

**Назначение:** Брокер событий для организации взаимодействия между компонентами

**Параметры:** Конструктор не принимает параметров. При создании инициализируется пустая Map для хранения событий и их обработчиков.

**Основные методы:**
- `on<T extends object>(eventName: EventName, callback: (data: T) => void): void` - подписка на событие
- `off(eventName: EventName, callback: Subscriber): void` - отписка от события
- `emit<T extends object>(eventName: string, data?: T): void` - генерация события с данными
- `onAll(callback: (event: EmitterEvent) => void): void` - подписка на все события
- `offAll(): void` - сброс всех обработчиков
- `trigger<T extends object>(eventName: string, context?: Partial<T>): (event: object) => void` - создание триггер-функции для генерации события

---

### Api

**Назначение:** Базовый класс для взаимодействия с API сервера.

**Конструктор:**
```typescript
constructor(baseUrl: string, options: RequestInit = {})
```
**Параметры:**
- `baseUrl: string` - базовый URL для всех API запросов
- `options: RequestInit` - опциональный объект с настройками для fetch запросов.

**Основные методы:**
- `get(uri: string): Promise<object>` - GET запрос
- `post(uri: string, data: object, method: ApiPostMethods = 'POST'): Promise<object>` - POST/PUT/DELETE запрос

---

### Component<T>

**Назначение:** Абстрактный базовый класс для всех UI-компонентов.

**Конструктор:**
```typescript
constructor(protected readonly container: HTMLElement)
```
**Параметры:**
- `container: HTMLElement` - корневой DOM-элемент компонента, внутри которого будет происходить вся работа с отображением

**Основные методы:**
- `toggleClass(element: HTMLElement, className: string, force?: boolean): void` - переключение CSS класса
- `setText(element: HTMLElement, value: string): void` - установка текстового содержимого
- `setDisabled(element: HTMLElement, state: boolean): void` - установка состояния блокировки
- `setHidden(element: HTMLElement): void` - скрытие элемента
- `setVisible(element: HTMLElement): void` - отображение элемента
- `setImage(element: HTMLImageElement, src: string, alt?: string): void` - установка изображения
- `render(data?: Partial<T>): HTMLElement` - рендеринг компонента с переданными данными

---

## Модели данных (Model)

### AppState

**Назначение:** Главная модель приложения, управляет состоянием всего приложения.

**Конструктор:**
```typescript
constructor(data: Partial<IAppState>, protected events: IEvents)
```
**Параметры:**
- `data: Partial<IAppState>` - начальное состояние приложения (обычно пустой объект `{}`).
- `events: IEvents` - экземпляр EventEmitter для генерации событий об изменениях

**Поля:**
- `catalog: IProduct[]` - каталог товаров
- `basket: IProduct[]` - корзина товаров
- `order: IOrder` - данные заказа
- `formErrors: FormErrors` - ошибки валидации форм

**Методы:**
- `setCatalog(items: IProduct[]): void` - установка каталога товаров
- `addToBasket(item: IProduct): void` - добавление товара в корзину
- `removeFromBasket(id: string): void` - удаление товара из корзины
- `clearBasket(): void` - очистка корзины
- `getTotal(): number` - получение общей суммы заказа
- `setOrderField(field: keyof IOrder, value: string): void` - установка поля заказа
- `validateOrder(): boolean` - валидация заказа
- `validateContacts(): boolean` - валидация контактных данных

**Генерируемые события:**
- `catalog:changed` - изменение каталога
- `basket:changed` - изменение корзины
- `order:ready` - заказ исправен и готов к отправке
- `formErrors:changed` - изменение ошибок валидации

---

### LarekAPI

**Назначение:** Класс для работы с API Web-ларька, наследуется от базового класса Api.

**Конструктор:**
```typescript
constructor(cdn: string, baseUrl: string, options?: RequestInit)
```
**Параметры:**
- `cdn: string` - URL CDN для загрузки изображений товаров
- `baseUrl: string` - базовый URL API
- `options?: RequestInit` - опциональные настройки для fetch запросов

**Методы:**
- `getProductList(): Promise<IProduct[]>` - получение списка товаров
- `getProductItem(id: string): Promise<IProduct>` - получение товара по ID
- `orderProducts(order: IOrder): Promise<IOrderResult>` - отправка заказа

---

## Компоненты отображения (View)

### Page

**Назначение:** Компонент главной страницы приложения.

**Конструктор:**
```typescript
constructor(container: HTMLElement, protected events: IEvents)
```
**Параметры:**
- `container: HTMLElement` - корневой элемент страницы
- `events: IEvents` - экземпляр EventEmitter для генерации событий

**Поля:**
- `counter: HTMLElement` - счетчик товаров в корзине
- `catalog: HTMLElement` - контейнер каталога
- `wrapper: HTMLElement` - обертка страницы
- `basket: HTMLElement` - кнопка корзины

**Методы:**
- `set counter(value: number): void` - установка значения счетчика
- `set catalog(items: HTMLElement[]): void` - установка элементов каталога
- `set locked(value: boolean): void` - блокировка прокрутки страницы

---

### Card

**Назначение:** Компонент карточки товара.

**Варианты использования:**
- Карточка в каталоге
- Карточка в модальном окне (превью)
- Компактная карточка в корзине

**Конструктор:**
```typescript
constructor(container: HTMLElement, actions?: ICardActions)
```
**Параметры:**
- `container: HTMLElement` - DOM-элемент темплейта карточки (получается через `cloneTemplate()`)
- `actions?: ICardActions` - опциональный объект с обработчиками событий. Обычно содержит `onClick: (event: MouseEvent) => void`.

**Поля:**
- `title: HTMLElement` - название товара
- `image: HTMLImageElement` - изображение товара
- `category: HTMLElement` - категория товара
- `price: HTMLElement` - цена товара
- `description: HTMLElement` - описание товара
- `button: HTMLButtonElement` - кнопка действия

**Методы:**
- `set id(value: string): void` - установка ID
- `set title(value: string): void` - установка названия
- `set image(value: string): void` - установка изображения
- `set category(value: string): void` - установка категории
- `set price(value: number | null): void` - установка цены
- `set description(value: string): void` - установка описания

---

### Basket

**Назначение:** Компонент корзины покупок.

**Конструктор:**
```typescript
constructor(container: HTMLElement, protected events: IEvents)
```
**Параметры:**
- `container: HTMLElement` - DOM-элемент темплейта корзины
- `events: IEvents` - экземпляр EventEmitter для генерации события открытия формы заказа

**Поля:**
- `list: HTMLElement` - список товаров
- `total: HTMLElement` - общая сумма
- `button: HTMLButtonElement` - кнопка оформления

**Методы:**
- `set items(items: HTMLElement[]): void` - установка списка товаров
- `set total(value: number): void` - установка общей суммы
- `set selected(items: string[]): void` - смена состояния кнопки "оформить" в зависимости от наличия заказов в корзине

---

### Order

**Назначение:** Компонент формы заказа (первый шаг - способ оплаты и адрес).

**Конструктор:**
```typescript
constructor(container: HTMLFormElement, protected events: IEvents)
```
**Параметры:**
- `container: HTMLFormElement` - DOM-элемент формы заказа
- `events: IEvents` - экземпляр EventEmitter для генерации событий при изменении полей и отправке формы

**Поля:**
- `payment: HTMLElement` - кнопки выбора способа оплаты
- `address: HTMLInputElement` - поле ввода адреса
- `formErrors: FormErrors` - ошибки формы

**Методы:**
- `set payment(value: string): void` - установка способа оплаты
- `set address(value: string): void` - установка адреса
- `set valid(value: boolean): void` - установка валидности формы
- `set errors(value: string): void` - установка текста ошибки

---

### Contacts

**Назначение:** Компонент формы контактных данных (второй шаг - email и телефон).

**Конструктор:**
```typescript
constructor(container: HTMLFormElement, protected events: IEvents)
```
**Параметры:**
- `container: HTMLFormElement` - DOM-элемент формы контактов
- `events: IEvents` - экземпляр EventEmitter для генерации событий при изменении полей и отправке формы

**Поля:**
- `email: HTMLInputElement` - поле ввода email
- `phone: HTMLInputElement` - поле ввода телефона

**Методы:**
- `set email(value: string): void` - установка email
- `set phone(value: string): void` - установка телефона
- `set valid(value: boolean): void` - установка валидности формы
- `set errors(value: string): void` - установка текста ошибки

---

### Success

**Назначение:** Компонент модального окна успешного оформления заказа.

**Конструктор:**
```typescript
constructor(container: HTMLElement, actions: ISuccessActions)
```
**Параметры:**
- `container: HTMLElement` - DOM-элемент темплейта окна успеха
- `actions: ISuccessActions` - объект с обработчиками событий. Обычно содержит `onClick: () => void` для закрытия окна

**Поля:**
- `total: HTMLElement` - списанная сумма
- `close: HTMLButtonElement` - кнопка закрытия

**Методы:**
- `set total(value: number): void` - установка суммы

---

### Modal

**Назначение:** Компонент модального окна.

**Конструктор:**
```typescript
constructor(container: HTMLElement, protected events: IEvents)
```
**Параметры:**
- `container: HTMLElement` - DOM-элемент контейнера модального окна
- `events: IEvents` - экземпляр EventEmitter для генерации событий открытия/закрытия

**Поля:**
- `content: HTMLElement` - контейнер содержимого
- `closeButton: HTMLButtonElement` - кнопка закрытия

**Методы:**
- `set content(value: HTMLElement): void` - установка содержимого
- `open(): void` - открытие модального окна
- `close(): void` - закрытие модального окна

---

### Form

**Назначение:** Базовый компонент формы.

**Конструктор:**
```typescript
constructor(container: HTMLFormElement, protected events: IEvents)
```
**Параметры:**
- `container: HTMLFormElement` - DOM-элемент формы
- `events: IEvents` - экземпляр EventEmitter для генерации событий при изменении полей и отправке

**Поля:**
- `submit: HTMLButtonElement` - кнопка отправки
- `errors: HTMLElement` - контейнер ошибок

**Методы:**
- `set valid(value: boolean): void` - установка валидности формы
- `set errors(value: string): void` - установка текста ошибок
- `render(state: Partial<T> & IFormState): HTMLElement` - рендеринг состояния формы

---

## Типы данных

### Данные товара

```typescript
interface IProduct {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number | null;
}
```

### Данные заказа

```typescript
interface IOrder {
    payment: PaymentMethod;
    email: string;
    phone: string;
    address: string;
    total: number;
    items: string[];
}

type PaymentMethod = 'online' | 'cash';
```

### Результат заказа

```typescript
interface IOrderResult {
    id: string;
    total: number;
}
```

### Ошибки форм

```typescript
type FormErrors = Partial<Record<keyof IOrder, string>>;
```

### Состояние приложения

```typescript
interface IAppState {
    catalog: IProduct[];
    basket: IProduct[];
    order: IOrder | null;
    formErrors: FormErrors;
}
```

## Взаимодействие компонентов

Все взаимодействие между компонентами происходит через события, генерируемые через EventEmitter.

### Основные события

#### События изменения данных
- `catalog:changed` - изменился каталог товаров
- `basket:changed` - изменилась корзина
- `order:ready` - заказ готов к отправке
- `formErrors:changed` - изменились ошибки валидации

#### События взаимодействия с UI
- `card:select` - выбрана карточка товара
- `basket:open` - открыта корзина
- `basket:add` - товар добавлен в корзину
- `basket:remove` - товар удален из корзины
- `order:open` - открыта форма заказа
- `order:submit` - отправка формы заказа (шаг 1)
- `contacts:submit` - отправка контактных данных (шаг 2)
- `order:success` - успешное оформление заказа
- `modal:open` - открытие модального окна
- `modal:close` - закрытие модального окна

#### События изменения полей форм
- `order.payment:change` - изменение способа оплаты
- `order.address:change` - изменение адреса
- `contacts.email:change` - изменение email
- `contacts.phone:change` - изменение телефона