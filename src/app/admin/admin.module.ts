import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
// para poder utilizar [ngModel]
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AdminRoutingModule } from './admin-routing.module';
import { NavComponent } from './components/nav/nav.component';
import { ProductComponent } from './components/products/product/product.component';
import { ProductsComponent } from './components/products/products.component';
import { ProductListComponent } from './components/products/product-list/product-list.component';
// material design
import { MaterialModule } from './../material/material.module';
import { BooksComponent } from './components/books/books.component';
import { BookFormComponent } from './components/book-form/book-form.component';


@NgModule({
  declarations: [ProductComponent, NavComponent, ProductsComponent, ProductListComponent, BooksComponent, BookFormComponent],
  imports: [
    CommonModule,
    FormsModule,
    AdminRoutingModule,
    MaterialModule,
    RouterModule
  ]
})
export class AdminModule { }
