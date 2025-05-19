import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { User } from '../models/user';
import { tap } from 'rxjs/operators';

interface RefreshResponse {
  access_token: string;
  
}
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://127.0.0.1:8000/api';
  getCurrentOrganisateur: any;
  getOrganisateurConnecte: any;
 
 

  constructor(private http: HttpClient, private router: Router) {}
  user: { organisateur?: { id: number } } | null = null;

  login(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, data);
  }

  register(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, data);
  }

  logout(): Observable<any> {
  return this.http.post(`${this.apiUrl}/logout`, {}, {
    headers: {
      Authorization: `Bearer ${this.getToken()}`
    }
  });
}

  getToken(): string | null {
    return localStorage.getItem('access_token');
  }
  getRoles(): string[] {
    const roles = localStorage.getItem('roles');
    return roles ? JSON.parse(roles) : [];
  }
  getRole(): string | null {
    const role = localStorage.getItem('userRole');
    return role ? role.toLowerCase() : null;
  }
  getUserId(): number | null {
    const token = this.getToken();
    if (!token) return null;
  
    const decoded: any = this.decodeToken(token);
    return decoded?.user?.id || null;
  }
  decodeToken(token: string): any {
    try {
      return jwtDecode(token);
    } catch (error) {
      return null;
    }
  }
  
refreshToken(): Observable<RefreshResponse> {
  return this.http.post<RefreshResponse>(`${this.apiUrl}/refresh`, {})
    .pipe(
      tap(response => {
        if (response && response.access_token) {
          localStorage.setItem('access_token', response.access_token);
        }
      })
    );
}

  getProfile(): Observable<any> {
    return this.http.get(`${this.apiUrl}/profile`);
  }

  getUserInfo(): Observable<any> {
    return this.http.get(`${this.apiUrl}/user-info`);
  }

  currentUser(): User | null {
    const userStock = localStorage.getItem('user');
    return userStock ? JSON.parse(userStock) : null;
  }
  

  get organisateurId(): number | null {
    return this.user?.organisateur?.id || null;
  }

  handleLogin(res: any): void {
    localStorage.setItem('access_token', res.access_token);
    localStorage.setItem('user', JSON.stringify(res.user));
    localStorage.setItem('userRoles', JSON.stringify(res.roles)); // ['Organisateur']
    localStorage.setItem('userRole', res.roles[0]); // pour accès rapide
  }
  

  isLoggedIn(): boolean {
    return !!localStorage.getItem('access_token');
  }
  
  clearStorage(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    localStorage.removeItem('roles');
  }
  // logout(): void {
  //   localStorage.removeItem('access_token');
  //   localStorage.removeItem('user');
  // }
  
  private redirectUser(user: any) {
    const roles = user.roles;

    if (roles.includes("donateur")) {
      this.router.navigate(['/dashboard']);
    } else if (roles.includes("organisateur")) {
      this.router.navigate(['/organisateur/dashboard']);
    }
  }


  getUser() {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const user = localStorage.getItem('user');
        console.log('Utilisateur récupéré du localStorage :', user);
        // Vérifiez si l'utilisateur est présent dans le localStorage
        return user ? JSON.parse(user) : null;
      } catch (error) {
        console.error('Erreur lors de la récupération des données utilisateur :', error);
        return null;
      }
    } else {
      console.warn('localStorage n\'est pas disponible.');
      return null;
    }
  }
  isOrganisateur(): boolean {
    const user = this.getUser();
    return user && user.roles && user.roles.includes('organisateur');
  }
  isDonateur(): boolean {
    const user = this.getUser();
    return user && user.roles && user.roles.includes('donateur');
  }
  isAdmin(): boolean {
    const user = this.getUser();
    return user && user.roles && user.roles.includes('admin');
  }
  isSuperAdmin(): boolean {
    const user = this.getUser();
    return user && user.roles && user.roles.includes('super-admin');
  }
  isStructure(): boolean {
    const user = this.getUser();
    return user && user.roles && user.roles.includes('structure');
  }
}

function jwtDecode(token: string): any {
  throw new Error('Function not implemented.');
}

