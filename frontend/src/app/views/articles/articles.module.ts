import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { ArticlesRoutingModule } from './articles-routing.module';
import { ArticleComponent } from './article/article.component';
import { BlogComponent } from './blog/blog.component';
import { SharedModule } from '../../shared/shared.module';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    ArticleComponent,
    BlogComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    MatSnackBarModule,
    FormsModule,
    ReactiveFormsModule,
    ArticlesRoutingModule
  ],
  exports: [
    DatePipe
  ]
})
export class ArticlesModule { }
