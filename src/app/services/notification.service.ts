import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor() { }
  unreadCount(): Observable<number> {
    // Remplace par un appel HTTP si tu stockes les notifications côté serveur
    return of(3); // Exemple fixe — à adapter
  }
}
