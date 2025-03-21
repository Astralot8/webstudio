import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CategoryResponseType } from '../../../types/category-response.type';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private http: HttpClient) { }

  getCategories(): Observable<CategoryResponseType[]>{
    return this.http.get<CategoryResponseType[]>(environment.api + "categories");
  }
}
