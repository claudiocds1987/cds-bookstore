import { Component, OnInit, Input } from '@angular/core';
// services
import { BookService } from '../../../core/services/book/book.service';
import { AuthorService } from '../../../core/services/author/author.service';
import { CategoryService } from '../../../core/services/category/category.service';
import { EditorialService } from '../../../core/services/editorial/editorial.service';
import { ToastrService } from 'ngx-toastr';
// class
import { Book } from 'src/app/core/models/book';
import { Author } from 'src/app/core/models/author';
import { Category } from 'src/app/core/models/category';
import { Editorial} from 'src/app/core/models/editorial';

// formuluario
import { FormBuilder, FormGroup, Validators} from '@angular/forms';

import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.scss']
})
export class BooksComponent implements OnInit {

  totalBooks;
  form: FormGroup;
  books = [];
  editingBook: Book;
  editing: boolean = false;
  authorList$: Observable<Author[]>;
  categoryList$: Observable<Category[]>;
  editorialList$: Observable<Editorial[]>;
  // image$: Observable<any>;
  // obteniendo año actual
  today = new Date();
  year = this.today.getFullYear();

  constructor(
    public bookService: BookService,
    private toastr: ToastrService,
    private sanitizer: DomSanitizer,
    private authorService: AuthorService,
    private categoryService: CategoryService,
    private editorialService: EditorialService,
    private formBuilder: FormBuilder,
    ) { }

  ngOnInit () {
    this.fetchBooks();
    this.authorList$ = this.authorService.getAuthors();
    this.categoryList$ = this.categoryService.getCategories();
    this.editorialList$ = this.editorialService.getEditorials();
  }

  buildForm() {
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
      // total de libros extraidos de la db
      this.totalBooks = this.books.length;
    });
  }

  // Esta funcion se llama desde el <select> de autores
  changeSuit(e) {
    // obtengo el control select y le paso el valor seleccionado en el html
    this.form.get('author').setValue(e.target.value, {
       onlySelf: true
    });
  }

  selectCategory(e) {
    // obtengo el control select y le paso el valor seleccionado en el html
    this.form.get('category').setValue(e.target.value, {
       onlySelf: true
    });
  }

  selectEditorial(e) {
    // obtengo el control select y le paso el valor seleccionado en el html
    this.form.get('editorial').setValue(e.target.value, {
       onlySelf: true
    });
  }

}
