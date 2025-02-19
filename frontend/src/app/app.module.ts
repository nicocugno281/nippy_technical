import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ProductListComponent } from './components/product-list/product-list.component';
import { FormsModule } from '@angular/forms';  
import { HttpClientModule } from '@angular/common/http';
import { ProductDetailComponent } from './components/product-detail/product-detail.component'; 


@NgModule({
  declarations: [
    AppComponent,
    ProductListComponent,
    ProductDetailComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }