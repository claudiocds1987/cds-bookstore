import { Component, OnInit } from '@angular/core';
// services
import { BookService } from '../../../core/services/book/book.service';
import { ToastrService } from 'ngx-toastr';
// class Book
import { Book } from 'src/app/core/models/book';

@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.scss']
})
export class BooksComponent implements OnInit {

  books = [];
  editingBook: Book;
  editing: boolean = false;

  constructor(
    public bookService: BookService,
    private toastr: ToastrService
    ) { }

  ngOnInit () {
    // al iniciar obtengo la lista de todos los libros
    this.bookService.getBooks()
    .subscribe(books => {
      // console.log(books);
      this.books = books;
    });
  }

  deleteBook(event, book) {
    if (confirm('¿Esta seguro/a que desea borrar el producto?')){
      this.bookService.deleteBook(book);
      this.toastr.success('Operación exitosa', 'Producto eliminado!');
    }
  }

  editBook(event, book) {
    this.editingBook = book;
    this.editing = !this.editing;
  }

  updateBook() {
    console.log(this.editingBook);
    if (confirm('¿Esta seguro/a que desea actualizar el producto?')){
      // actualiza el producto
      this.bookService.updateBook(this.editingBook);
      // limpio formulario de edición
      this.editingBook = {} as Book;
      // hago desaparecer el formulario de edición
      this.editing = false;
      this.toastr.success('Operación exitosa', 'Producto actualizado!');
    }
  }

}
