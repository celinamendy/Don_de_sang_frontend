import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, ObservableInput } from 'rxjs';
import { Campagne } from '../models/campagne';

@Injectable({
  providedIn: 'root'
})
export class CampagneService {
  handleError: ((err: any, caught: Observable<Object>) => ObservableInput<any>) | undefined;
  getCampagnesOrganisateur: any;
 
  getCampagnes(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl); // Retourne un Observable
    throw new Error('Method not implemented.');
  }
  private apiUrl = 'http://127.0.0.1:8000/api/campagnes'; // Remplacez par l'URL de votre API
// private apiUrl = 'http://127.0.1:8000/api'; // Remplacez par l'URL de votre API
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
 getCampagnesByOrganisateurId(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/organisateurs/${id}/campagnes`, this.getAuthHeaders());
    
  }
  getMesCampagnes(): Observable<Campagne[]> {
    return this.http.get<Campagne[]>(`${this.apiUrl}/mes-campagnes`, this.getAuthHeaders());
  }
  
  // Get all campagnes
  getAllCampagnes(): Observable<any> {
    return this.http.get(`${this.apiUrl}/campagnes`, this.getAuthHeaders());
  }
  
  // Create a new campagne
  createCampagne(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}`,data, this.getAuthHeaders());
  }
  
  
  // Get a specific campagne by ID
  getCampagneById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/campagnes/${id}`, this.getAuthHeaders());
  }
  
  // // Get campagnes by organisateur ID
  // getCampagnesByOrganisateurId(id: number): Observable<any> {
  //   return this.http.get(`${this.apiUrl}/campagnes/organisateur/${id}`, this.getAuthHeaders());
  // }
  
  // Update a campagne
  updateCampagne(id: number, campagneData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, campagneData , this.getAuthHeaders());
  }
  
  // Delete a campagne
  deleteCampagne(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/campagnes/${id}`, this.getAuthHeaders());
  }
  
  // Validate a participation
  validerParticipation(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/participations/${id}/valider`, {}, this.getAuthHeaders());
  }
  
  // Get participants of a campagne
  getParticipants(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/campagnes/${id}/participants`, this.getAuthHeaders());
  }
  
  // Validate a campagne
  validerCampagne(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/campagnes/${id}/valider`, {}, this.getAuthHeaders());
  }
  
  // Get campagnes by structure ID
  getCampagnesByStructureId(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/campagnes/structure/${id}`, this.getAuthHeaders());
  }


getUpcomingCampagnes(): Observable<Campagne[]> {
  return this.http.get<Campagne[]>(`${this.apiUrl}/avenir`);
}

registerForCampagne(idCampagne: string): Observable<any> {
  return this.http.post(`${this.apiUrl}/${idCampagne}/inscription`, {});
}
}