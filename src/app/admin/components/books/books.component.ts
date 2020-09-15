import { Component, OnInit, Input } from '@angular/core';
// services
import { BookService } from '../../../core/services/book/book.service';
import { ToastrService } from 'ngx-toastr';
// class Book
import { Book } from 'src/app/core/models/book';

import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

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
    private toastr: ToastrService,
    private sanitizer: DomSanitizer
    ) { }

  ngOnInit () {
    this.fetchBooks();
    // al iniciar obtengo la lista de todos los libros
    // this.bookService.getBooks()
    // .subscribe(books => {
    //   // console.log(books);
    //   //agrego todos los libros al array books
    //   this.books = books;
    //   console.log(this.books);
    // });
  }

  // Angular por consola tira WARNING: sanitizing unsafe URL etc..
  // No es obligatorio, por las dudas desinfecto la URL para que sea seguro mostrarla en la interfaz de usuario
  sanitizeImageUrl(imageUrl: string): SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl(imageUrl);
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

  fetchBooks(){
    this.bookService.getBooks().subscribe(books => {
      this.books = books;
    });
  }

}
