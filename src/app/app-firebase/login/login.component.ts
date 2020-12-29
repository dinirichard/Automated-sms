import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SocialAuthService, SocialUser } from 'angularx-social-login';
import { ToastrService } from 'ngx-toastr';
import { EMPTY } from 'rxjs';
import { take, catchError } from 'rxjs/operators';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  constructor(
    private readonly auth: AuthService,
    private readonly router: Router,
    private toastr: ToastrService,
    private authService: SocialAuthService
  ) {}

  loggedIn: boolean;
  user: SocialUser;

  ngOnInit(): void {
    this.authService.authState.subscribe((user) => {
      console.log(user);
      this.user = user;
      this.loggedIn = user != null;
    });
  }

  login() {
    this.auth.loginViaGoogle().subscribe((res) => console.log(res));
  }
}
