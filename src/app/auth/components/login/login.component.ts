import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// para redirigir a una pagina
import { Router } from '@angular/router';
import { AuthService } from './../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  form: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.buildForm();
  }

  ngOnInit() {
  }

  // login con firebase
  // login(event: Event) {
  //   event.preventDefault();
  //   if (this.form.valid) {
  //     const value = this.form.value;
  //     this.authService.login(value.email, value.password)
  //     .then(() => {
  //       this.router.navigate(['/admin']);
  //     })
  //     .catch(() => {
  //       alert('no es valido');
  //     });
  //   }
  // }

  // login con appi
  // loginApi() {
  //   this.authService.loginRestApi('claudio@cla.com', '123456')
  //   .subscribe(data => {
  //     console.log(data);
  //   });
  // }

  login(event: Event) {
    event.preventDefault();
    if (this.form.valid){
      // obtengo los valores del form
      const value = this.form.value;
      // consulto si el mail y password existen
      this.authService.login(value.email, value.password)
      // si es correcto
      .then(() => {
        // redirijo a la pagina admin
        this.router.navigate(['/admin']);
      })
      .catch(() => {
        alert('el email o password no es valido!')
      });
    }
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

}
