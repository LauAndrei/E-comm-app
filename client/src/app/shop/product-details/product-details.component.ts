import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BasketService } from 'src/app/basket/basket.service';
import { IProduct } from 'src/app/shared/Models/product';
import { BreadcrumbService } from 'xng-breadcrumb';
import { ShopService } from '../shop.service';

@Component({
    selector: 'app-product-details',
    templateUrl: './product-details.component.html',
    styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit {
    product: IProduct;
    quantity = 1;

    constructor(
        private shopService: ShopService,
        private activatedRoute: ActivatedRoute,
        private breadcrumbService: BreadcrumbService,
        private basketService: BasketService
    ) {
        this.breadcrumbService.set('@productDetails', ' ');
    }

    ngOnInit(): void {
        this.loadProduct();
    }

    addItemToBasket() {
        this.basketService.addItemToBasket(this.product, this.quantity);
    }

    incrementQuantity() {
        this.quantity++;
    }

    decrementQuantity() {
        if (this.quantity > 1) {
            this.quantity--;
        }
    }

    loadProduct() {
        this.shopService.getProduct(this.getProductId()).subscribe(
            (product) => {
                this.product = product;
                // we can access the alias by using '@'
                this.breadcrumbService.set('@productDetails', product.name);
            },
            (err) => {
                console.log(err);
            }
        );
    }

    getProductId() {
        return +this.activatedRoute.snapshot.paramMap.get('id');
    }
}
