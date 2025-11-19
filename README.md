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

**Основные методы:**
- `on<T>(eventName, callback)` - подписка на событие
- `off(eventName, callback)` - отписка от события
- `emit<T>(eventName, data?)` - генерация события
- `onAll(callback)` - подписка на все события
- `offAll()` - сброс всех обработчиков
- `trigger<T>(eventName, context?)` - создание триггер-функции для генерации события

### Api

**Назначение:** Базовый класс для взаимодействия с API сервера.

**Основные методы:**
- `get(uri: string)` - GET запрос
- `post(uri: string, data: object, method?)` - POST/PUT/DELETE запрос

### Component<T>

**Назначение:** Абстрактный базовый класс для всех UI-компонентов.

**Основные методы:**
- `toggleClass(element, className, force?)` - переключение CSS класса
- `setText(element, value)` - установка текстового содержимого
- `setDisabled(element, state)` - установка состояния блокировки
- `setHidden(element)` - скрытие элемента
- `setVisible(element)` - отображение элемента
- `setImage(element, src, alt?)` - установка изображения
- `render(data?)` - рендеринг компонента

## Модели данных (Model)

### AppState

**Назначение:** Главная модель приложения, управляет состоянием всего приложения.

**Поля:**
- `catalog: IProduct[]` - каталог товаров
- `basket: IProduct[]` - корзина товаров
- `order: IOrder` - данные заказа
- `formErrors: FormErrors` - ошибки валидации форм

**Методы:**
- `setCatalog(items: IProduct[])` - установка каталога товаров
- `addToBasket(item: IProduct)` - добавление товара в корзину
- `removeFromBasket(id: string)` - удаление товара из корзины
- `clearBasket()` - очистка корзины
- `getTotal()` - получение общей суммы заказа
- `setOrderField(field, value)` - установка поля заказа
- `validateOrder()` - валидация заказа
- `validateContacts()` - валидация контактных данных

**Генерируемые события:**
- `catalog:changed` - изменение каталога
- `basket:changed` - изменение корзины
- `order:ready` - заказ исправен и готов к отправке
- `formErrors:changed` - изменение ошибок валидации

### LarekAPI

**Назначение:** Класс для работы с API Web-ларька, наследуется от базового класса Api.

**Методы:**
- `getProductList(): Promise<IProduct[]>` - получение списка товаров
- `getProductItem(id: string): Promise<IProduct>` - получение товара по ID
- `orderProducts(order: IOrder): Promise<IOrderResult>` - отправка заказа

## Компоненты отображения (View)

### Page

**Назначение:** Компонент главной страницы приложения.

**Поля:**
- `counter: HTMLElement` - счетчик товаров в корзине
- `catalog: HTMLElement` - контейнер каталога
- `wrapper: HTMLElement` - обертка страницы
- `basket: HTMLElement` - кнопка корзины

**Методы:**
- `set counter(value: number)` - установка значения счетчика
- `set catalog(items: HTMLElement[])` - установка элементов каталога
- `set locked(value: boolean)` - блокировка прокрутки страницы

### Card

**Назначение:** Компонент карточки товара.

**Варианты использования:**
- Карточка в каталоге
- Карточка в модальном окне (превью)
- Компактная карточка в корзине

**Поля:**
- `title: HTMLElement` - название товара
- `image: HTMLImageElement` - изображение товара
- `category: HTMLElement` - категория товара
- `price: HTMLElement` - цена товара
- `description: HTMLElement` - описание товара
- `button: HTMLButtonElement` - кнопка действия

**Методы:**
- `set id(value: string)` - установка ID
- `set title(value: string)` - установка названия
- `set image(value: string)` - установка изображения
- `set category(value: string)` - установка категории
- `set price(value: number | null)` - установка цены
- `set description(value: string)` - установка описания

### Basket

**Назначение:** Компонент корзины покупок.

**Поля:**
- `list: HTMLElement` - список товаров
- `total: HTMLElement` - общая сумма
- `button: HTMLButtonElement` - кнопка оформления

**Методы:**
- `set items(items: HTMLElement[])` - установка списка товаров
- `set total(value: number)` - установка общей суммы
- `set selected(items: string[])` - смена состояния кнопки "оформить" в зависимости от наличия заказов в корзине.

### Order

**Назначение:** Компонент формы заказа (первый шаг - способ оплаты и адрес).

**Поля:**
- `payment: HTMLElement` - кнопки выбора способа оплаты
- `address: HTMLInputElement` - поле ввода адреса
- `formErrors: FormErrors` - ошибки формы

**Методы:**
- `set payment(value: string)` - установка способа оплаты
- `set address(value: string)` - установка адреса
- `set valid(value: boolean)` - установка валидности формы
- `set errors(value: string)` - установка текста ошибки

### Contacts

**Назначение:** Компонент формы контактных данных (второй шаг - email и телефон).

**Поля:**
- `email: HTMLInputElement` - поле ввода email
- `phone: HTMLInputElement` - поле ввода телефона

**Методы:**
- `set email(value: string)` - установка email
- `set phone(value: string)` - установка телефона
- `set valid(value: boolean)` - установка валидности формы
- `set errors(value: string)` - установка текста ошибки

### Success

**Назначение:** Компонент модального окна успешного оформления заказа.

**Поля:**
- `total: HTMLElement` - списанная сумма
- `close: HTMLButtonElement` - кнопка закрытия

**Методы:**
- `set total(value: number)` - установка суммы

### Modal

**Назначение:** Компонент модального окна.

**Поля:**
- `content: HTMLElement` - контейнер содержимого
- `closeButton: HTMLButtonElement` - кнопка закрытия

**Методы:**
- `set content(value: HTMLElement)` - установка содержимого
- `open()` - открытие модального окна
- `close()` - закрытие модального окна

### Form

**Назначение:** Базовый компонент формы.

**Поля:**
- `submit: HTMLButtonElement` - кнопка отправки
- `errors: HTMLElement` - контейнер ошибок

**Методы:**
- `set valid(value: boolean)` - установка валидности формы
- `set errors(value: string)` - установка текста ошибок
- `render(state)` - рендеринг состояния формы

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
