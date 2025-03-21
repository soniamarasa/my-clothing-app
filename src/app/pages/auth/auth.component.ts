import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SubSink } from 'subsink';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { finalize } from 'rxjs';

import { UsersFacade } from '@facades/users.facade';
import { IUser } from '../../interfaces/user';
import { RecoverDialogComponent } from './recover-dialog/recover-dialog.component';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent implements OnInit {
  form!: FormGroup;
  private subs = new SubSink();

  isSubmitting = false;

  constructor(
    public _formBuilder: FormBuilder,
    public _dialogService: DialogService,
    private _router: Router,
    private _messageService: MessageService,
    private facade: UsersFacade,
  ) {
    this.subs.add(
      this.facade.authState$.subscribe(
        ({ isAuthenticated }) =>
          isAuthenticated && this._router.navigate(['/']),
      ),
    );

    this.createForm();
  }

  ngOnInit(): void {}

  get formControl() {
    return this.form.controls;
  }

  createForm(): any {
    this.form = this._formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  openDialogRecover() {
    const ref = this._dialogService.open(RecoverDialogComponent, {
      header: 'Esqueceu a sua senha?',
    });

    this.subs.add(
      (ref as DynamicDialogRef).onClose.subscribe((email) => {
        if (email) {
          this.retrievePassword(email);
        }
      }),
    );
  }

  retrievePassword(email: IUser['email']) {
    this.subs.add(
      this.facade.retrievePassword(email, window.location.origin).subscribe({
        next: (res) => {
          this._messageService.add({
            key: 'notification',
            severity: 'success',
            summary: 'Success!',
            detail: res.message,
          });
        },

        error: (error) => {
          this._messageService.add({
            key: 'notification',
            severity: 'error',
            summary: 'An error has occurred!',
            detail: error.error.error,
          });
        },
      }),
    );
  }

  login() {
    this.isSubmitting = true;

    this.subs.add(
      this.facade
        .login(this.form.value)
        .pipe(finalize(() => (this.isSubmitting = false)))
        .subscribe({
          next: (user) => {
            setTimeout(() => this._router.navigate(['/']), 1000);
          },
          error: (error) =>
            this._messageService.add({
              key: 'notification',
              severity: 'error',
              summary: 'An error has occurred!',
              detail: error.error.error,
            }),
        }),
    );
  }
}
