import { Component, OnInit } from '@angular/core';
// services
import { BookService } from '../../../core/services/book/book.service';
import { AuthorService } from '../../../core/services/author/author.service';
import { CategoryService } from '../../../core/services/category/category.service';
import { EditorialService } from '../../../core/services/editorial/editorial.service';
import { ToastrService } from 'ngx-toastr';
// clase Book, Author, category, editorial
import { Book } from 'src/app/core/models/book';
import { Author} from 'src/app/core/models/author';
import { Category } from 'src/app/core/models/category';
import { Editorial } from 'src/app/core/models/editorial';
// formuluario
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { Observable } from 'rxjs';
// Angular firestorage para guardar la imagen
import { AngularFireStorage } from '@angular/fire/storage';
// finalize es un pipe que hace el proceso de finalizacion al subir la imagen
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-book-form',
  templateUrl: './book-form.component.html',
  styleUrls: ['./book-form.component.scss']
})
export class BookFormComponent implements OnInit {

  // cad: string;
  form: FormGroup;
  // array de tipo Autor en vacio
  // authorList: Author[] = [];
  authorList$: Observable<Author[]>;
  categoryList$: Observable<Category[]>;
  editorialList$: Observable<Category[]>;
  image$: Observable<any>;
  book = {} as Book; // declaro un objeto Book vacio, no es un array
  // obteniendo año actual
  today = new Date();
  year = this.today.getFullYear();

  url = 'http://placehold.it/180';

  selectedFile = null;

  constructor(
    public bookService: BookService,
    public authorService: AuthorService,
    public categoryService: CategoryService,
    public editorialService: EditorialService,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private storage: AngularFireStorage
    ) {
      this.buildForm(); // function buildForm
    }

  ngOnInit(): void {
    this.authorList$ = this.authorService.getAuthors();
    this.categoryList$ = this.categoryService.getCategories();
    this.editorialList$ = this.editorialService.getEditorials();
    // this.authorService.getAuthors()
    // .subscribe(author => {
    //   // console.log(books);
    //   this.authorList = author;
    // });
  }

  buildForm() {
    this.form = this.formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(50)]],
      year: ['', [Validators.required, Validators.max(this.year)]],
      author: ['', [Validators.required]],
      category: ['', [Validators.required]],
      editorial: ['', [Validators.required]],
      description: ['', [Validators.required, Validators.maxLength(500)]],
      quantity: ['', [Validators.required]],
      price: [0, [Validators.required]],
      image: [''],
      state: [true]
    });
  }

  addBook(event: Event) {

    event.preventDefault();
    if (this.form.valid)
    {
      if (confirm('¿Esta seguro/a que desea agregar el producto?'))
      {
        // obtengo todos los valores del formulario
        this.book = this.form.value;
        // asignando la url de la img guardada en firebase storage
        this.book.image = this.selectedFile;
        console.log(this.book.image);
        // agrego libro a cloud firestore
        this.bookService.addBook(this.book);
        // para limpiar el formulario
        this.form.reset();
        // this.book = {} as Book;
        this.toastr.success('Operación exitosa', 'Producto agregado!');
      }
    }
  }

  uploadImage(event){
    // si se eligió la imagen
    if (event.target.files.length !== 0 || event.target.files[0] != null )
     {
      // obtengo el archivo completo de la img (nombre, tipo, tamaño, etc..)
      const file = event.target.files[0];
      // obtengo solo el nombre de la imagen
      const name = file.name;
      const fileRef = this.storage.ref(name);
      // subo imagen a firestorage con el nombre y todas sus prop(tipo, tamaño, etc..)
      const task = this.storage.upload(name, file);
      task.snapshotChanges()
      .pipe(
        finalize(() => {
          this.image$ = fileRef.getDownloadURL();
          this.image$.subscribe(url => {
            this.selectedFile = url;
        });
      })
    )
    .subscribe();
    }
  }


  cleanUnnecessaryWhiteSpaces(cadena: string){
    const cleanString = cadena.replace(/\s{2,}/g, ' ').trim();
    return cleanString;
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



