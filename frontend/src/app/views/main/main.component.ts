import { Component, HostListener, OnInit } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { CategoryResponseType } from '../../../types/category-response.type';
import { CategoryService } from '../../shared/services/category.service';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OrderService } from '../../shared/services/order.service';
import { DefaultResponseType } from '../../../types/default-response.type';
import { MatSnackBar } from '@angular/material/snack-bar';
import { OrderCategoryType } from '../../../types/order-category.type';
import { ArticlesService } from '../../shared/services/articles.service';
import { ArticleType } from '../../../types/article.type';

@Component({
  selector: 'app-main',
  standalone: false,
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss', './adaptive-main.component.scss'],
})
export class MainComponent implements OnInit {
  
  reviews = [
    {
      name: "Станислав",
      image: "person1.png",
      text: "Спасибо огромное АйтиШторму за прекрасный блог с полезными статьями! Именно они и побудили меня углубиться в тему SMM и начать свою карьеру."
    },
    {
      name: "Алёна",
      image: "person2.png",
      text: "Обратилась в АйтиШторм за помощью копирайтера. Ни разу ещё не пожалела! Ребята действительно вкладывают душу в то, что делают, и каждый текст, который я получаю, с нетерпением хочется выложить в сеть."
    },
    {
      name: "Мария",
      image: "person3.png",
      text: "Команда АйтиШторма за такой короткий промежуток времени сделала невозможное: от простой фирмы по услуге продвижения выросла в мощный блог о важности личного бренда. Класс!"
    },
  ];


  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: false,
    touchDrag: true,
    pullDrag: false,
    dots: true,
    navSpeed: 700,
    navText: ['', ''],
    autoplay: true,
    autoplayTimeout: 4000,
    autoplayHoverPause: true,
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 1
      },
      740: {
        items: 1
      },
      940: {
        items: 1
      }
    },
    nav: false
  }
  customOptionsRev: OwlOptions = {
    loop: true,
    mouseDrag: false,
    touchDrag: true,
    pullDrag: false,
    dots: false,
    navSpeed: 700,
    navText: ['', ''],
    autoplay: true,
    autoplayTimeout: 6000,
    autoplayHoverPause: true,
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 2
      },
      740: {
        items: 2
      },
      940: {
        items: 3
      }
    },
    nav: false
  }

  categories: CategoryResponseType[] = [];
  orderForm: FormGroup;
  isPopupOpen: boolean = false;

  successOrder: boolean = false;
  canceledOrder: boolean = false;

  selectedCategory: string | null = null;

  orderCategoryType = OrderCategoryType;

  topArticles: ArticleType[] = [];

  open: boolean = false;

  constructor(private categoryService: CategoryService, private fb: FormBuilder, private orderService: OrderService, private _snackBar: MatSnackBar, private articleService: ArticlesService) {
    this.orderForm = this.fb.group({
      name: ['', [Validators.required, Validators.pattern(/^[А-Я][а-яА-Я]{2,20}$/)]],
      phone: ['', [Validators.required, Validators.pattern(/^\+7\s[(][0-9]{3}[)]\s[0-9]{3}-[0-9]{2}-[0-9]{2}$/)]],
      service: [''],
    })
  }

  ngOnInit(): void {

    this.categoryService.getCategories().subscribe({
      next: (data: CategoryResponseType[]) => {
        this.categories = data;
      }, 
      error: (errorResponse: HttpErrorResponse) => {
        if (errorResponse.error && errorResponse.error.message) {
          this._snackBar.open(errorResponse.error.message)
        } else {
          this._snackBar.open("Не удалось получить категории!")
        }
      }
    });

    this.articleService.getTopArticles().subscribe({
      next: (data: ArticleType[]) => {
        this.topArticles = data;
      },
      error: (errorResponse: HttpErrorResponse) => {
        if (errorResponse.error && errorResponse.error.message) {
          this._snackBar.open(errorResponse.error.message)
        } else {
          this._snackBar.open("Не удалось получить популярные статьи!")
        }
      }
    })
  }

  openPopup(orderType: string): void{
    this.selectedCategory = orderType;
    this.isPopupOpen = true;
    
  }

  closePopup(): void {
    this.isPopupOpen = false;
    this.successOrder = false;
  }

  createOrder(): void {
    this.orderForm.value.service = this.selectedCategory;
    if(this.orderForm.valid && this.orderForm.value.service && this.orderForm.value.name && this.orderForm.value.phone){
      this.orderService.createOrder(this.orderForm.value.name, this.orderForm.value.phone, this.orderForm.value.service, 'order').subscribe(
        (data: DefaultResponseType) => {
          if(data.error){
            this._snackBar.open(data.message);
            this.canceledOrder = true;
          }
          this.orderForm.reset()
          this.successOrder = true;
        }
      )
    }
  }

  toggle(): void {
    this.open = !this.open;
  }

  @HostListener('document:click', ['$event'])
  click(event: Event) {
    if (this.isPopupOpen && (event.target as HTMLElement).className.indexOf('popup-back') === 0) {
      this.isPopupOpen = false;
    }
  }
}
