import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ArticleCardComponent } from './article-card/article-card.component';



@NgModule({
  declarations: [
    ArticleCardComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
  ],
  exports: [
    ArticleCardComponent
  ]
})
export class SharedModule { }
