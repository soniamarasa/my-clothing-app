import { LOCALE_ID, NgModule, provideZoneChangeDetection } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { registerLocaleData } from '@angular/common';
import localePT from '@angular/common/locales/pt';
import { MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { providePrimeNG } from 'primeng/config';
import { ClosetTheme } from './styles/closet-theme.preset';
import { PRIMENG_PT_BR_TRANSLATION } from './config/primeng-pt-br.translation';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TokenInterceptor } from '@interceptors/token.interceptor';

registerLocaleData(localePT);

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
  ],
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    providePrimeNG({
      overlayAppendTo: 'body',
      theme: {
        preset: ClosetTheme,
        options: {
          darkModeSelector: '.theme-butterfly',
        },
      },
      translation: PRIMENG_PT_BR_TRANSLATION,
    }),
    DialogService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true,
    },
    { provide: LOCALE_ID, useValue: 'pt-br' },
    MessageService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
