// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { Observable } from 'rxjs';
// import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { CampagneService } from '../../services/campagne.service';
// import { OrganisateurService } from '../../services/organisateur.service';
// import { Campagne } from '../../models/campagne';
// import { Router } from '@angular/router';
// import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import Swal from 'sweetalert2';
// import { HttpErrorResponse } from '@angular/common/http';
// import { throwError } from 'rxjs';
// import { NotificationService } from '../../services/notification.service';
// import { AuthService } from '../../services/auth.service';

// @Component({
//   selector: 'app-campagne',
//   standalone: true,
//   imports: [CommonModule, FormsModule, ReactiveFormsModule],
//   templateUrl: './campagne.component.html',
//   styleUrls: ['./campagne.component.css']
// })
// export class CampagneComponent implements OnInit {
//   campagnes: Campagne[] = [];
//   campagneForm: FormGroup;
//   searchTerm: string = '';
//   todayCampagnes: Campagne[] = [];
//   upcomingCampagnes: Campagne[] = [];
//   pastCampagnes: Campagne[] = [];
//   sortKey: string = '';
//   sortDirection: string = 'asc';
//   filteredCampagnes: Campagne[] = [];
//   notifications: any[] = [];
//   notificationCount: number = 0;
//   organisateurId: number | null = null;
//   structureId: number | null = null;

//   showForm: boolean =true ;
//   isEditing: boolean =true;
//   editingCampagneId: number | null = null;
//   user: any;

//   constructor(
//     private campagneService: CampagneService,
//     private organisateurService: OrganisateurService,
//     private fb: FormBuilder,
//     private router: Router,
//     private notificationService: NotificationService,
//     private authService: AuthService
//   ) {
//     this.campagneForm = this.fb.group({
//       theme: ['', Validators.required],
//       description: [''],
//       lieu: ['', Validators.required],
//       date_debut: ['', Validators.required],
//       date_fin: ['', Validators.required],
//       Heure_debut: ['', Validators.required],
//       Heure_fin: ['', Validators.required],
//       participant: [1, [Validators.required, Validators.min(1)]],
//       statut: ['', Validators.required],
//       structure_transfusion_sanguin_id: [null, Validators.required],
//       organisateur_id: [null]
//     });
//   }

//   ngOnInit(): void {
//     // this.fetchCampagnes();
//     // Get user info from auth service if needed
//     this.getUserInfo();
//   }

//   getUserInfo(): void {
//     this.authService.getUserInfo().subscribe({
      
//       next: (userInfo: any) => {
//         console.log(localStorage.getItem('token'));
//         console.log('User info:', userInfo); // Pour vérifier dans la console
//         this.user = userInfo; // Stocker les informations de l'utilisateur
//         console.log("Utilisateur connecté :", userInfo); // Pour vérifier dans la console
        
//         this.organisateurId = userInfo.organisateur?.id || null;
//         this.structureId = userInfo.organisateur?.structure_transfusion_sanguin_id || null;
  
//         this.fetchCampagnesByOrganisateur();
//       },
//       error: (error: any) => {
//         console.error('Erreur lors de la récupération des informations utilisateur:', error);
//       }
//     });
//   }
  
  

//   logout(): void {
//     this.authService.logout();
//   }

//   fetchCampagnes(): void {
//     console.log('[fetchCampagnes] Appel au service pour récupérer les campagnes...');
//     this.campagneService.getAllCampagnes().subscribe({
//       next: (data) => {
//         console.log('[fetchCampagnes] Données reçues du backend:', data);
//         this.campagnes = data.data; // 
//         this.filteredCampagnes = this.campagnes;
//         this.filterCampagnes();
//       },
//       error: (error) => {
//         console.error('[fetchCampagnes] Erreur lors de la récupération des campagnes:', error);
//         Swal.fire({
//           icon: 'error',
//           title: 'Erreur',
//           text: 'Impossible de charger les campagnes. Veuillez réessayer plus tard.',
//         });
//       }
//     });
//   }
  
  

//   fetchCampagnesByOrganisateur(): void {
//     const organisateurId = this.authService.organisateurId;
//     if (!organisateurId) return; // sécurité
  
