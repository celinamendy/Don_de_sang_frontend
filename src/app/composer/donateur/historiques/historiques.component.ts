import { Component } from '@angular/core';
import { CampagneService } from '../../../services/campagne.service';
import { Campagne } from '../../../models/campagne';
import { DonateurService } from '../../../services/donateur.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router'; 

@Component({
  selector: 'app-historiques',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './historiques.component.html',
  styleUrl: './historiques.component.css'
})
export class HistoriquesComponent {

  campagnes: Campagne[] = [];
  campagnesAvenir: Campagne[] = [];
  campagnesEffectuees: Campagne[] = [];
  campagnesManquees: Campagne[] = [];
  messageErreur: string = '';
  user: any;
  sections: any[] = [];

  constructor(
    private donateurService: DonateurService,
    private authService: AuthService,
    private router: Router 
  ) {}

  ngOnInit(): void {
    this.user = this.authService.getUser(); 
    console.log("Utilisateur chargé dans ngOnInit :", this.user);
    console.log('CampagneComponent initialisé');

    this.donateurService.getCampagnesHistoriqueDonateur().subscribe({
      next: (res: any) => {
        console.log('Réponse reçue :', res);
        if (res.status) {
          this.campagnes = res.data;

          this.campagnes.forEach(c => {
            const dateDebut = new Date(`${c.date_debut}T${c.Heure_debut || '00:00'}`);
            const dateFin = new Date(`${c.date_fin}T${c.Heure_fin || '23:59'}`);
            console.log(`--- ${c.theme} ---`);
            console.log(`Statut: ${c.statut}`);
            console.log(`Date début (brut): ${c.date_debut}T${c.Heure_debut}`);
            console.log(`Date fin (brut): ${c.date_fin}T${c.Heure_fin}`);
            console.log(`Date début (objet):`, dateDebut);
            console.log(`Date fin (objet):`, dateFin);
          });

          console.log('Toutes les campagnes :', this.campagnes);

          const today = new Date();

          this.campagnesAvenir = this.campagnes.filter(c => {
            const dateDebut = new Date(`${c.date_debut}T${c.Heure_debut || '00:00'}`);
            return c.statut === 'à venir' && dateDebut > today;
          });

          this.campagnesEffectuees = this.campagnes.filter(c => c.statut === 'terminée');

          this.campagnesManquees = this.campagnes.filter(c => {
            const dateFin = new Date(`${c.date_fin}T${c.Heure_fin || '23:59'}`);
            return c.statut === 'à venir' && dateFin < today;
          });

          console.log('Campagnes à venir :', this.campagnesAvenir);
          console.log('A venir :', this.campagnesAvenir);
          console.log('Effectuées :', this.campagnesEffectuees);
          console.log('Manquées :', this.campagnesManquees);

          this.loadCampagnes();

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

  loadCampagnes() {
    this.sections = [
      {
        titre: 'Campagnes à venir',
        statut: 'à venir',
        couleur: 'text-primary',
        campagnes: this.campagnesAvenir
      },
      {
        titre: 'Campagnes effectuées',
        statut: 'terminée',
        couleur: 'text-primary',
        campagnes: this.campagnesEffectuees
      },
      {
        titre: 'Campagnes manquées',
        statut: 'à venir',
        couleur: 'text-warning',
        campagnes: this.campagnesManquees
      },
      {
        titre: 'Campagnes annulées',
        statut: 'annulée',
        couleur: 'text-danger',
        campagnes: this.campagnes.filter(c => c.statut === 'annulée')
      }
    ];
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: () => {
        console.log('Déconnexion réussie');
      },
      error: (error) => {
        console.error('Erreur lors de la déconnexion', error);
      },
      complete: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        sessionStorage.clear();
        this.router.navigate(['/login']);
      }
    });
  }
}
