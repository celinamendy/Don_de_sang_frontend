import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { User } from '../models/user'; // Assurez-vous que le modèle User est bien défini
import { Campagne } from '../models/campagne'; // Assurez-vous que le modèle Campagne est bien défini
import { Participation } from '../models/participation';


@Injectable({
  providedIn: 'root'
})
export class DonateurService {
  private apiUrl = 'http://localhost:8000/api/dashboard'; // modifie selon ton backend

  constructor(private http: HttpClient) {}

  getProfilDonateur(): Observable<any> {
    const token = this.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    return this.http.get<any>(`${this.apiUrl}/profil`, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  getCampagnesDonateur(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/campagnes`);
  }
  // Mettre à jour les informations d’un donateur
  mettreAJourInfosDonateur(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/donateurs/${id}`, data);
  }
  participerACampagne(userId: string, campagneId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/campagnes/${campagneId}/participer`, { userId })
      .pipe(catchError(this.gererErreur));
  }

  recupererProfilActuel(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/donateur/profil`)
      .pipe(catchError(this.gererErreur));
  }

  recupererHistoriqueDons(userId: string): Observable<Campagne[]> {
    return this.http.get<Campagne[]>(`${this.apiUrl}/dashboard/user/${userId}`)
      .pipe(catchError(this.gererErreur));
  }
  getDonateurHistory(): Observable<Participation[]> {
    return this.http.get<Participation[]>(`${this.apiUrl}/Daashboard/historique`)
      .pipe(catchError(this.gererErreur));
  }
  // ✅ NOUVELLE MÉTHODE : pour vérifier le donateur connecté
  // getDonateur(): Observable<User> {
  //   const token = this.getToken();
  //   const headers = new HttpHeaders({
  //     'Authorization': `Bearer ${token}`,
  //     'Content-Type': 'application/json'
  //   });
  //   return this.http.get<User>(`${this.apiUrl}/donateur`, { headers })
  //     .pipe(catchError(this.gererErreur));
  // }
  getDonateur(): Observable<any> {
    const token = localStorage.getItem('token'); // ou sessionStorage, selon ton choix
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.get<any>(this.apiUrl, { headers });
  }
  

  // ✅ NOUVELLE MÉTHODE : pour récupérer les données du dashboard
  getDashboardData(donateurId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/dashboard/${donateurId}`)
      .pipe(catchError(this.gererErreur));
  }

  private getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  private handleError(error: any): Observable<never> {
    console.error('Une erreur est survenue:', error);
    return throwError(error);
  }

  private gererErreur(erreur: HttpErrorResponse) {
    let message = 'Une erreur inconnue s’est produite';
    if (erreur.error instanceof ErrorEvent) {
      message = `Erreur côté client : ${erreur.error.message}`;
    } else {
      message = `Erreur ${erreur.status} : ${erreur.error.message || erreur.statusText}`;
    }
    console.error(message);
    return throwError(() => new Error(message));
  }
}
