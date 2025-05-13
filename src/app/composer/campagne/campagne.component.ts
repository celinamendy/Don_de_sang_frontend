

import { Component, ElementRef, OnInit,AfterViewInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CampagneService } from '../../services/campagne.service';
import { Campagne } from '../../models/campagne';
import { Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Modal } from 'bootstrap';
import { DonateurService } from '../../services/donateur.service';
import { EligibilityService } from '../../services/eligibility.service';
import { Donateur } from '../../models/donateur';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-campagne',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './campagne.component.html',
  styleUrls: ['./campagne.component.css']
})
export class CampagneComponent implements OnInit, AfterViewInit {
  campagnes: Campagne[] = [];
  searchTerm: string = '';
  todayCampagnes: Campagne[] = [];
  upcomingCampagnes: Campagne[] = [];
  pastCampagnes: Campagne[] = [];
  sortKey: string = '';
  sortDirection: string = 'asc';
  filteredCampagnes: Campagne[] = [];
  notifications: any[] = [];
  notificationCount: number = 0;
  organisateurId: number | null = null;
  structureId: number | null = null;

  // showForm: boolean = true;
  // isEditing: boolean = true;
  editingCampagneId: number | null = null;
  user: any;
  selectedFilter: string = 'all';
   selectedCampagneId: number | null = null;
  // showEligibiliteModal: boolean = false;

  

  @ViewChild('campagneModal') campagneModalRef!: ElementRef;
  modalInstance: any;
  selectedCampagne: any;





  
  constructor(
    private fb: FormBuilder,
    private campagneService: CampagneService,
    private authService: AuthService,
    private donateurService: DonateurService,
    private eligibilityService: EligibilityService,
  ) {}
 ngAfterViewInit(): void {

  
  // Dynamically import Bootstrap to avoid SSR/Vite 'document is not defined'
  import('bootstrap').then(({ Modal }) => {
    if (this.campagneModalRef && this.campagneModalRef.nativeElement) {
      this.modalInstance = new Modal(this.campagneModalRef.nativeElement);
    } else {
      console.warn('campagneModalRef non défini au moment de l’initialisation');
    }
  });
}


  
  ngOnInit(): void {
    this.user = this.authService.getUser(); // ou autre méthode
    console.log("Utilisateur chargé dans ngOnInit :", this.user);
    console.log('CampagneComponent initialisé');
    this.getAllCampagnes();
    // this.inscrireDonateur(1); // Exemple d'inscription à une campagne avec ID 1
    
  }

  getAllCampagnes() {
  console.log('Appel de getAllCampagnes()');
  this.campagneService.getAllCampagnes().subscribe({
    next: (response) => {
      console.log('Réponse reçue de l’API :', response);
      this.campagnes = response.data || [];
      this.filteredCampagnes = this.campagnes;
      console.log('Campagnes filtrées :', this.filteredCampagnes);
    },
    error: (error) => {
      console.error('Erreur lors de la récupération des campagnes :', error);
      Swal.fire({
        icon: 'error',
        title: 'Erreur de chargement',
        text: 'Impossible de récupérer les campagnes. Veuillez réessayer plus tard.',
      });
    }
  });
}

// Méthode pour inscrire le donateur à une campagne
inscrireDonateur(campagneId: number): void {
  if (!this.user || !this.user.id) {
    console.log("Utilisateur non connecté ou donateur non défini :", this.user);

    Swal.fire({
      icon: 'warning',
      title: 'Non connecté',
      text: 'Vous devez être connecté en tant que donateur pour vous inscrire à une campagne.',
    });
    return;
  }

  const donateurId = this.user.id;

  Swal.fire({
    title: 'Confirmer l’inscription ?',
    text: 'Souhaitez-vous vous inscrire à cette campagne ?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Oui, je m’inscris',
    cancelButtonText: 'Annuler',
  }).then((result) => {
    if (result.isConfirmed) {
      const donateurId = this.user.id;
      this.campagneService.inscrireDonateur({ donateurId, campagneId }).subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'Inscription réussie',
            text: 'Vous êtes maintenant inscrit à cette campagne.',
          });
          this.getAllCampagnes();
        },
        error: (error) => {
          if (error.status === 401) {
            Swal.fire({
              icon: 'warning',
              title: 'Connexion requise',
              text: 'Veuillez vous connecter avant de vous inscrire à une campagne.',
            });
          }

          else if (error.status === 403 && error.error?.problemes) {
            const raisons = error.error.problemes.map((r: string) => `• ${r}`).join('<br>');
            Swal.fire({
              icon: 'info',
              title: 'Vous n\'êtes pas éligible à cette campagne',
              html: `<p>${raisons}</p>`,
              confirmButtonText: 'OK',
            });
          }

          else if (error.status === 409) {
            Swal.fire({
              icon: 'info',
              title: 'Déjà inscrit',
              text: 'Vous êtes déjà inscrit à cette campagne.',
            });
          }

          else if (error.status === 400) {
            Swal.fire({
              icon: 'warning',
              title: 'Campagne expirée',
              text: error.error?.message || 'La campagne est déjà terminée.',
            });
          }

          else {
            Swal.fire({
              icon: 'error',
              title: 'Erreur',
              text: 'Une erreur est survenue lors de l’inscription. Veuillez réessayer plus tard.',
            });
            console.error(error);
          }
        }
      });
    }
  });
}
  
  
  getCampagneDetail(id: number): void {
  this.campagneService.getCampagneById(id).subscribe({
    next: (data) => {
      this.selectedCampagne = data;
      this.showModal();
    },
    error: (err) => {
      console.error('Erreur récupération campagne', err);
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Impossible de charger les détails de cette campagne.',
      });
    }
  });
}


