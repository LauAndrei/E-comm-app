import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrdersComponent } from './orders.component';
import { OrdersRoutingModule } from './orders-routing.module';
import { SharedModule } from '../shared/shared.module';
import { OrderDetailedComponent } from './order-detailed/order-detailed.component';

@NgModule({
    declarations: [OrdersComponent, OrderDetailedComponent],
    imports: [CommonModule, OrdersRoutingModule, SharedModule]
})
export class OrdersModule {}
