import { Injectable } from '@angular/core';
import { BehaviorSubject, from, Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import {
  GoogleLoginProvider,
  SocialAuthService,
  SocialUser,
} from 'angularx-social-login';
import { ToastrService } from 'ngx-toastr';
import { SmsService } from '../sms.service';
import { User } from '../shared/models/user';
import { Contact } from '../shared/models/contact';
// import {from} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user: SocialUser;
  contacts: Contact[];

  constructor(
    private authService: SocialAuthService,
    private toastr: ToastrService,
    private smsService: SmsService
  ) {}

  async loginViaGoogle(): Promise<SocialUser> {
    await this.authService
      .signIn(GoogleLoginProvider.PROVIDER_ID)
      .then((user: SocialUser) => {
        this.user = user;
        this.toastr.success(`Welcome ${user.firstName}`, 'Login Successful');
        const newUser: User = {
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          name: user.name,
          photoUrl: user.photoUrl,
        };
        this.smsService.saveUser(newUser).subscribe((res) => {
          console.log('User Res', res);
          localStorage.setItem('email', res.email);
          localStorage.setItem('userId', res.id);
          localStorage.setItem('names', res.name);
          localStorage.setItem('setupComplete', res.setupComplete);
          this.smsService.contacts = res.contacts;
          console.log('Contacts: ', this.smsService.contacts);
        });
      })
      .catch((error) => {
        this.toastr.error(error.message, 'Error Message', {
          closeButton: true,
        });
        console.log('error');
      });

    return this.user;
  }

  signOut(): void {
    this.authService.signOut();
  }

  refreshToken(): void {
    this.authService.refreshAuthToken(GoogleLoginProvider.PROVIDER_ID);
  }

  getAuthState() {
    this.authService.authState.subscribe((user) => {
      this.user = user;
      console.log(user);
      // this.loggedIn = (user != null);
    });
  }
}
