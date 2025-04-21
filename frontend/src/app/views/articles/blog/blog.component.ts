import { Component, HostListener, OnInit } from '@angular/core';
import { ArticlesType } from '../../../../types/articles.type';
import { ArticlesService } from '../../../shared/services/articles.service';
import { HttpErrorResponse } from '@angular/common/http';
import { CategoryResponseType } from '../../../../types/category-response.type';
import { CategoryService } from '../../../shared/services/category.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AppliedFilterType } from '../../../../types/applied-filter.type';
import { ActivatedRoute, Router } from '@angular/router';
import { ActiveParamsType } from '../../../../types/active-params.type';

@Component({
  selector: 'app-blog',
  standalone: false,
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss', './adaptive-blog.component.scss']
})
export class BlogComponent implements OnInit {
  pages: number[] = [];

  articles!: ArticlesType;
  categories: CategoryResponseType[] = [];
  appliedFilters: AppliedFilterType[] = [];

  activeParams: ActiveParamsType = { categories: [] };

  open: boolean = false;
  isApplied: boolean = false;

  constructor(private articlesService: ArticlesService, private categoryService: CategoryService, private _snackBar: MatSnackBar, private router: Router, private activatedRoute: ActivatedRoute) {

  }

  ngOnInit(): void {
    this.categoryService.getCategories().subscribe({
      next: (data: CategoryResponseType[]) => {
        this.categories = data;
        this.activatedRoute.queryParams.subscribe(params => {
          const activeParams: ActiveParamsType = { categories: [] };

          if (params.hasOwnProperty('categories')) {
            activeParams.categories = Array.isArray(params['categories']) ? params['categories'] : [params['categories']];
          }
          if (params.hasOwnProperty('page')) {
            activeParams.page = +params['page'];
          }
          if (activeParams) {
            this.activeParams = activeParams;
          }

          this.articlesService.getArticles(this.activeParams).subscribe({
            next: (data: ArticlesType) => {
              this.pages = [];
              for (let index = 1; index <= data.pages; index++) {
                this.pages.push(index)
              }
              this.articles = data;
            }
          })

          this.appliedFilters = [];
          this.activeParams.categories.forEach(url => {
            const foundItem = this.categories.find(type => type.url === url);
            if (foundItem) {
              this.appliedFilters.push({
                name: foundItem.name,
                urlParam: foundItem.url,
              })
            }
          })

          if (this.categories && this.categories.length > 0) {
            this.categories.some(item => {
              return this.activeParams.categories.find(type => item.url === type)
            });

          }
        });
      },
      error: (errorResponse: HttpErrorResponse) => {
        if (errorResponse.error && errorResponse.error.message) {
          this._snackBar.open(errorResponse.error.message)
        } else {
          this._snackBar.open("Не удалось получить категории!")
        }
      }
    });
  }

  toggle(): void {
    this.open = !this.open;
  }

  filter(url: string) {
    if (this.activeParams.categories && this.activeParams.categories.length > 0) {
      const existingTypeInParams = this.activeParams.categories.find(item => item === url);
      if (existingTypeInParams) {
        this.activeParams.categories = this.activeParams.categories.filter(item => item !== url);
      } else if (!existingTypeInParams) {
        // this.activeParams.categories.push(url);
        this.activeParams.categories = [...this.activeParams.categories, url]
        
      }
    } else {
      this.activeParams.categories = [url];
    }
    this.activeParams.page = 1;
    this.router.navigate(['/blog'], {
      queryParams: { categories: this.activeParams.categories }
    })
  }

  removeAppliedFilter(appliedFilter: AppliedFilterType) {
    this.activeParams.categories = this.activeParams.categories.filter(item => item !== appliedFilter.urlParam);
    this.activeParams.page = 1;
    this.router.navigate(['/blog'], {
      queryParams: this.activeParams
    })
  }

  openPage(page: number): void {
    this.activeParams.page = page;
    this.router.navigate(['/blog'], {
      queryParams: this.activeParams
    })
  }

  openPrevPage(): void {
    if (this.activeParams.page && this.activeParams.page > 1) {
      this.activeParams.page--;
      this.router.navigate(['/blog'], {
        queryParams: this.activeParams
      })
    }

  }
  openNextPage(): void {
    if (!this.activeParams.page) {
      this.activeParams.page = 1;
      this.activeParams.page++;
      this.router.navigate(['/blog'], {
        queryParams: this.activeParams
      });
    } else if (this.activeParams.page && this.activeParams.page < this.pages.length) {
      this.activeParams.page++;


      this.router.navigate(['/blog'], {
        queryParams: this.activeParams
      });
    }
  }

  @HostListener('document:click', ['$event'])
  click(event: Event) {
    if (this.open && (event.target as HTMLElement).className.indexOf('blog-filter-sorting') === -1) {
      this.open = false;
    }
  }
}
