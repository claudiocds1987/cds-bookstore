import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
// services
import { AuthService } from './core/services/auth.service';

import { map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(
    private authService: AuthService
  ) {

  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.authService.hasUser().pipe(
      // tap hace una intercepcion de los datos sin detener el flujo (no puede modificarlos ni nada).
      // lo utilizo para que por consola muestre si el dato es null o no.
      tap(user => console.log(user)),
      // si no hay usuario devolve false sino true
      map(user => user === null ? false : true)
    );
  }

}
