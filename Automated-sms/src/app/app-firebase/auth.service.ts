import { Injectable } from '@angular/core';
import { BehaviorSubject, from, Observable, of } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import { switchMap } from 'rxjs/operators';
import {
  GoogleLoginProvider,
  SocialAuthService,
  SocialUser,
} from 'angularx-social-login';
import { ToastrService } from 'ngx-toastr';
import { SmsService } from '../sms.service';
import { User } from '../shared/models/user';
// import {from} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // private user: BehaviorSubject<
  //   Observable<firebase.default.User>
  // > = new BehaviorSubject<Observable<firebase.default.User>>(null);
  // user$ = this.user
  //   .asObservable()
  //   .pipe(switchMap((user: Observable<firebase.default.User>) => user));
  user: SocialUser;

  constructor(
    private afAuth: AngularFireAuth,
    private authService: SocialAuthService,
    private toastr: ToastrService,
    private smsService: SmsService
  ) {
    // this.user.next(this.afAuth.authState);
  }

  loginViaGoogle(): void {
    this.authService
      .signIn(GoogleLoginProvider.PROVIDER_ID)
      .then((user: SocialUser) => {
        this.user = user;
        console.log(user, 'User details');
        this.toastr.success(`Welcome ${user.firstName}`, 'Login Successful');
        const newUser: User = {
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          name: user.name,
          photoUrl: user.photoUrl,
        };
        this.smsService.saveUser(newUser).subscribe((res) => {
          console.log(res, 'res');
        });
      })
      .catch((error) => {
        this.toastr.error(error.message, 'Error Message', {
          closeButton: true,
        });
        console.log('error');
      });

    // return of(this.user);
  }

  // signOut(): void {
  //   this.authService.signOut();
  // }

  // refreshToken(): void {
  //   this.authService.refreshAuthToken(GoogleLoginProvider.PROVIDER_ID);
  // }

  getAuthState() {
    this.authService.authState.subscribe((user) => {
      this.user = user;
      console.log(user);
      // this.loggedIn = (user != null);
    });
  }

  // loginViaGoogle(): Observable<firebase.default.auth.UserCredential> {
  //   return from(
  //     this.afAuth.signInWithPopup(
  //       new firebase.default.auth.GoogleAuthProvider()
  //     )
  //   );
  // }

  logout(): Observable<void> {
    return from(this.afAuth.signOut());
  }
}
