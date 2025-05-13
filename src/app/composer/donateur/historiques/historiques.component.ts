import { Component } from '@angular/core';
import { CampagneService } from '../../../services/campagne.service';
import { Campagne } from '../../../models/campagne';
import { DonateurService } from '../../../services/donateur.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
@Component({
  selector: 'app-historiques',
  standalone: true,
  imports: [CommonModule],
templateUrl: './historiques.component.html',
  styleUrl: './historiques.component.css'
})
export class HistoriquesComponent {

  campagnes: Campagne[] = [];
  messageErreur: string = '';
  user: any;
  

  constructor(private donateurService : DonateurService, private  authService: AuthService) {}

  ngOnInit(): void {
     this.user = this.authService.getUser(); // ou autre méthode
    console.log("Utilisateur chargé dans ngOnInit :", this.user);
    console.log('CampagneComponent initialisé');
    this.donateurService.getCampagnesHistoriqueDonateur().subscribe({
      next: (res: any) => {
        console.log('Réponse reçue :', res);
        if (res.status) {
          this.campagnes = res.data;
          console.log('Campagnes :', this.campagnes);
        } else {
          this.messageErreur = res.message || 'Erreur de chargement';
        }
      },
      error: (err) => {
        console.error(err);
        this.messageErreur = "Erreur serveur ou non authentifié.";
      }
    });
  }
}
