import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormGroup,
  Validators,
  UntypedFormBuilder,
  AbstractControlOptions,
} from '@angular/forms';
import { finalize, tap } from 'rxjs';
import { SubSink } from 'subsink';
import { MessageService } from 'primeng/api';

import { CustomValidationService } from '@services/customValidation.service';
import { UsersFacade } from '@facades/users.facade';
import { Dropdown } from '@interfaces/dropdown';
import { IUser } from '@interfaces/user';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
})
export class AccountComponent implements OnInit {
  private subs = new SubSink();

  formData!: FormGroup;
  formPassword!: FormGroup;
  gender: Dropdown[];
  user!: IUser;

  showBtnForm: boolean = false;
  showBtnFormPass: boolean = false;
  isSubmitting!: boolean;

  isLoaded: boolean = false;

  constructor(
    public _formBuilder: UntypedFormBuilder,
    private _messageService: MessageService,
    private customValidator: CustomValidationService,
    private facade: UsersFacade
  ) {
    this.gender = [
      { name: 'Female', code: 'female' },
      { name: 'Male', code: 'male' },
    ];
  }

  ngOnInit(): void {
    this.subs.add(
      this.facade.getUserById(this.user._id).subscribe((user) => {
        this.user = user;
        this.setForms(this.user);
        this.formData.statusChanges.subscribe(() => (this.showBtnForm = true));
        this.formPassword.statusChanges.subscribe(
          () => (this.showBtnFormPass = true)
        );
      })
    );
  }

  setForms(user: IUser) {
    this.createForm(user);
    this.createFormPassword(user);
    this.isLoaded = true;
  }

  createForm(user: IUser): any {
    this.formData = this._formBuilder.group({
      name: [user.name, Validators.required],
      gender: [user.gender, Validators.required],
      email: [user.email, [Validators.required, Validators.email]],
      birthdate: [new Date(user.birthdate), Validators.required],
    });
  }

  createFormPassword(user: IUser): any {
    this.formPassword = this._formBuilder.group(
      {
        oldPassword: ['', [Validators.required]],
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
        ],
      } as AbstractControlOptions
    );
  }

  get formControl() {
    return this.formData.controls;
  }

  get formPasswordControl() {
    return this.formPassword.controls;
  }

  resetForm() {
    this.showBtnForm = false;
    this.showBtnFormPass = false;

    this.setForms(this.user);
  }

  submit(form: number) {
    this.isSubmitting = true;

    let data: IUser = this.formData.value;

    if (form === 1) {
      this.subs.add(
        this.facade
          .updateUser(data)
          .pipe(finalize(() => (this.isSubmitting = false)))
          .subscribe({
            next: (res) => {
              this.showBtnForm = false;
              this._messageService.add({
                key: 'notification',
                severity: 'success',
                summary: 'Success!',
                detail: 'Your account details have been updated.',
                icon: 'fa-solid fa-check',
              });
            },
            error: (error) =>
              this._messageService.add({
                key: 'notification',
                severity: 'error',
                summary: 'An error has occurred!',
                detail: error.error.error,
                icon: 'fa-solid fa-check',
              }),
          })
      );
    } else {
      this.subs.add(
        this.facade
          .updateUser({ ...data, ...this.formPassword.value })
          .pipe(finalize(() => (this.isSubmitting = false)))
          .subscribe({
            next: (res) => {
              this.showBtnFormPass = false;
              this._messageService.add({
                key: 'notification',
                severity: 'success',
                summary: 'Success!',
                detail: 'Your password has been updated.',
                icon: 'fa-solid fa-check',
              });
            },
            error: (error) =>
              this._messageService.add({
                key: 'notification',
                severity: 'error',
                summary: 'An error has occurred!',
                detail: error.error.error,
                icon: 'fa-solid fa-check',
              }),
          })
      );
    }
  }
}
