import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
    { path: '', component: HomeComponent },
    {
        path: 'shop',
        loadChildren: () =>
            import('./shop/shop.module').then((mod) => mod.ShopModule)
        // now the shopModule is going to be activated and loaded when
        // we access the shop path
    },
    { path: '**', redirectTo: '', pathMatch: 'full' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {}
