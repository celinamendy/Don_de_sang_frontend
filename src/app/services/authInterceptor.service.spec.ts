import { TestBed } from '@angular/core/testing';
import { HttpRequest, HttpHandlerFn } from '@angular/common/http';
import { of } from 'rxjs';
import { authInterceptorService } from './authInterceptor.service';

describe('authInterceptorService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({});
    
    // Réinitialiser localStorage pour les tests
    if (typeof localStorage !== 'undefined') {
      localStorage.clear();
    }
  });

  it('should pass request without token', () => {
    // Mock des objets nécessaires
    const req = new HttpRequest('GET', '/api/test');
    const next: HttpHandlerFn = jasmine.createSpy('next').and.returnValue(of({}));
    
    // Appel de la fonction
    authInterceptorService(req, next);
    
    // Vérifier que next a été appelé avec la requête originale
    expect(next).toHaveBeenCalledWith(req);
  });

  it('should add token to headers when available', () => {
    // Configurer localStorage pour le test
    localStorage.setItem('access_token', 'test-token');
    
    // Mock des objets nécessaires
    const req = new HttpRequest('GET', '/api/test');
    const next: HttpHandlerFn = jasmine.createSpy('next').and.callFake((modifiedReq) => {
      // Vérifier que l'en-tête Authorization a été ajouté
      expect(modifiedReq.headers.get('Authorization')).toBe('Bearer test-token');
      return of({});
    });
    
    // Appel de la fonction
    authInterceptorService(req, next);
  });
});