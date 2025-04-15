import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActiveParamsCommentType } from '../../../types/active-params-comment.type';
import { Observable } from 'rxjs';
import { CommentsResponseType } from '../../../types/comments-response.type';
import { environment } from '../../../environments/environment';
import { DefaultResponseType } from '../../../types/default-response.type';
import { CommentsActionUserType } from '../../../types/comments-action-user.type';

@Injectable({
  providedIn: 'root'
})
export class CommentsService {

  constructor(private http: HttpClient) { }

  getComments(params: ActiveParamsCommentType): Observable<CommentsResponseType> {
    return this.http.get<CommentsResponseType>(environment.api + 'comments', {
      params: params
    });
  }

  addComment(text: string, article: string): Observable<DefaultResponseType> {
    return this.http.post<DefaultResponseType>(environment.api + 'comments', {
      text: text, article: article
    });
  }

  applyAction(action: string, commentId: string): Observable<DefaultResponseType> {
    return this.http.post<DefaultResponseType>(environment.api + 'comments/' + commentId + '/apply-action', {
      action: action
    })
  }

  getArticleCommentActions(articleId: string): Observable<CommentsActionUserType[]> {
    return this.http.get<CommentsActionUserType[]>(environment.api + 'comments/article-comment-actions?articleId=' + articleId);
  }
}
