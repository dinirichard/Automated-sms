import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from './shared/models/user';

@Injectable({
  providedIn: 'root',
})
export class SmsService {
  api = '/api';
  constructor(private http: HttpClient) {}

  getUser(): Observable<User> {
    return this.http.get<User>(`${this.api}/users`);
  }

  saveUser(user: User): Observable<any> {
    return this.http.post<User>(`${this.api}/user`, user);
  }

  getAttendance(course_id: string) {
    const daf = new HttpParams().set('course', course_id);
    return this.http.get<User[]>(this.api + '/lecturer/attendance', {
      params: daf,
    });
  }
}
