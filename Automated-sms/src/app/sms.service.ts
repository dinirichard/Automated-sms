import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { take, tap } from 'rxjs/operators';
import { Contact } from './shared/models/contact';
import { User } from './shared/models/user';

@Injectable({
  providedIn: 'root',
})
export class SmsService {
  api = '/api';
  contacts: Contact[];
  constructor(private http: HttpClient) {}

  getUser(): Observable<User> {
    return this.http.get<User>(`${this.api}/users`);
  }

  saveUser(user: User): Observable<any> {
    return this.http.post<User>(`${this.api}/user`, user);
  }

  getContacts() {
    console.log('Clicked');
    const email = localStorage.getItem('email');
    console.log('Clicked', email);
    return this.http.post<Contact[]>(`${this.api}/contacts-get`, email).pipe(
      tap((res) => {
        this.contacts = res;
        console.log('Contacts: ', this.contacts);
        return this.contacts;
      })
    );
  }
}
