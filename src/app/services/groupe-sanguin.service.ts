import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface GroupeSanguin {
  id: number;
  libelle: string;
  created_at?: string;
  updated_at?: string;
}

@Injectable({
  providedIn: 'root'
})
export class GroupeSanguinService {

  private apiUrl = 'http://localhost:8000/api/groupe-sanguins'; // adapte selon ton URL backend

  constructor(private http: HttpClient) { }

  getAll(): Observable<GroupeSanguin[]> {
    return this.http.get<GroupeSanguin[]>(this.apiUrl);
  }
}
