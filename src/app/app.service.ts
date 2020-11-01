import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Source } from './app.model';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  constructor(
    private http: HttpClient
  ) {
  }

  public getData(source: Source): Observable<any> {
    if (source.type === 'xml') {
      return this.http.get(source.url, {responseType: 'text'});
    }
    return this.http.get(source.url);
  }
}
