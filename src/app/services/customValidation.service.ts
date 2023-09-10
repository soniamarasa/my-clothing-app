import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})

export class CustomValidationService {
  MatchEmail(email: string, confirmEmail: string) {
    return (formGroup: FormGroup) => {
      const emailControl = formGroup.controls[email];
      const confirmEmailControl = formGroup.controls[confirmEmail];

      if (!emailControl || !confirmEmailControl) {
        return null;
      }
      if (
        confirmEmailControl.errors &&
        !confirmEmailControl.errors['passwordMismatch']
      ) {
        return null;
      }

      if (emailControl.value !== confirmEmailControl.value) {
        confirmEmailControl.setErrors({ emailMismatch: true });
      } else {
        confirmEmailControl.setErrors(null);
      }

      return null;
    };
  }

  MatchPassword(password: string, confirmPassword: string) {
    return (formGroup: FormGroup) => {
      const passwordControl = formGroup.controls[password];
      const confirmPasswordControl = formGroup.controls[confirmPassword];

      if (!passwordControl || !confirmPasswordControl) {
        return null;
      }

      if (
        confirmPasswordControl.errors &&
        !confirmPasswordControl.errors['passwordMismatch']
      ) {
        return null;
      }

      if (passwordControl.value !== confirmPasswordControl.value) {
        confirmPasswordControl.setErrors({ passwordMismatch: true });
      } else {
        confirmPasswordControl.setErrors(null);
      }

      return null;
    };
  }

}
