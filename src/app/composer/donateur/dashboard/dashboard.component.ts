// import { Component,OnInit } from '@angular/core';
// import { DonateurService } from './../../../services/donateur.service';
// import { CommonModule } from '@angular/common';
// import { HttpClient } from '@angular/common/http';
// import Swal from 'sweetalert2';
// @Component({
//   selector: 'app-dashboard',
//   standalone: true,
//   imports: [CommonModule],
//   templateUrl: './dashboard.component.html',
//   styleUrl: './dashboard.component.css'
// })
// export class DashboardComponent implements OnInit {
//   donateur: any = {};
//   donsEffectues: number = 0;
//   prochainDon: string = '';
//   statutEligibilite: string = '';
//   badges: number = 0;
//   campagnes: any[] = [];
//   historique: any[] = [];

//   constructor(private http: HttpClient, private donateurService: DonateurService) {}

//   ngOnInit(): void {
//     this.chargerDashboard();
//     this.loadDonateur();
//   }
//  // Méthode pour récupérer les données du donateur
//  loadDonateur(): void {
//   this.donateurService.getDonateur().subscribe(
//     (response) => {
//       this.donateur = response.data;  // Stocke les informations dans la variable donateur
//       console.log(this.donateur);  // Pour vérifier les données dans la console
//     },
//     (error) => {
//       console.error('Erreur lors de la récupération du donateur', error);
//     }
//   );
// }
//   chargerDashboard(): void {
//     this.http.get<any>('http://localhost:8000/api/dashboard') 
//       .subscribe({
//         next: (res) => {
//           this.donateur = res.donateur;
//           this.donsEffectues = res.dons_effectues;
//           this.prochainDon = res.prochain_don;
//           this.statutEligibilite = res.statut_eligibilite;
//           this.badges = res.badges;
//           this.campagnes = res.campagnes;
//           this.historique = res.historique;
//         },
//         error: (err) => {
//           Swal.fire('Erreur', 'Impossible de charger les données du tableau de bord.', 'error');
//         }
//       });
//   }
// }

import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { User } from '../../../models/user';
import { DonateurService } from './../../../services/donateur.service';
import { Campagne } from './../../../models/campagne';
import { Participation } from './../../../models/participation';
// import { Don } from '../../core/models/donation.model';
import { CritereEligibilite } from '../../../models/critere-eligibilite';
import { AuthService } from './../../../services/auth.service';
import { CampagneService } from '../../../services/campagne.service';
import { EligibilityService } from '../../../services/eligibility.service';
import { NotificationService } from '../../../services/notification.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  user: User | null = null;
  campagnesAVenir: Campagne[] = [];
  historiqueDons: Participation[] = [];
  criteresEligibilite: CritereEligibilite[] = [];
  enChargement = true;

  private authService = inject(AuthService);
  private campagneService = inject(CampagneService);
  private donService = inject(DonateurService);
  private eligibiliteService = inject(EligibilityService);
  private notificationService = inject(NotificationService);
donateur: any;

  get userActuel() {
    return this.authService.currentUser();
  }

  get nombreNotificationsNonLues() {
    return this.notificationService.unreadCount();
  }

  ngOnInit(): void {
    this.chargerDonneesDashboard();
  }

  chargerDonneesDashboard(): void {
    this.enChargement = true;

    this.user = this.authService.currentUser();

    this.campagneService.getUpcomingCampagnes().subscribe({
      next: (campagnes) => {
        this.campagnesAVenir = campagnes;
      },
      error: (erreur) => {
        console.error('Erreur lors du chargement des campagnes', erreur);
      }
    });

    this.donService.getDonateurHistory().subscribe({
      next: (dons) => {
        this.historiqueDons = dons;
      },
      error: (erreur) => {
        console.error('Erreur lors du chargement de l’historique des dons', erreur);
      }
    });

    this.eligibiliteService.checkEligibility().subscribe({
      next: (resultat) => {
        this.criteresEligibilite = resultat.criteria;
      },
      error: (erreur) => {
        console.error('Erreur lors de la vérification de l’éligibilité', erreur);
      },
      complete: () => {
        this.enChargement = false;
      }
    });
  }

  inscrireACampagne(idCampagne: string): void {
    this.campagneService.registerForCampagne(idCampagne).subscribe({
      next: () => {
        const index = this.campagnesAVenir.findIndex(c => c.id === Number(idCampagne));        if (index > -1) {
          this.campagnesAVenir[index] = {
            ...this.campagnesAVenir[index],
            isUserRegistered: true
          };
        }
        this.chargerCampagnes();
      },
      error: (erreur) => {
        console.error('Erreur lors de l’inscription à la campagne', erreur);
      }
    });
  }

  chargerCampagnes(): void {
    this.campagneService.getUpcomingCampagnes().subscribe({
      next: (campagnes) => {
        this.campagnesAVenir = campagnes;
      },
      error: (erreur) => {
        console.error('Erreur lors du rechargement des campagnes', erreur);
      }
    });
  }

  lancerTestEligibilite(): void {
    this.eligibiliteService.startEligibilityTest().subscribe({
      next: (reponse) => {
        console.log('Test d’éligibilité lancé', reponse);
      },
      error: (erreur) => {
        console.error('Erreur lors du lancement du test d’éligibilité', erreur);
      }
    });
  }
}
