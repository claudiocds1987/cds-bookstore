import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProductsComponent } from './components/products/products.component';
import { ProductComponent } from './components/products/product/product.component';
import { ProductListComponent } from './components/products/product-list/product-list.component';
import { NavComponent } from './components/nav/nav.component';
import { BooksComponent } from './components/books/books.component';
import { BookFormComponent } from './components/book-form/book-form.component';

const routes: Routes = [
  {
    path: '',
    component: NavComponent,
    children: [
      {
        path: 'book-form', // cambialo mas adelante a crear Book
        component: BookFormComponent
      },
      {
        path: 'books',
        component: BooksComponent
      },
      {
        path: 'products',
        component: ProductsComponent
      },
      {
        path: 'createProduct',
        component: ProductComponent
      },
      {
        path: 'productList',
        component: ProductListComponent
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
