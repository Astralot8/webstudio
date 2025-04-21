import { Directive, ElementRef, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appPhoneMask]',
  standalone: false
})
export class PhoneMaskDirective {

  constructor(private elem: ElementRef, private control: NgControl) { }

  @HostListener('input', ['$event'])
  onInput(event: any){
    const value = this.elem.nativeElement.value.replace(/\D/g, '')

    let formattedValue = '';
    if(value.length > 0){
      formattedValue = '+7';
      if(value.length > 1){
        formattedValue += ' (' + value.substring(1, 4)
      }
      if(value.length > 4){
        formattedValue += ') ' + value.substring(4, 7)
      }
      if(value.length > 7){
        formattedValue += '-' + value.substring(7, 9)
      }
      if(value.length > 9){
        formattedValue += '-' + value.substring(9, 11)
      }

    }
    this.control.control?.setValue(formattedValue, { emitEvent: false});
  }

}
