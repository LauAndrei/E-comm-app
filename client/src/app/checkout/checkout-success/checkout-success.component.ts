import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IOrder } from 'src/app/shared/models/order';

@Component({
    selector: 'app-checkout-success',
    templateUrl: './checkout-success.component.html',
    styleUrls: ['./checkout-success.component.scss']
})
export class CheckoutSuccessComponent implements OnInit {
    order: IOrder;

    constructor(private router: Router) {
        // we need to get our navigation extras here;
        // we won't have it if we try to do this inside onInit
        const navigation = this.router.getCurrentNavigation();
        const state =
            navigation && navigation.extras && navigation.extras.state;
        if (state) {
            this.order = state as IOrder;
        } else {
        }
    }

    ngOnInit(): void {}
}
