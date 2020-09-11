import { Component, OnInit } from '@angular/core';
// services
import { BookService } from '../../../core/services/book/book.service';
import { AuthorService } from '../../../core/services/author/author.service';
import { ToastrService } from 'ngx-toastr';
// clase Book, Author
import { Book } from 'src/app/core/models/book';
import { Author} from 'src/app/core/models/author';
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

  cad: string;
  form: FormGroup;
  // array de tipo Autor en vacio
  authorList: Author[] = [];
  authorList$: Observable<Author[]>;
  image$: Observable<any>;
  book = {} as Book; // declaro un objeto Book vacio, no es un array
  // obteniendo año actual
  today = new Date();
  year = this.today.getFullYear();

 selectedFile = null;

  constructor(
    public bookService: BookService,
    public authorService: AuthorService,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private storage: AngularFireStorage
    ) {
      // function buildForm
      this.buildForm();
    }

  ngOnInit(): void {
    this.authorList$ = this.authorService.getAuthors();
    // this.authorService.getAuthors()
    // .subscribe(author => {
    //   // console.log(books);
    //   this.authorList = author;
    // });
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
    this.book = this.form.value;
    console.log(this.book);
    if (this.form.valid){
      if (confirm('¿Esta seguro/a que desea agregar el producto?')){
        // obtengo los valores del formulario
        this.book = this.form.value;
        // inserta el producto en la db firestore
        this.bookService.addBook(this.book);

        // guardo la imagen en firestorage
        this.onUploadFile();

        // para limpiar el formulario
        this.form.reset();
        this.book = {} as Book;
        this.toastr.success('Operación exitosa', 'Producto agregado!');
        // this.form.controls['btn-submmit'].enable();
      }
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

// esta va en input file
  onFileSelected(event) {
    // obtengo el archivo completo de la img (nombre, tipo, tamaño, etc..)
    this.selectedFile = event.target.files[0];
    console.log(this.selectedFile);

  }

  onUploadFile() {
    // obtengo solo el nombre de la imagen
    const name = this.selectedFile.name;
    const fileRef = this.storage.ref(name);
    // subo imagen a firestorage con el nombre y todas sus prop(tipo, tamaño, etc..)
    const task = this.storage.upload(name, this.selectedFile);

    // task.snapshotChanges()
    // .pipe(
    //   // finalize notifica cuando termina de subir la imagen
    //   finalize(() => {
    //     this.image$ = fileRef.getDownloadURL();
    //     this.image$.subscribe(url => {
    //       console.log(url);
    //       // le paso la url de la img guardada firestorage, para mostar la img en el input image
    //       this.form.get('image').setValue(url);
    //     });
    //   })
    // )
    // .subscribe();
  }


  // uploadFile(event) {
  //   // obtengo el archivo completo de la img (nombre, tipo, tamaño, etc..)
  //   const file = event.target.files[0];
  //   // obtengo solo el nombre de la imagen
  //   const name = file.name;
  //   const fileRef = this.storage.ref(name);
  //   // subo imagen a firestorage con el nombre y todas sus prop(tipo, tamaño, etc..)
  //   const task = this.storage.upload(name, file);

  //   task.snapshotChanges()
  //   .pipe(
  //     // finalize notifica cuando termina de subir la imagen
  //     finalize(() => {
  //       this.image$ = fileRef.getDownloadURL();
  //       this.image$.subscribe(url => {
  //         console.log(url);
  //         // le paso la url al image de mi form.group
  //         this.form.get('image').setValue(url);
  //       });
  //     })
  //   )
  //   .subscribe();
  // }

}
