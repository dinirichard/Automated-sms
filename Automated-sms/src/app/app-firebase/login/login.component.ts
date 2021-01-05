import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SocialAuthService, SocialUser } from 'angularx-social-login';
import { ToastrService } from 'ngx-toastr';
import { EMPTY } from 'rxjs';
import { take, catchError } from 'rxjs/operators';
import { SmsService } from 'src/app/sms.service';
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
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private authService: SocialAuthService,
    private smsService: SmsService
  ) {}

  loggedIn: boolean;
  user: SocialUser;

  ngOnInit(): void {
    this.authService.authState.subscribe((user) => {
      this.user = user;
      this.loggedIn = true;
    });
  }

  async login() {
    await this.auth
      .loginViaGoogle()
      .then((res) => {
        this.router.navigate(['setup'], { relativeTo: this.route });
      })
      .catch((err) => console.log(err));
    // this.smsService.getAttendance('param1').subscribe((res) => {
    //   console.log(res, 'res');
    // });
  }
}
