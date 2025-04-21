import { Component, Input } from '@angular/core';
import { ArticleType } from '../../../types/article.type';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-article-card',
  standalone: false,
  templateUrl: './article-card.component.html',
  styleUrls: ['./article-card.component.scss', './adaptive-article-card.component.scss'],
})
export class ArticleCardComponent {

  @Input() article!: ArticleType
  serverStaticPath = environment.serverStaticPath;

  constructor(){}
}
