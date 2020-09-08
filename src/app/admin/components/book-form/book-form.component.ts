import { Component, OnInit } from '@angular/core';
// services
import { BookService } from '../../../core/services/book/book.service';
import { ToastrService } from 'ngx-toastr';
// clase Book
import { Book } from 'src/app/core/models/book';

@Component({
  selector: 'app-book-form',
  templateUrl: './book-form.component.html',
  styleUrls: ['./book-form.component.scss']
})
export class BookFormComponent implements OnInit {

  book = {} as Book; // declaro un objeto Book vacio, no es un array

  constructor(
    public bookService: BookService,
    private toastr: ToastrService
    ) { }

  ngOnInit(): void {
  }

  addBook() {
    if (confirm('¿Esta seguro/a que desea agregar el producto?')){
      // inserta el producto
      this.bookService.addBook(this.book);
      // para limpiar el frmulario
      this.book = {} as Book;
      this.toastr.success('Operación exitosa', 'Producto agregado!');
    }
  }
}