//     this.organisateurService.getCampagnesByOrganisateurId(organisateurId).subscribe({
//       next: (data) => {
//         this.campagnes = data;
//         this.filteredCampagnes = this.campagnes;
//         this.filterCampagnes();
//       },
//       error: (error) => {
//         console.error('Erreur lors de la récupération des campagnes:', error);
//         this.handleError(error);
//       }
//     });
//   }
  

//   fetchCampagnesByStructure(structureId: number): void {
//     this.campagneService.getCampagnesByStructureId(structureId).subscribe({
//       next: (data) => {
//         this.campagnes = data;
//         this.filteredCampagnes = this.campagnes;
//         this.filterCampagnes();
//       },
//       error: (error) => {
//         console.error('Error fetching structure campagnes:', error);
//         this.handleError(error);
//       }
//     });
//   }

//   getCampagneDetails(campagneId: number): void {
//     this.campagneService.getCampagneById(campagneId).subscribe({
//       next: (data) => {
//         console.log('Campagne details:', data);
//         // Process the details as needed
//       },
//       error: (error) => {
//         console.error('Error fetching campagne details:', error);
//         this.handleError(error);
//       }
//     });
//   }

//   applyFilter(): void {
//     if (this.searchTerm) {
//       this.filteredCampagnes = this.campagnes.filter((campagne) =>
//         campagne.theme.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
//         campagne.lieu.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
//         campagne.participant.toString().includes(this.searchTerm)
//       );
//     } else {
//       this.filteredCampagnes = this.campagnes;
//     }
//   }

//   sortBy(key: string): void {
//     if (this.sortKey === key) {
//       this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
//     } else {
//       this.sortKey = key;
//       this.sortDirection = 'asc';
//     }

//     this.filteredCampagnes = this.filteredCampagnes.sort((a, b) => {
//       let compareA = a[key as keyof Campagne];
//       let compareB = b[key as keyof Campagne];

//       if (typeof compareA === 'number' && typeof compareB === 'number') {
//         return this.sortDirection === 'asc' ? compareA - compareB : compareB - compareA;
//       }

//       compareA = (compareA as string).toLowerCase();
//       compareB = (compareB as string).toLowerCase();

//       return this.sortDirection === 'asc'
//         ? compareA.localeCompare(compareB)
//         : compareB.localeCompare(compareA);
//     });
//   }

//   resetFilters(): void {
//     this.filteredCampagnes = this.campagnes;
//     this.searchTerm = '';
//     this.sortKey = '';
//     this.sortDirection = 'asc';
//   }

//   filterCampagnes(): void {
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);

//     const tomorrow = new Date(today);
//     tomorrow.setDate(today.getDate() + 1);

//     this.todayCampagnes = this.campagnes.filter((campagne) => {
//       const campagneDate = new Date(campagne.date_debut);
//       return campagneDate.getTime() >= today.getTime() && campagneDate.getTime() < tomorrow.getTime();
//     });

//     this.upcomingCampagnes = this.campagnes.filter((campagne) => {
//       const campagneDate = new Date(campagne.date_debut);
//       return campagneDate.getTime() >= tomorrow.getTime();
//     });

//     this.pastCampagnes = this.campagnes.filter((campagne) => {
//       const campagneDate = new Date(campagne.date_debut);
//       return campagneDate.getTime() < today.getTime();
//     });
//   }

//   toggleForm(): void {
//     this.showForm = true;
//     this.isEditing = false;
//     this.campagneForm.reset();
    
//     // Set default values if needed, like current user as organisateur
//     if (this.organisateurId) {
//       this.campagneForm.patchValue({
//         organisateur_id: this.organisateurId
//       });
//     }
//   }

//   cancelForm(): void {
//     this.showForm = false;
//     this.campagneForm.reset();
//   }

//   editCampagne(campagne: Campagne): void {
//     this.showForm = true;
//     this.isEditing = true;
//     this.editingCampagneId = campagne.id;
//     this.campagneForm.patchValue(campagne);
//   }
  
