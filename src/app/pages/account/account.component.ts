import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControlOptions,
  FormGroup,
  UntypedFormBuilder,
  Validators,
} from '@angular/forms';
import { finalize } from 'rxjs';
import { SubSink } from 'subsink';
import { MessageService } from 'primeng/api';

import { CustomValidationService } from '@services/customValidation.service';
import { UsersFacade } from '@facades/users.facade';
import { AuthStore } from '@stores/auth.store';
import { Dropdown } from '@interfaces/dropdown';
import { IUser } from '@interfaces/user';
import { LocalStorageService } from '../../services/local-storage.service';

@Component({
  standalone: false,
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
})
export class AccountComponent implements OnInit, OnDestroy {
  private subs = new SubSink();

  formData!: FormGroup;
  formPassword!: FormGroup;
  gender: Dropdown[] = [
    { name: 'Feminino', code: 'female' },
    { name: 'Masculino', code: 'male' },
  ];
  user!: IUser;

  showBtnForm = false;
  showBtnFormPass = false;
  isSubmitting = false;
  isLoaded = false;
  loadError = '';

  constructor(
    private formBuilder: UntypedFormBuilder,
    private messageService: MessageService,
    private customValidator: CustomValidationService,
    private usersFacade: UsersFacade,
    private authStore: AuthStore,
    private localStorageService: LocalStorageService
  ) {}

  ngOnInit(): void {
    const userId =
      this.localStorageService.get('auth')?.user?._id ??
      this.localStorageService.get('idUser');

    if (!userId) {
      this.loadError = 'Não foi possível identificar sua conta.';
      return;
    }

    this.subs.add(
      this.usersFacade.getUserById(userId).subscribe({
        next: (user) => {
          this.user = user;
          this.setForms(user);
          this.subs.add(
            this.formData.statusChanges.subscribe(() => {
              this.showBtnForm = true;
            }),
            this.formPassword.statusChanges.subscribe(() => {
              this.showBtnFormPass = true;
            })
          );
        },
        error: () => {
          this.loadError = 'Não foi possível carregar seus dados.';
        },
      })
    );
  }

  get formControl() {
    return this.formData.controls;
  }

  get formPasswordControl() {
    return this.formPassword.controls;
  }

  get birthdateLabel(): string {
    if (!this.user?.birthdate) {
      return '—';
    }

    return new Intl.DateTimeFormat('pt-BR').format(new Date(this.user.birthdate));
  }

  setForms(user: IUser): void {
    this.createForm(user);
    this.createFormPassword();
    this.isLoaded = true;
    this.showBtnForm = false;
    this.showBtnFormPass = false;
  }

  createForm(user: IUser): void {
    this.formData = this.formBuilder.group({
      name: [user.name, Validators.required],
      gender: [user.gender, Validators.required],
      email: [user.email, [Validators.required, Validators.email]],
      birthdate: [new Date(user.birthdate), Validators.required],
    });
  }

  createFormPassword(): void {
    this.formPassword = this.formBuilder.group(
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

  resetForms(): void {
    this.setForms(this.user);
  }

  submitProfile(): void {
    if (this.formData.invalid || !this.user?._id) {
      return;
    }

    this.isSubmitting = true;
    const data: IUser = {
      ...this.user,
      ...this.formData.value,
    };

    this.subs.add(
      this.usersFacade
        .updateUser(data)
        .pipe(finalize(() => (this.isSubmitting = false)))
        .subscribe({
          next: (user) => {
            this.user = user;
            this.authStore.patchUser({
              _id: user._id,
              name: user.name,
              email: user.email,
              gender: user.gender,
              birthdate: user.birthdate,
            });
            this.setForms(user);
            this.messageService.add({
              key: 'notification',
              severity: 'success',
              summary: 'Perfil atualizado!',
              detail: 'Suas informações foram salvas com sucesso.',
            });
          },
          error: (error) =>
            this.messageService.add({
              key: 'notification',
              severity: 'danger',
              summary: 'Erro ao atualizar',
              detail: error.error?.error ?? 'Tente novamente mais tarde.',
            }),
        })
    );
  }

  submitPassword(): void {
    if (this.formPassword.invalid || !this.user?._id) {
      return;
    }

    this.isSubmitting = true;
    const payload: IUser = {
      _id: this.user._id,
      ...this.formData.value,
      ...this.formPassword.value,
    };

    this.subs.add(
      this.usersFacade
        .updateUser(payload)
        .pipe(finalize(() => (this.isSubmitting = false)))
        .subscribe({
          next: () => {
            this.createFormPassword();
            this.showBtnFormPass = false;
            this.messageService.add({
              key: 'notification',
              severity: 'success',
              summary: 'Senha alterada!',
              detail: 'Sua nova senha já está ativa.',
            });
          },
          error: (error) =>
            this.messageService.add({
              key: 'notification',
              severity: 'danger',
              summary: 'Erro ao alterar senha',
              detail: error.error?.error ?? 'Verifique a senha atual.',
            }),
        })
    );
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
