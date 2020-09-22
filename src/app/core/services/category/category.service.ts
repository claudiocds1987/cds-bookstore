import { Injectable } from '@angular/core';
// firestore
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
// class Category
import { Category } from '../../models/category';
// Observable devuelve los datos sin necesidad de refrescar la pagina
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  categoriesCollection: AngularFirestoreCollection<Category>;
  categories$: Observable<any[]>;
  categoryDoc: AngularFirestoreDocument<Category>;

  constructor(public db: AngularFirestore ) {
    // Obteniendo todas las categorias con su id
    this.categoriesCollection = this.db.collection('categories');
    // snapshotChanges() trae la actualizacion de los datos de la db cuando cambian
    this.categories$ = this.categoriesCollection.snapshotChanges()
    // actions son los datos de la db (angular los llama de esa forma "actions")
    .pipe(map(actions => {
      return actions.map(a => {
        const data = a.payload.doc.data() as Category;
        data.idCategory = a.payload.doc.id; // obteniendo el id
        return data; // return de todas las propiedades del objeto category y el id
      });
    }));
  }

  getCategories(){
    return this.categories$;
  }






}
