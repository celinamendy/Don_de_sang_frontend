import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { apiUrl } from './apiUrl'; // Assurez-vous que apiUrl contient l'URL de base

@Injectable({
  providedIn: 'root'
})
export class OrganisateurService {


  private apiUrl = 'http://127.0.0.1:8000/api/organisateur'; // Remplacez par l'URL de votre API
  authService: any;

  constructor(private http: HttpClient) {}

  private getAuthHeaders() {
    const token = localStorage.getItem('access_token');
    console.log('le token est présent dans le localstorage ...');
    return {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`
      })
    };
  }
  
  // Récupérer l'organisateur connecté
getOrganisateurConnecte(): Observable<any> {
  return this.http.get(`${this.apiUrl}/organisateur`, this.getAuthHeaders()).pipe(
    catchError(this.handleError)
  );
}
fetchOrganisateur(): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}/me`);
}

getCurrentOrganisateur(): Observable<any> {
  const userId = this.authService.getUserId();
  return this.http.get(`${this.apiUrl}/organisateurs/user/${userId}`);
}

  // Récupérer une organisateur par son ID
  getById(id: number): Observable<any> {
    return this.http.get(`${apiUrl}/organisateurs/${id}`, this.getAuthHeaders());
  }

  // Récupérer l'organisateur lié à un utilisateur
  getByUserId(userId: number): Observable<any> {
    return this.http.get(`${apiUrl}/organisateurs/utilisateur/${userId}`, this.getAuthHeaders());
  }

  // Récupérer tous les organisateurs
  getAll(): Observable<any> {
    return this.http.get(`${apiUrl}/organisateurs`, this.getAuthHeaders()).pipe(
      catchError(this.handleError)
    );
  }

  // Ajouter un nouvel organisateur
  create(data: any): Observable<any> {
    return this.http.post(`${apiUrl}/organisateurs`, data, this.getAuthHeaders()).pipe(
      catchError(this.handleError)
    );
  }

  // Mettre à jour un organisateur
  update(id: number, data: any): Observable<any> {
    return this.http.put(`${apiUrl}/organisateurs/${id}`, data, this.getAuthHeaders()).pipe(
      catchError(this.handleError)
    );
  }

  // Supprimer un organisateur
  delete(id: number): Observable<any> {
    return this.http.delete(`${apiUrl}/organisateurs/${id}`, this.getAuthHeaders()).pipe(
      catchError(this.handleError)
    );
  }

  // Créer une nouvelle campagne
  createCampagne(data: any): Observable<any> {
    return this.http.post(`${apiUrl}/campagnes`, data, this.getAuthHeaders()).pipe(
      catchError(this.handleError)
    );
  }

  // Récupérer une campagne par ID
  getCampagneById(id: number): Observable<any> {
    return this.http.get(`${apiUrl}/campagnes/${id}`, this.getAuthHeaders()).pipe(
      catchError(this.handleError)
    );
  }

  // Récupérer les campagnes d'un organisateur par ID
  getCampagnesByOrganisateurId(id: number): Observable<any> {
    return this.http.get(`${apiUrl}/organisateurs/${id}/campagnes`, this.getAuthHeaders()).pipe(
      catchError(this.handleError)
    );
  }

  // Récupérer les campagnes de l'organisateur connecté
  getMesCampagnes(): Observable<any> {
    return this.http.get(`${apiUrl}/organisateurs/mes-campagnes`, this.getAuthHeaders()).pipe(
      catchError(this.handleError)
    );
  }

  // Mettre à jour une campagne
  updateCampagne(id: number, data: any): Observable<any> {
    return this.http.put(`${apiUrl}/campagnes/${id}`, data, this.getAuthHeaders()).pipe(
      catchError(this.handleError)
    );
  }

  // Supprimer une campagne
  deleteCampagne(id: number): Observable<any> {
    return this.http.delete(`${apiUrl}/campagnes/${id}`, this.getAuthHeaders()).pipe(
      catchError(this.handleError)
    );
  }

  // Valider une participation
  validerParticipation(id: number): Observable<any> {
    return this.http.put(`${apiUrl}/participations/${id}/valider`, {}, this.getAuthHeaders()).pipe(
      catchError(this.handleError)
    );
  }

  // Récupérer les participants d'une campagne
  getParticipants(id: number): Observable<any> {
    return this.http.get(`${apiUrl}/campagnes/${id}/participants`, this.getAuthHeaders()).pipe(
      catchError(this.handleError)
    );
  }

  // Récupérer les campagnes passées
  getCampagnesPassees(): Observable<any> {
    return this.http.get(`${apiUrl}/campagnes-passees`, this.getAuthHeaders()).pipe(
      catchError(this.handleError)
    );
  }

  // Récupérer les campagnes à venir
  getCampagnesAVenir(): Observable<any> {
    return this.http.get(`${apiUrl}/campagnes-a-venir`, this.getAuthHeaders()).pipe(
      catchError(this.handleError)
    );
  }

  // Récupérer les statistiques
  getStatistiques(): Observable<any> {
    return this.http.get(`${apiUrl}/campagnes/statistiques`, this.getAuthHeaders()).pipe(
      catchError(this.handleError)
    );
  }

  // Récupérer les demandes urgentes
  getDemandesUrgentes(): Observable<any> {
    return this.http.get(`${apiUrl}/demandes-urgentes`, this.getAuthHeaders()).pipe(
      catchError(this.handleError)
    );
  }

  // Gérer les erreurs
  private handleError(error: any): Observable<never> {
    console.error('Erreur Organisateur:', error);
    return throwError(error);
  }

 
}
