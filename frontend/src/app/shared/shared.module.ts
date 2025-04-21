import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ArticleCardComponent } from './article-card/article-card.component';
import { PhoneMaskDirective } from './directives/phone-mask.directive';

@NgModule({
  declarations: [
    ArticleCardComponent,
    PhoneMaskDirective,
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
  ],
  exports: [
    ArticleCardComponent,
    PhoneMaskDirective,
  ]
})
export class SharedModule { }
