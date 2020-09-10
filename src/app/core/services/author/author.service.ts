import { Injectable } from '@angular/core';
// firestore
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
// class Author
import { Author } from '../../models/author';
// Observable devuelve los datos sin necesidad de refrescar la pagina
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthorService {

  authorCollection: AngularFirestoreCollection;
  authors$: Observable<any[]>;

  constructor(public db: AngularFirestore) {
    // esta consulta trae todos los autores con su id
    this.authorCollection = this.db.collection('authors');
    // snapshotChanges() trae la actualizacion de los datos de la db cuando cambian
    this.authors$ = this.authorCollection.snapshotChanges()
    // actions son los datos de la db (angular los llama de esa forma "actions")
    .pipe(map(actions => {
      return actions.map(a => {
        const data = a.payload.doc.data() as Author;
        data.id = a.payload.doc.id; // obteniendo el id
        return data; // return de todas las propiedades del objeto book y el id
      });
    }));
  }

  getAuthors(){
    return this.authors$;
  }


}
