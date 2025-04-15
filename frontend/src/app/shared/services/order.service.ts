import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DefaultResponseType } from '../../../types/default-response.type';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private http: HttpClient) { }

  createOrder(name: string, phone: string, service: string, type: string): Observable<DefaultResponseType> {
    return this.http.post<DefaultResponseType>(environment.api + "requests", {
      name, phone, service, type
    })
  }
  createConsultation(name: string, phone: string, type: string): Observable<DefaultResponseType> {
    return this.http.post<DefaultResponseType>(environment.api + "requests", {
      name, phone, type
    })
  }
}
