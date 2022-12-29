import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IProduct } from 'src/app/shared/Models/product';
import { ShopService } from '../shop.service';

@Component({
    selector: 'app-product-details',
    templateUrl: './product-details.component.html',
    styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit {
    product: IProduct;

    constructor(
        private shopService: ShopService,
        private activatedRoute: ActivatedRoute
    ) {}

    ngOnInit(): void {
        this.loadProduct();
    }

    loadProduct() {
        this.shopService.getProduct(this.getProductId()).subscribe(
            (product) => {
                this.product = product;
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
