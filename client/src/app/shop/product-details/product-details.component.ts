import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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

    constructor(
        private shopService: ShopService,
        private activatedRoute: ActivatedRoute,
        private breadcrumbService: BreadcrumbService
    ) {
        this.breadcrumbService.set('@productDetails', ' ');
    }

    ngOnInit(): void {
        this.loadProduct();
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
