import {Component, Input, Optional} from '@angular/core';
import {NgForm, FormGroup, FormGroupDirective} from '@angular/forms';

@Component({
  selector: 'cup-show-error',
  template: `
    <div *ngIf="errorMessages" class="ui red message" style="margin-top: 10px">
        <div *ngFor="let errorMessage of errorMessages">
            {{errorMessage}}
        </div>
    </div> ` })
export class ShowErrorComponent {

  @Input('path') path;
  @Input('text') displayName = '';

  constructor(@Optional() private ngForm: NgForm,
              @Optional() private formGroup: FormGroupDirective) {
  }

  get errorMessages(): string[] {
    let form: FormGroup;
    if (this.ngForm) {
      form = this.ngForm.form;
    } else  {
      form = this.formGroup.form;
    }
    const control = form.get(this.path);
    const messages = [];
    if (!control || !(control.touched) || !control.errors) {
      return null;
    }
    for (const code in control.errors) {
      if (control.errors.hasOwnProperty(code)) {
        const error = control.errors[code];
        let message = '';
        switch (code) {
          case 'required':
            message = `${this.displayName} è un campo obbligatorio`;
            break;
          case 'minlength':
            message = `${this.displayName} deve avere almeno ${error.requiredLength} caratteri`;
            break;
          case 'maxlength':
            message = `${this.displayName} deve al massimo avere ${error.requiredLength} caratteri`;
            break;
          case 'invalidEMail':
            message = `Per favore inserire un indirizzo e-mail valido`;
            break;
          case 'userAlreadyExists':
            message = `Utente '${control.value}' già in utilizzo`;
            break;
          case 'validateEqual':
            message = `${this.displayName}`;
            break;
          default:
            message = `${this.displayName} non è valido`;
        }
        messages.push(message);
      }
    }
    return messages;
  }
}
