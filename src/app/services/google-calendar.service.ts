import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GoogleCalendarService {
  private calendarUrl = 'https://us-central1-SEU_PROJETO.cloudfunctions.net/createCalendarEvent';

  constructor(private http: HttpClient) {}

  createEvent(event: any): Observable<any> {
    return this.http.post(this.calendarUrl, event);
  }
}
