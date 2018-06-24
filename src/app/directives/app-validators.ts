import { Directive, forwardRef, Attribute } from '@angular/core';
import {
  FormControl,
  Validator,
  AbstractControl,
  NG_VALIDATORS,
  NG_ASYNC_VALIDATORS
} from '@angular/forms';
import { AuthenticationService } from '../services/authentication.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/debounceTime'; // prevent : debounceTime is not a function on runtime
import 'rxjs/add/operator/first';


@Directive({
  selector: '[cupLoginExistsValidator]',
  providers: [
    {
      provide: NG_ASYNC_VALIDATORS,
      useExisting: forwardRef(() => LoginExistsValidatorDirective), multi: true
    }
  ]
})
export class LoginExistsValidatorDirective implements Validator {
  constructor(private authService: AuthenticationService) {
  }

  validate(control: AbstractControl): Observable<any> {
    return this.authService.checkLoginExists(control.value)
       .map(userExists => {
         console.log("Validation terminated, user exits: ", userExists.is_ok);
         return (userExists.is_ok) ? { userAlreadyExists: true } : null;
       })
      .debounceTime(500)
      .first(); // fondamentale nella validazione: This is happening because the observable never completes, so Angular does not know when to change the form status. So remember your observable must to complete.
                // Ref: https://netbasal.com/angular-2-forms-create-async-validator-directive-dd3fd026cb45
      
  }
}

@Directive({
  selector: '[validateEqual][formControlName],[validateEqual][formControl],[validateEqual][ngModel]',
  providers: [
      { provide: NG_VALIDATORS, useExisting: forwardRef(() => EqualValidatorDirective), multi: true }
  ]
})
export class EqualValidatorDirective implements Validator {
  constructor( @Attribute('validateEqual') public validateEqual: string) {}

  validate(c: AbstractControl): { [key: string]: any } {
      // self value (e.g. retype password)
      let v = c.value;

      // control value (e.g. password)
      let e = c.root.get(this.validateEqual);

      // value not equal
      if (e && v !== e.value) return {
          validateEqual: false
      }
      return null;
  }
}

export const APPLICATION_VALIDATORS = [
  LoginExistsValidatorDirective,
  EqualValidatorDirective
];
