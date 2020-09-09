import { Component, OnInit } from '@angular/core';
// services
import { BookService } from '../../../core/services/book/book.service';
import { ToastrService } from 'ngx-toastr';
// clase Book
import { Book } from 'src/app/core/models/book';
// formuluario
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';

import { MyValidators } from '../../../utils/myValidators';
import { ConvertActionBindingResult } from '@angular/compiler/src/compiler_util/expression_converter';


@Component({
  selector: 'app-book-form',
  templateUrl: './book-form.component.html',
  styleUrls: ['./book-form.component.scss']
})
export class BookFormComponent implements OnInit {

  cad: string;
  form: FormGroup;
  book = {} as Book; // declaro un objeto Book vacio, no es un array
  // obteniendo año actual
  today = new Date();
  year = this.today.getFullYear();

  constructor(
    public bookService: BookService,
    private toastr: ToastrService,
    private formBuilder: FormBuilder
    ) {
      // function buildForm
      this.buildForm();
    }

  ngOnInit(): void {
  }

  buildForm() {
    // const numericNumberReg = '^-?[0-9]\\d*(\\.\\d{1,2})?$';
    this.form = this.formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(50)]],
      year: ['', [Validators.required, Validators.max(this.year)]],
      author: ['', [Validators.required]],
      category: ['', [Validators.required]],
      editorial: ['', [Validators.required]],
      description: ['', [Validators.required, Validators.maxLength(300)]],
      quantity: ['', [Validators.required]],
      price: [0, [Validators.required]],
      image: [''],
      state: [true]
    });
  }

  addBook(event: Event) {
    event.preventDefault();
    if (this.form.valid){
      if (confirm('¿Esta seguro/a que desea agregar el producto?')){
        // obtengo los valores del formulario
        this.book = this.form.value;
        // inserta el producto en la db firestore
        this.bookService.addBook(this.book);
        // para limpiar el formulario
        this.book = {} as Book;
        this.toastr.success('Operación exitosa', 'Producto agregado!');
      }
    }
  }

}
