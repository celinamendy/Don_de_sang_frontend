import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { apiUrl } from './apiUrl';

@Injectable({
  providedIn: 'root'
})
export class DashboardOrganisateurService {
private apiUrl = 'http://localhost:8000/api/DashboardOrganisateur';
  getDonneursParGroupeSanguin: any;
  getCampagnesParMois: any;
  getStatistiques: any;
  getDemandesUrgentes: any;
  getCampagnesPassees: any;
private getAuthHeaders() {
  const token = localStorage.getItem('access_token');
  console.log('le token est présent dans le localstorage ...');
  return {
    headers: new HttpHeaders({
      'Authorization': `Bearer ${token}`
    })
  };
}

  constructor(private http: HttpClient) { }
   // 🔹 Statistiques générales
   statistiquesGenerales(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/statistiques-generales`);

}

  // Campagnes actives
  campagnesActives(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/campagnes-actives`);
  }

  // Campagnes à venir
  campagnesAVenir(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/campagnes-a-venir`);
  }
  // Campagnes passées
  campagnesPassees(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/campagnes-passees`);
  }

  // Demandes urgentes
  demandesUrgentes(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/demandes-urgentes`);
  }

  // Campagnes par mois
  campagnesParMois(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/campagnes-par-mois`);
  }

  // Donneurs par groupe
  donneursParGroupe(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/donneurs-par-groupe`);
  }
}