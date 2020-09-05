import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
// services
import { ToastrService } from 'ngx-toastr';
import { ProductService } from '../../../../core/services/product.service';
// Product class
import { Product } from 'src/app/core/models/product';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {

  constructor(
    public productService: ProductService,
    private toastr: ToastrService
    ) { }

  ngOnInit(): void {
    this.productService.getProducts();
    this.resetForm();
  }

  onSubmit(productForm: NgForm)
  {
    // value.$key es el input=hidden name="$key" de product.component.html
    if (productForm.value.$key == null)
    {
      // insert Product
      this.productService.insertProduct(productForm.value);
      this.toastr.success('Operación exitosa', 'Producto guardado!');
      // reseteo el formulario
      this.resetForm(productForm);
    }
    else
    {
      // update Product
      // productForm.value tiene todos los valores completados del formulario
      this.productService.updateProduct(productForm.value);
      this.toastr.success('Operación exitosa', 'Producto actualizado!');
      // reseteo el formulario
      this.resetForm(productForm);
    }
  }

  // productForm? significa que es opcional, puede o no resivir el valor por parametro.
  resetForm(productForm?: NgForm)
  {
    if (productForm != null) {
      productForm.reset();
      this.productService.selectedProduct = new Product();
    }
  }

}
