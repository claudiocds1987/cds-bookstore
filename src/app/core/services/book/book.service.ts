import { Injectable } from '@angular/core';
// firestore
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
// class Book
import { Book } from '../../models/book';
// Observable devuelve los datos sin necesidad de refrescar la pagina
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class BookService {

  booksColection: AngularFirestoreCollection<Book>;
  books$: Observable<any[]>;
  bookDoc: AngularFirestoreDocument<Book>;

  constructor(public db: AngularFirestore) {
    /* esta consulta trae todos los libros pero sin el id de cada libro
    this.books = this.db.collection('books').valueChanges();*/

    // esta consulta trae todos los libros con su id
    this.booksColection = this.db.collection('books');
    // snapshotChanges() trae la actualizacion de los datos de la db cuando cambian
    this.books$ = this.booksColection.snapshotChanges()
    // actions son los datos de la db (angular los llama de esa forma "actions")
    .pipe(map(actions => {
      return actions.map(a => {
        const data = a.payload.doc.data() as Book;
        data.id = a.payload.doc.id; // obteniendo el id
        return data; // return de todas las propiedades del objeto book y el id
      });
    }));
  }

  getBooks() {
    // return this.http.get<Book[]>(`${environment.firebase}/books/`);
    return this.books$;
  }

  addBook(book: Book) {
    book.state = true;
    this.booksColection.add(book)
    .then(res => {
      console.log(res);
  });

  }

  deleteBook(book: Book) {
    this.bookDoc = this.db.doc(`books/${book.id}`); // las comillas son alt + 96
    this.bookDoc.delete();
  }

  updateBook(book: Book) {
    this.bookDoc = this.db.doc(`books/${book.id}`); // las comillas son alt + 96
    this.bookDoc.update(book);
  }

}
