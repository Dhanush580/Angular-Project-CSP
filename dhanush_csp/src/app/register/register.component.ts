import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  username: string = '';
  email: string = '';
  password: string = '';
  message: string = '';
  messageClass: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  register() {
    this.http.post<any>('http://localhost:8080/user/registration', {
      username: this.username,
      email: this.email,
      password: this.password
    }).subscribe(
      response => {
        this.message = response.message;
        this.messageClass = 'success';
        this.username = '';
        this.email = '';
        this.password = '';
        setTimeout(() => {
          this.router.navigate(['/businesses']);
        }, 2000);
      },
      error => {
        console.error('Registration error:', error);
        if (error.status === 400 && error.error.message === 'Username already taken') {
          this.message = 'Username already taken. Please choose a different username.';
        } else {
          this.message = 'Registration error';
        }
        this.messageClass = 'error';
      }
    );
  }
}
