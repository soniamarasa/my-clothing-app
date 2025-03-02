import { Component, OnInit } from '@angular/core';
import { Dropdown } from '@interfaces/dropdown';
import {
  FormGroup,
  Validators,
  UntypedFormBuilder,
  AbstractControlOptions,
} from '@angular/forms';

import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { MessageService } from 'primeng/api';
import { SubSink } from 'subsink';

import { CustomValidationService } from '@services/customValidation.service';
import { UsersFacade } from '@facades/users.facade';
import { IUser } from '../../interfaces/user';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss'],
})
export class RegistrationComponent implements OnInit {
  form!: FormGroup;
  gender: Dropdown[];
  email: string = '';
  private subs = new SubSink();

  isSubmitting = false;

  constructor(
    public _formBuilder: UntypedFormBuilder,
    private _messageService: MessageService,
    private _router: Router,
    private customValidator: CustomValidationService,
    private facade: UsersFacade
  ) {
    this.subs.add(
      this.facade.authState$.subscribe(
        ({ isAuthenticated }: any) =>
          isAuthenticated && this._router.navigate(['/'])
      )
    );

    this.createForm();

    this.gender = [
      { name: 'Feminino', code: 'female' },
      { name: 'Masculino', code: 'male' },
    ];
  }

  ngOnInit(): void {}

  get formControl() {
    return this.form.controls;
  }

  createForm(): any {
    this.form = this._formBuilder.group(
      {
        name: ['', Validators.required],
        gender: ['', Validators.required],
        birthdate: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        confirmEmail: ['', [Validators.required]],
        password: [
          '',
          [
            Validators.required,
            Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$'),
          ],
        ],
        confirmPassword: ['', Validators.required],
      },
      {
        validators: [
          this.customValidator.MatchPassword('password', 'confirmPassword'),
          this.customValidator.MatchEmail('email', 'confirmEmail'),
        ],
      } as AbstractControlOptions
    );
  }

  getAvatar(e: any) {
    this.email = e.target.value;
  }

  submit() {
    this.isSubmitting = true;

    this.subs.add(
      this.facade
        .newUser(this.form.value)
        .pipe(finalize(() => (this.isSubmitting = false)))
        .subscribe({
          next: (res: IUser) => {
            this._messageService.add({
              key: 'notification',
              severity: 'success',
              summary: 'Success!',
              detail: 'Your account has been successfully created.',
            }),
              setTimeout(() => this._router.navigate(['/auth']), 1500);
          },
          error: (error: any) =>
            this._messageService.add({
              key: 'notification',
              severity: 'error',
              summary: 'An error has occurred!',
              detail: error.error.error,
            }),
        })
    );
  }
}
