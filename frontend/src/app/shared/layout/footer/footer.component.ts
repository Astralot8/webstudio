import { Component, HostListener } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OrderService } from '../../services/order.service';
import { DefaultResponseType } from '../../../../types/default-response.type';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-footer',
  standalone: false,
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss', './adaptive-footer.component.scss'],
})
export class FooterComponent {

  orderForm: FormGroup;
  isPopupOpen: boolean = false;

  successOrder: boolean = false;
  canceledOrder: boolean = false;
  constructor(private fb: FormBuilder, private orderService: OrderService, private _snackBar: MatSnackBar) {
    this.orderForm = this.fb.group({
      name: ['', [Validators.required, Validators.pattern(/^[А-Я][а-яА-Я]{2,20}$/)]],
      phone: ['', [Validators.required, Validators.pattern(/^\+7\s[(][0-9]{3}[)]\s[0-9]{3}-[0-9]{2}-[0-9]{2}$/)]],
    })
  }

  openPopup(): void {
    this.isPopupOpen = true;
  }

  closePopup(): void {
    this.isPopupOpen = false;
    this.successOrder = false;
  }

  createConsultation(): void {

    if (this.orderForm.valid && this.orderForm.value.name && this.orderForm.value.phone) {
      this.orderService.createConsultation(this.orderForm.value.name, this.orderForm.value.phone, 'consultation').subscribe(
        (data: DefaultResponseType) => {
          if (data.error) {
            this._snackBar.open(data.message);
            this.canceledOrder = true;
          }
          this.orderForm.reset()
          this.successOrder = true;
        }
      )
    }
  }

  @HostListener('document:click', ['$event'])
  click(event: Event) {
    if (this.isPopupOpen && (event.target as HTMLElement).className.indexOf('popup-back') === 0) {
      this.isPopupOpen = false;
    }
  }
}
