import { FormControl } from '@angular/forms';

export class FormValidator {

  static numbersOnly(control:FormControl) {
    const pattern = /^\d+$/;

    if(control.value) {
      return control.value.match(pattern) ? null : {
        numbersOnly: {
          valid: false
        }
      };
    }
    return;
  }

  static validPhoneNumber(control:FormControl) {
    const pattern = /^[- *().]*[0-9][- *().0-9]*$/;

    if(control.value) {
      return control.value.match(pattern) ? null : {
        numbersOnly: {
          valid: false
        }
      };
    }
    return;
  }

}
