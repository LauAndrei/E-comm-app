import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import {
    Basket,
    IBasket,
    IBasketItem,
    IBasketTotals
} from '../shared/models/basket';
import { IDeliveryMethod } from '../shared/models/deliveryMethod';
import { IProduct } from '../shared/Models/product';

@Injectable({
    providedIn: 'root'
})
export class BasketService {
    baseUrl = environment.apiUrl;

    private basketSource = new BehaviorSubject<IBasket>(null);
    basket$ = this.basketSource.asObservable();

    private basketTotalSource = new BehaviorSubject<IBasketTotals>(null);
    basketTotal$ = this.basketTotalSource.asObservable();

    shipping = 0;

    constructor(private http: HttpClient) {}

    getBasket(id: string) {
        // from the response that we get back from http client
        // which should contain our basket, we need to set our basket source
        // with the basket we get back from our API and we'll use pipe to achieve
        // that
        return this.http.get(this.baseUrl + 'basket?id=' + id).pipe(
            map((basket: IBasket) => {
                this.basketSource.next(basket);
                this.calculateTotals();
            })
        );
    }

    // this is gonna update the BehaviorSubject with the new value of the basket
    // that we have
    setBasket(basket: IBasket) {
        return this.http.post(this.baseUrl + 'basket', basket).subscribe(
            (response: IBasket) => {
                this.basketSource.next(response);
                this.calculateTotals();
            },
            (error) => {
                console.log(error);
            }
        );
    }

    getCurrentBasketValue() {
        return this.basketSource.value;
    }

    addItemToBasket(item: IProduct, quantity = 1) {
        const itemToAdd: IBasketItem = this.mapProductItemToBasketItem(
            item,
            quantity
        );
        const basket = this.getCurrentBasketValue() ?? this.createBasket();
        basket.items = this.addOrUpdateItem(basket.items, itemToAdd, quantity);
        this.setBasket(basket);
    }

    incrementItemQuantity(item: IBasketItem) {
        const basket = this.getCurrentBasketValue();
        const foundItemIndex = basket.items.findIndex((x) => x.id === item.id);
        basket.items[foundItemIndex].quantity++;
        this.setBasket(basket);
    }

    decrementItemQuantity(item: IBasketItem) {
        const basket = this.getCurrentBasketValue();
        const foundItemIndex = basket.items.findIndex((x) => x.id === item.id);
        if (basket.items[foundItemIndex].quantity > 1) {
            basket.items[foundItemIndex].quantity--;
            this.setBasket(basket);
        } else {
            this.removeItemFromBasket(item);
        }
    }

    removeItemFromBasket(item: IBasketItem) {
        const basket = this.getCurrentBasketValue();
        if (basket.items.some((x) => x.id === item.id)) {
            basket.items = basket.items.filter((x) => x.id !== item.id);
            if (basket.items.length > 0) {
                this.setBasket(basket);
            } else {
                this.deleteBasket(basket);
            }
        }
    }

    /**
     * This method is used in createOrder() method from checkoutService
     * because when we create an order, the basket is automatically
     * removed from the redis DB, so we don't need to go back to our api
     * to remove something that's not there, we just need to remove the
     * basket locally
     */
    deleteLocalBasket() {
        this.basketSource.next(null);
        this.basketTotalSource.next(null);
        localStorage.removeItem('basket_id');
    }

    deleteBasket(basket: IBasket) {
        return this.http
            .delete(this.baseUrl + 'basket?id=' + basket.id)
            .subscribe(
                () => {
                    this.basketSource.next(null);
                    this.basketTotalSource.next(null);
                    localStorage.removeItem('basket_id');
                },
                (err) => {
                    console.log(err);
                }
            );
    }

    /**
     * This method gets the price of shipping and then calculates the total
     * by calling the function "calculateTotals()"
     * @param deliveryMethod the delivery method
     */
    setShippingPrice(deliveryMethod: IDeliveryMethod) {
        this.shipping = deliveryMethod.price;
        this.calculateTotals();
    }

    private createBasket(): IBasket {
        const basket = new Basket();
        // we want to store the basket id somewhere so
        // that when we load our application or when the user comes
        // into our application we've got the ID of the basket and we can
        // go and retrieve it from our API when the application starts up if they have
        // one already, so we'll use localStorage on the client's browser
        // to store the basket id once it's been created
        localStorage.setItem('basket_id', basket.id);
        return basket;
    }

    private addOrUpdateItem(
        items: IBasketItem[],
        itemToAdd: IBasketItem,
        quantity: number
    ): IBasketItem[] {
        console.log(items);
        const index = items.findIndex((i) => i.id === itemToAdd.id);
        if (index === -1) {
            // item not found
            itemToAdd.quantity = quantity;
            items.push(itemToAdd);
        } else {
            items[index].quantity += quantity;
        }
        return items;
    }

    private calculateTotals() {
        const basket = this.getCurrentBasketValue();
        const shipping = this.shipping;
        const subtotal = basket.items.reduce(
            (a, b) => b.price * b.quantity + a,
            0
        );
        const total = subtotal + shipping;
        this.basketTotalSource.next({ shipping, total, subtotal });
    }

    /**
     * This method is used to transform from a Product type item to a BasketItem
     * @param item
     * @param quantity
     */
    private mapProductItemToBasketItem(
        item: IProduct,
        quantity: number
    ): IBasketItem {
        return {
            id: item.id,
            productName: item.name,
            price: item.price,
            pictureUrl: item.pictureUrl,
            quantity,
            brand: item.productBrand,
            type: item.productType
        };
    }
}
