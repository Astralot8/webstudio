import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ArticlesService } from '../../../shared/services/articles.service';
import { ArticleType } from '../../../../types/article.type';
import { AuthService } from '../../../core/auth/auth.service';
import { environment } from '../../../../environments/environment';
import { ActiveParamsCommentType } from '../../../../types/active-params-comment.type';
import { CommentsService } from '../../../shared/services/comments.service';
import { CommentsResponseType } from '../../../../types/comments-response.type';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';
import { DefaultResponseType } from '../../../../types/default-response.type';
import { UserCommentActionType } from '../../../../types/user-comment-action.type';
import { CommentsActionUserType } from '../../../../types/comments-action-user.type';

@Component({
  selector: 'app-article',
  standalone: false,
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss', './adaptive-article.component.scss']
})
export class ArticleComponent implements OnInit {

  article!: ArticleType;
  articlesRelated!: ArticleType[];
  isLogged: boolean = false;
  serverStaticPath = environment.serverStaticPath;
  commentParams: ActiveParamsCommentType = {
    offset: 0,
    article: ''
  };
  allComments: CommentsResponseType = {
    allCount: 0,
    comments: []
  }

  visibleComments: CommentsResponseType = {
    allCount: 0,
    comments: []
  };

  articleCount: number = 0

  comment: string = '';

  limitInitial: number = 3;
  limitToShow: number = 10;

  isLoading: boolean = false;

  allCommentsNumber: number = 0;

  userCommentAction = UserCommentActionType;

  reactions: CommentsActionUserType[] = [];

  constructor(private activatedRoute: ActivatedRoute, private articleService: ArticlesService, private authService: AuthService, private commentsService: CommentsService, private _snackBar: MatSnackBar, private cdr: ChangeDetectorRef) {
    this.isLogged = this.authService.getIsLoggedIn();


  }

  ngOnInit(): void {
    this.loadArticle();
  }

  loadArticle(): void {
    this.activatedRoute.params.subscribe(params => {
      this.articleService.getArticle(params['url']).subscribe(
        (data: ArticleType) => {
          this.article = data;
          this.commentParams.article = this.article.id;
          this.articleCount = 0;
          this.loadComments();
        }
      )
      this.articleService.getArticleRelated(params['url']).subscribe(
        (dataRelated: ArticleType[]) => {
          this.articlesRelated = dataRelated;
        }
      )

    });
  }


  loadComments(): void {
    if (this.isLoading) return;
    this.isLoading = true;

    this.commentsService.getComments(this.commentParams).subscribe(
      {
        next: (comments: CommentsResponseType) => {
          this.allComments.allCount = comments.allCount;
          this.allCommentsNumber = comments.allCount;
          this.allComments.comments = [...this.allComments.comments, ...comments.comments];
          this.updateReactions();

          this.updateVisibleComments();

          this.commentParams.offset += comments.comments.length;
          
          this.isLoading = false
        },
        error: (error) => {
          this._snackBar.open("Произошла ошибка при загрузке комментариев!", error)
          this.isLoading = false
        }
      })
  }

  updateVisibleComments(): void {
    if (this.commentParams.offset === 0) {
      this.visibleComments.allCount = this.allComments.allCount;
      this.visibleComments.comments = this.allComments.comments.slice(0, this.limitInitial);
      this.articleCount = this.limitInitial;
    } else if (this.commentParams.offset === 10) {
      this.visibleComments.allCount = this.allComments.allCount;
      this.visibleComments.comments = this.allComments.comments.slice(0, this.commentParams.offset + this.limitInitial);
      this.articleCount = this.articleCount + this.limitToShow
    } else {
      this.visibleComments.allCount = this.allComments.allCount;
      this.visibleComments.comments = this.allComments.comments.slice(0, this.commentParams.offset + this.limitInitial);
      this.articleCount = this.articleCount + this.limitToShow
    }
  }

  loadMoreComments(): void {
    this.loadComments();
  }

  addComment(): void {
    if (this.comment.length > 0) {
      this.commentParams.offset = 0;
      this.visibleComments.comments = [];
      this.allComments.comments = [];
      this.allComments.allCount = 0;
      this.commentsService.addComment(this.comment, this.article.id).subscribe(
        data => {
          if (!data.error) {
            this._snackBar.open(data.message)
            this.comment = '';
            this.loadComments();
          } else {
            this._snackBar.open(data.message)
          }
        }
      )
    } else {
      this._snackBar.open("Добавьте комментарий!")
    }
  }

  applyActions(action: string, commentId: string) {
    this.commentsService.applyAction(action, commentId).subscribe({
      next: (data: DefaultResponseType) => {
        let error = null;
        if (data.error) {
          error = data.message
        }
        if (error) {
          this._snackBar.open(error);
          throw new Error(error);
        }
        if (action === this.userCommentAction.violate) {
          this._snackBar.open("Жалоба отправлена!");
        }


        if (action === this.userCommentAction.like) {
          this._snackBar.open("Ваш голос учтен!");
          this.commentsService.getArticleCommentActions(this.article.id).subscribe(reactions => {
            if (reactions.length === 0) {
              this.allComments.comments.forEach(comment => {
                if (comment.id === commentId && comment.userReaction === action) {
                  comment.userReaction = '';
                  comment.likesCount--;
                }
              })
            }

            if (reactions.length > 0) {
              this.reactions = reactions;
              this.allComments.comments.forEach(comment => {
                this.reactions.forEach(item => {
                  if (comment.userReaction === action && comment.id === commentId) {
                    comment.userReaction = '';
                    comment.likesCount -= 1;
                  } else if (item.comment === commentId && item.comment === comment.id) {
                    if (comment.userReaction === this.userCommentAction.dislike) {
                      comment.userReaction = action;
                      comment.likesCount += 1;
                      comment.dislikesCount -= 1;
                    } else {
                      comment.userReaction = action;
                      comment.likesCount += 1;
                    }
                  }
                });
              })
            }
          })
        }

        if (action === this.userCommentAction.dislike) {
          this._snackBar.open("Ваш голос учтен!");

          this.commentsService.getArticleCommentActions(this.article.id).subscribe(reactions => {
            if (reactions.length === 0) {
              this.allComments.comments.forEach(comment => {
                if (comment.id === commentId && comment.userReaction === action) {
                  comment.userReaction = '';
                  comment.dislikesCount--;
                }
              })
            }
            if (reactions.length > 0) {
              this.allComments.comments.forEach(comment => {
                reactions.forEach(item => {
                  if (comment.userReaction === action && comment.id === commentId) {
                    comment.userReaction = '';
                    comment.dislikesCount--;
                  } else if (item.comment === commentId && item.comment === comment.id) {
                    if (comment.userReaction === this.userCommentAction.like) {
                      comment.userReaction = action;
                      comment.likesCount--;
                      comment.dislikesCount++;
                    } else {
                      comment.userReaction = action;
                      comment.dislikesCount++;
                    }
                  }
                });
              })
            }
          })
        }
      },
      error: (errorResponse: HttpErrorResponse) => {
        if (errorResponse.error && errorResponse.error.message) {
          this._snackBar.open("Чтобы поставить реакцию, войдите или зарегистрируйтесь!")
        } else {
          this._snackBar.open("Не удалось поставить реакцию!")
        }
      }
    });
  }

  updateReactions(): void {
    this.commentsService.getArticleCommentActions(this.commentParams.article).subscribe(reactions => {
      this.reactions = reactions;
      this.allComments.comments.forEach(comment => {
        this.reactions.forEach(item => {
          if (item.comment === comment.id) {
            comment.userReaction = item.action;
          }
        });
      })
    })
  }
}
