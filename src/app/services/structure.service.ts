import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StructureService {
private apiUrl = 'http://127.0.1:8000/api/structures'; // adapte selon ton endpoint
  constructor(private http: HttpClient) { }
  // Récupérer toutes les structures
  getAll(): Observable<any> {
    return this.http.get(`${this.apiUrl}`);
  }

  // Récupérer une structure par son ID
  getById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  // Récupérer la structure liée à un utilisateur
  getByUserId(userId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/utilisateur/${userId}`);
  }

  // Ajouter une nouvelle structure
  create(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}`, data);
  }

  // Mettre à jour une structure
  update(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }
  getStructureByOrganisateurId(id: number) {
    return this.http.get(`${this.apiUrl}/structures/organisateur/${id}`);
  }

  // Supprimer une structure
  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
getAllStructures(): Observable<any> {
    return this.http.get(`${this.apiUrl}`);
  }
  
}
