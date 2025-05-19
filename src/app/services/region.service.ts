import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


export interface Region {
  id: number;
  libelle: string;
  created_at?: string;
  updated_at?: string;
}

@Injectable({
  providedIn: 'root'
})
export class RegionService {
  private apiUrl = 'http://127.0.0.1:8000/api/regions';

  constructor(private http: HttpClient) { }
   getAll(): Observable<Region[]> {
    return this.http.get<Region[]>(this.apiUrl);
    
  }
}
