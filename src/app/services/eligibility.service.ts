import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CritereEligibilite } from '../models/critere-eligibilite'; // Assurez-vous que le modèle CritereEligibilite est bien défini
@Injectable({
  providedIn: 'root'
})
export class EligibilityService {
  private apiUrl = 'http://localhost:8000/api/dashboard'; // Remplacez par l'URL de votre API

  constructor(private http: HttpClient) {}

  checkEligibility(): Observable<{ criteria: CritereEligibilite[] }> {
    return this.http.get<{ criteria: CritereEligibilite[] }>(`${this.apiUrl}/verifier`);
  }

  startEligibilityTest(): Observable<any> {
    return this.http.post(`${this.apiUrl}/tester`, {});
  }
    verifierEligibilite(donateurId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/eligibilite/${donateurId}`);
  }
}