showModal(): void {
  if (this.modalInstance) {
    this.modalInstance.show();
    this.campagneModalRef.nativeElement.setAttribute('aria-hidden', 'false'); // ✅ Corrige le problème d'accessibilité
  } else {
    import('bootstrap').then(({ Modal }) => {
      this.modalInstance = new Modal(this.campagneModalRef.nativeElement);
      this.modalInstance.show();
      this.campagneModalRef.nativeElement.setAttribute('aria-hidden', 'false'); // ✅ Corrige aussi ici
    });
  }
}
closeModal(): void {
  if (this.modalInstance) {
    this.modalInstance.hide();
    this.campagneModalRef.nativeElement.setAttribute('aria-hidden', 'true'); // ✅ Remet l'état masqué
  }
}

  
  applyFilter(): void {
    console.log('Filtrage avec searchTerm :', this.searchTerm);
    const search = this.searchTerm.toLowerCase();
    this.filteredCampagnes = this.campagnes.filter(campagne =>
      campagne.theme.toLowerCase().includes(search) ||
      campagne.lieu.toLowerCase().includes(search) ||
      campagne.participant.toString().includes(search)
    );
    this.filterCampagnes();
    console.log('Résultat du filtre :', this.filteredCampagnes.length, 'campagnes');
  }

  resetFilters(): void {
    console.log('Réinitialisation des filtres');
    this.searchTerm = '';
    this.selectedFilter = 'all';
    this.filteredCampagnes = [...this.campagnes];
  }

  filterCampagnes(): void {
    const now = new Date();
    console.log('Application du filtre de date :', this.selectedFilter);

    this.filteredCampagnes = this.campagnes.filter(campagne => {
      const dateDebut = new Date(campagne.date_debut);

      switch (this.selectedFilter) {
        case 'today':
          return dateDebut.toDateString() === now.toDateString();
        case 'upcoming':
          return dateDebut > now;
        case 'past':
          return dateDebut < now;
        default:
          return true;
      }
    });

    console.log(`Campagnes après filtre "${this.selectedFilter}" :`, this.filteredCampagnes.length);
    if (this.searchTerm) {
      this.applyFilter();
    }
  }

  // // Méthodes à implémenter selon besoins
  // navigateToCreateCampagne(): void {}
  logout(): void {}
  navigateToDetail(id: number): void {}
  // viewParticipants(id: number): void {}
  // validerCampagne(id: number): void {}
  // editCampagne(campagne: any): void {}
  // deleteCampagne(id: number): void {}
}
