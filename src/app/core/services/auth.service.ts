import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private af: AngularFireAuth
  ) { }

  createUser(email: string, password: string) {
    // devuelve una promesa, donde la voy a manejar desde el formulario.ts
    return this.af.createUserWithEmailAndPassword(email, password);
  }

  login(email: string, password: string) {
    // devuelve una promesa, donde la voy a manejar desde el formulario.ts
    return this.af.signInWithEmailAndPassword(email, password);
  }

  logOut() {
    // devuelve una promesa, donde la voy a manejar desde el nav.ts de admin
    return this.af.signOut();
  }

  // esta funcion checkea que xista el usuario se utiliza en admin.guard.ts
  hasUser() {
    // devuelve un Observable
    return this.af.authState;
  }

}
