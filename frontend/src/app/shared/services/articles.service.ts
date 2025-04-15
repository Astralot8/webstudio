import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ArticleType } from '../../../types/article.type';
import { environment } from '../../../environments/environment';
import { ArticlesType } from '../../../types/articles.type';
import { ActiveParamsType } from '../../../types/active-params.type';

@Injectable({
  providedIn: 'root'
})
export class ArticlesService {

  constructor(private http: HttpClient) { }

  getTopArticles(): Observable<ArticleType[]>{
    return this.http.get<ArticleType[]>(environment.api + 'articles/top')
  }
  getArticles(params: ActiveParamsType): Observable<ArticlesType>{
    return this.http.get<ArticlesType>(environment.api + 'articles/', {
      params: params
    })
  }
  getArticle(url: string): Observable<ArticleType>{
    return this.http.get<ArticleType>(environment.api + 'articles/' + url)
  }
  getArticleRelated(url: string): Observable<ArticleType[]>{
    return this.http.get<ArticleType[]>(environment.api + 'articles/related/' + url)
  }
  
}
