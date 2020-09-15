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

  // cad: string;
  form: FormGroup;
  // array de tipo Autor en vacio
  // authorList: Author[] = [];
  authorList$: Observable<Author[]>;
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
    ////// ?????//////////////////////////////////////
    this.book = this.form.value;
    this.book.image = this.selectedFile;
    console.log(this.book.image);
    this.bookService.addBook(this.book);
    // para limpiar el formulario
    this.form.reset();
    // this.book = {} as Book;
    this.toastr.success('Operación exitosa', 'Producto agregado!');

    //////// ????////////////////////////////

    // if (this.form.valid)
    // {
    //   if (confirm('¿Esta seguro/a que desea agregar el producto?'))
    //   {
    //     // 1ro guardo la imagen en firestorage
    //     this.onUploadFile();
    //     // obtengo los valores del formulario
    //     this.book = this.form.value;
    //     // inserta el producto en la db firestore
    //     this.bookService.addBook(this.book);
    //     // para limpiar el formulario
    //     this.form.reset();
    //     this.book = {} as Book;
    //     // seteo la img <img> lado html
    //     // this.url = 'http://placehold.it/180';
    //     this.toastr.success('Operación exitosa', 'Producto agregado!');
    //   }
    // }
  }

  subirImagen(event){
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
          // this.book.image = this.selectedFile;
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
  //     finalize(() => {
  //       this.image$ = fileRef.getDownloadURL();
  //       this.image$.subscribe(url => {
  //         console.log('ruta de firestorge: ' + url);
  //         this.form.get('image').setValue(url);
  //       });
  //     })
  //   )
  //   .subscribe();
  // }


// esta va en input file lado html
  onFileSelected(event) {
    // obtengo el archivo completo de la img (nombre, tipo, tamaño, etc..)
    this.selectedFile = event.target.files[0];
    // console.log('Archivo seleccionado: ' + this.selectedFile.name);

    // para mostrar la imagen seleccionada en etiqueta <img> lado html
    // if (event.target.files && event.target.files[0]) {
    //   const reader = new FileReader();
    //   reader.onload = (event: any) => {
    //    this.url = event.target.result;
    //   };

    //   reader.readAsDataURL(event.target.files[0]);
    // }
    if (event.target.files.length === 0 || event.target.files[0] == null ) {
      // cuando este vacío
      }else {
      const reader = new FileReader();
      reader.onload = (event: any) => {
        this.url = event.target.result;
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  }

  onUploadFile() {

    let path = '';

    // obtengo solo el nombre de la imagen
    const name = this.selectedFile.name;
    const fileRef = this.storage.ref(name);
    // subo imagen a firestorage con el nombre y todas sus prop(tipo, tamaño, etc..)
    const task = this.storage.upload(name, this.selectedFile);

    task.snapshotChanges()
    .pipe(
      // finalize notifica cuando termina de subir la imagen
      finalize(() => {
        this.image$ = fileRef.getDownloadURL();
        this.form.get('image').setValue(this.image$);
        this.image$.subscribe(url => {
          path = url;
          console.log('path de firestorage: ' + url);
          // le asigno la url de la img guardada en firestorage
          // para que cuando traiga todos los libros de la db muestre la img de cada libro
          this.form.get('image').setValue(url);
          this.book.image = path;
        });
      })
    )
    .subscribe();
  }

}
