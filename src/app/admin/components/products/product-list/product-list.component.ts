import { Component, OnInit } from '@angular/core';
// Services
import { ToastrService } from 'ngx-toastr';
import { ProductService } from '../../../../core/services/product.service';
// Product class
import { Product } from '../../../../core/models/product';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {
  // array de tipo Product
  productList: Product[];

  constructor(
    private productService: ProductService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    // al iniciar traigo todos los productos de la db firebase
    this.productService.getProducts()
    .snapshotChanges() // escucha los cambios que ocurran en la db firebase
    .subscribe(item => {
      this.productList = []; // array vacio
      item.forEach(element => {
        let x = element.payload.toJSON(); // convierto a JSON los datos traidos de firebase 
        x["$key"] = element.key;
        this.productList.push(x as Product); // guardo en el array productList
      });
    });
  }

  onEdit(product: Product)
  {
    this.productService.selectedProduct = Object.assign({}, product);
  }

  onDelete($key: string)
  {
    this.productService.deleteProduct($key);
    this.toastr.success('Operación exitosa', 'Producto eliminado!');
  }

}
