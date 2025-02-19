import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductListComponent } from './components/product-list/product-list.component';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';

const routes: Routes = [
    { path: '', component: ProductListComponent },  // Ruta por defecto, lista de productos
    { path: 'products/:id', component: ProductDetailComponent }  // Ruta para el detalle del producto
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
