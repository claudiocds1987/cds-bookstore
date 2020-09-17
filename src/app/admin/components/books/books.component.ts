import { Component, OnInit, Input } from '@angular/core';
// services
import { BookService } from '../../../core/services/book/book.service';
import { AuthorService } from '../../../core/services/author/author.service';
import { ToastrService } from 'ngx-toastr';
// class Book
import { Book } from 'src/app/core/models/book';

import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Observable } from 'rxjs';
import { Author } from 'src/app/core/models/author';

@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.scss']
})
export class BooksComponent implements OnInit {

  books = [];
  editingBook: Book;
  editing: boolean = false;
  authorList$: Observable<Author[]>;

  constructor(
    public bookService: BookService,
    private toastr: ToastrService,
    private sanitizer: DomSanitizer,
    private authorService: AuthorService
    ) { }

  ngOnInit () {
    this.fetchBooks();
    this.authorList$ = this.authorService.getAuthors();
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
