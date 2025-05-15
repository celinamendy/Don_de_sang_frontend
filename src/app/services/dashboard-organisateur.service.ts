import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { apiUrl } from './apiUrl';

@Injectable({
  providedIn: 'root'
})
export class DashboardOrganisateurService {
private apiUrl = 'http://localhost:8000/api/dashboard-organisateur';
  getDonneursParGroupeSanguin: any;
  getCampagnesParMois: any;
  getStatistiques: any;
  getDemandesUrgentes: any;
  getCampagnesPassees: any;
  getDemandesByOrganisateur: any;
  
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
    return this.http.get<any>(`${this.apiUrl}/statistiques/`, this.getAuthHeaders())

}
 getDonsParRegion(): Observable<{ region: string, total: number }[]> {
    return this.http.get<{ region: string, total: number }[]>(`${this.apiUrl}/dons-par-region`, this.getAuthHeaders());
  }

   getDonsParMois(): Observable<{ mois: string, total: number }[]> {
    return this.http.get<{ mois: string, total: number }[]>(`${this.apiUrl}/dons-par-mois`, this.getAuthHeaders());
  }
  // Campagnes actives
  campagnesActives(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/campagnes/actives`, this.getAuthHeaders());
  }

  // Campagnes à venir
  campagnesAVenir(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/campagnes/avenir`, this.getAuthHeaders());
  }
  // Campagnes passées
  campagnesPassees(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/campagnes/passees`, this.getAuthHeaders());
  }

  // Demandes urgentes
  demandesUrgentes(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/demandes-urgentes`, this.getAuthHeaders());
  }
  getDemandesParOrganisateur(): Observable<any> {
    return this.http.get(`${this.apiUrl}/organisateur/demandes`, this.getAuthHeaders());
  }


  // Campagnes par mois
  campagnesParMois(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/campagnes-par-mois`, this.getAuthHeaders());
  }

  // Donneurs par groupe
  donneursParGroupe(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/donneurs-par-groupe`, this.getAuthHeaders());
  }
  // 🔹 Taux de participation
tauxParticipation(): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}/taux-participation`, this.getAuthHeaders());
}

// 🔹 Campagnes par statut
campagnesParStatut(): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}/campagnes-par-statut`, this.getAuthHeaders());
}
}