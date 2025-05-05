import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, HTTP_INTERCEPTORS,withFetch } from '@angular/common/http';
import { AuthInterceptor } from './services/authInterceptor.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes), 
    provideHttpClient(withFetch()), // Ajout de withFetch ici
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true } // Ajout de l'intercepteur ici
  ]
};