//   validerParticipation(participationId: number): void {
//     Swal.fire({
//       title: 'Valider la participation ?',
//       text: 'Confirmez-vous cette participation à la campagne ?',
//       icon: 'question',
//       showCancelButton: true,
//       confirmButtonText: 'Oui, valider',
//       cancelButtonText: 'Annuler'
//     }).then((result) => {
//       if (result.isConfirmed) {
//         this.campagneService.validerParticipation(participationId).subscribe({
//           next: () => {
//             Swal.fire('Succès', 'Participation validée avec succès.', 'success');
//             this.fetchCampagnes(); 
//           },
//           error: (error) => {
//             console.error('Erreur validation participation :', error);
//             Swal.fire('Erreur', 'Impossible de valider la participation.', 'error');
//           }
//         });
//       }
//     });
//   }
  
//   validerCampagne(campagneId: number): void {
//     Swal.fire({
//       title: 'Valider la campagne ?',
//       text: 'Êtes-vous sûr de vouloir valider cette campagne ?',
//       icon: 'question',
//       showCancelButton: true,
//       confirmButtonText: 'Oui, valider',
//       cancelButtonText: 'Annuler'
//     }).then((result) => {
//       if (result.isConfirmed) {
//         this.campagneService.validerCampagne(campagneId).subscribe({
//           next: () => {
//             Swal.fire('Succès', 'Campagne validée avec succès.', 'success');
//             this.fetchCampagnes();
//           },
//           error: (error) => {
//             console.error('Erreur validation campagne :', error);
//             Swal.fire('Erreur', 'Impossible de valider la campagne.', 'error');
//           }
//         });
//       }
//     });
//   }
  
//   getParticipants(campagneId: number): void {
//     this.campagneService.getParticipants(campagneId).subscribe({
//       next: (participants) => {
//         console.log('Participants:', participants);
//         // Process participants data here
//         // You might want to store it in a class property or pass it to another method
//       },
//       error: (error) => {
//         console.error('Error fetching participants:', error);
//         this.handleError(error);
//       }
//     });
//   }
  
//   onSubmit(): void {
//     if (this.campagneForm.valid) {
//       if (this.isEditing && this.editingCampagneId !== null) {
//         this.campagneService.updateCampagne(this.editingCampagneId, this.campagneForm.value).subscribe(
//           (response) => {
//             console.log('Campagne updated successfully', response);
//             this.fetchCampagnes();
//             this.cancelForm();
//             Swal.fire('Succès', 'La campagne a été mise à jour avec succès.', 'success');
//           },
//           (error) => {
//             console.error('Error updating campagne:', error);
//             this.handleError(error);
//           }
//         );
//       } else {
//         this.campagneService.createCampagne(this.campagneForm.value).subscribe(
//           (response) => {
//             console.log('Campagne added successfully', response);
//             this.fetchCampagnes();
//             this.campagneForm.reset();
//             this.showForm = false;
//             Swal.fire('Succès', 'La campagne a été ajoutée avec succès.', 'success');
//           },
//           (error) => {
//             console.error('Error adding campagne:', error);
//             this.handleError(error);
//           }
//         );
//       }
//     } else {
//       Swal.fire('Erreur', 'Veuillez remplir tous les champs requis.', 'error');
//     }
//   }

//   navigateToDetail(campagneId: number): void {
//     this.router.navigate(['/campagne', campagneId]);
//   }

//   viewParticipants(campagneId: number): void {
//     this.router.navigate(['/campagne', campagneId, 'participants']);
//   }

//   deleteCampagne(campagneId: number): void {
//     Swal.fire({
//       title: 'Êtes-vous sûr?',
//       text: 'Vous ne pourrez pas annuler cette action!',
//       icon: 'warning',
//       showCancelButton: true,
//       confirmButtonText: 'Oui, supprimer',
//       cancelButtonText: 'Annuler'
//     }).then((result) => {
//       if (result.isConfirmed) {
//         this.campagneService.deleteCampagne(campagneId).subscribe(
//           (response) => {
//             Swal.fire('Supprimé!', 'La campagne a été supprimée.', 'success');
//             this.fetchCampagnes();
//           },
//           (error) => {
//             this.handleError(error);
//           }
//         );
//       }
//     });
//   }

//   private handleError(error: HttpErrorResponse): Observable<never> {
//     console.error('An error occurred:', error);
//     Swal.fire('Erreur', 'Une erreur est survenue, veuillez réessayer plus tard.', 'error');
//     return throwError(() => new Error('Something went wrong. Please try again later.'));
//   }
  
