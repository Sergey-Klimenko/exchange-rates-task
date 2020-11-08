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
    let responseType = null;
    if (source.type === 'xml') {
      responseType = 'text';
      return this.http.get(source.url, {responseType});
    }
    return this.http.get(source.url);
  }

}
