import { Injectable } from '@angular/core';
// firestore
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
// class editorial
import { Editorial } from '../../models/editorial';
// Observable devuelve los datos sin necesidad de refrescar la pagina
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class EditorialService {

  editorialsCollection: AngularFirestoreCollection<Editorial>;
  editorials$: Observable<any[]>;
  editorialDoc: AngularFirestoreDocument<Editorial>;


  constructor(public db: AngularFirestore) { 
    // Obteniendo todas las editoriales con su id
    this.editorialsCollection = this.db.collection('editorials');
    // snapshotChanges() trae la actualizacion de los datos de la db cuando cambian
    this.editorials$ = this.editorialsCollection.snapshotChanges()
    // actions son los datos de la db (angular los llama de esa forma "actions")
    .pipe(map(actions => {
      return actions.map(a => {
        const data = a.payload.doc.data() as Editorial;
        data.idEditorial = a.payload.doc.id; // obteniendo el id
        return data; // return de todas las propiedades del objeto editorial y el id
      });
    }));
  }

  getEditorials(){
    return this.editorials$;
  }
}