//   // Méthode pour rediriger vers la page de création de campagne
//   navigateToCreateCampagne(): void {
//     this.router.navigate(['/campagne/publier']);
//   }
// }


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

  showForm: boolean = true;
  isEditing: boolean = true;
  editingCampagneId: number | null = null;
  user: any;
  selectedFilter: string = 'all';
   selectedCampagneId: number | null = null;
  showEligibiliteModal: boolean = false;
  
  

  @ViewChild('campagneModal') campagneModalRef!: ElementRef;
  modalInstance: any;

eligibiliteForm: FormGroup = this.fb.group({
  sexe: ['', Validators.required],
  date_naissance: ['', Validators.required],
  poids: ['', [Validators.required, Validators.min(50)]],
  antecedent_medicament: ['Aucun', Validators.required],
  date_dernier_don: ['']
});
campagne: any;


  
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
      this.modalInstance = new Modal(this.campagneModalRef.nativeElement);
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
        console.log('Réponse reçue de l’API :', response); // Vérifiez la structure ici
        this.campagnes = response.data || []; // Assignez les campagnes à la variable
        this.filteredCampagnes = this.campagnes; // Appliquez les campagnes filtrées
        console.log('Campagnes filtrées :', this.filteredCampagnes);
      },
      error: (error) => {
        console.error('Erreur lors de la récupération des campagnes :', error);
      }
    });
  }
    // Méthode pour ouvrir la modale d'éligibilité
  ouvrirModalEligibilite(campagneId: number): void {
    this.selectedCampagneId = campagneId;
    this.showEligibiliteModal = true;
  }
  verifierEligibilite(campagneId: number) {
  if (this.eligibiliteForm.invalid) return;
  console.log('Formulaire d\'éligibilité valide, envoi des données...');
  const donnees = this.eligibiliteForm.value;

  this.authService.getUser().subscribe((donateur: Donateur) => {
    const donateurId = this.user.id;
    console.log('ID de la campagne:', campagneId)
    this.donateurService.mettreAJourInfosDonateur(donateurId, donnees).subscribe(() => {
      this.eligibilityService.verifierEligibilite(donateurId).subscribe((res: any) => {
        if (res.est_eligible) {
          Swal.fire('Éligible 🎉', 'Vous pouvez participer à la campagne.', 'success');
          this.inscrireDonateur(campagneId); // ✅ ici, on utilise campagneId bien défini
        } else {
          Swal.fire('Non éligible ❌', res.problemes.join('<br>'), 'error');
        }
      });
    });
  });
}
// Méthode pour fermer la modale d'éligibilité
  fermerModalEligibilite(): void {
    this.selectedCampagneId = null;
    this.showEligibiliteModal = false;
  }

  
  inscrireDonateur(campagneId: number) {
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
  
    this.campagneService.inscrireDonateur({ donateurId, campagneId }).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Inscription réussie',
          text: 'Vous êtes maintenant inscrit à cette campagne.',
        });
        this.getAllCampagnes(); // facultatif : mise à jour de l'affichage
      },
      error: (error) => {
        console.error('Erreur inscription à la campagne :', error);
  
        if (error.status === 409) {
          Swal.fire({
            icon: 'info',
            title: 'Déjà inscrit',
            text: 'Vous êtes déjà inscrit à cette campagne.',
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Erreur',
            text: 'Une erreur est survenue lors de l’inscription. Veuillez réessayer.',
          });
        }
      }
    });
  }
  
  
  // getCampagneDetail(id: number): void {
  //   this.campagneService.getCampagneById(id).subscribe({
  //     next: (data) => {
  //       this.selectedCampagne = data;
  //       this.showModal();
  //     },
  //     error: (err) => console.error('Erreur récupération campagne', err)
  //   });
  // }

  // showModal(): void {
  //   if (this.modalInstance) {
  //     this.modalInstance.show();
  //   } else {
  //     // Fallback si la modale n’est pas encore initialisée
  //     import('bootstrap').then(({ Modal }) => {
  //       this.modalInstance = new Modal(this.campagneModalRef.nativeElement);
  //       this.modalInstance.show();
  //     });
  //   }
  // }
  
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
