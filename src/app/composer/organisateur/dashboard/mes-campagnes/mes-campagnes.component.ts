import { Observable } from 'rxjs';
import { FormBuilder, FormGroup, Validators,ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { CampagneService } from '../../../../services/campagne.service';
import { OrganisateurService } from '../../../../services/organisateur.service';
import { Campagne } from '../../../../models/campagne';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import { NotificationService } from '../../../../services/notification.service';
import { AuthService } from '../../../../services/auth.service';
import { Component, OnInit } from '@angular/core';
@Component({
  selector: 'app-mes-campagnes',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, HttpClientModule],
  templateUrl: './mes-campagnes.component.html',
  styleUrls: ['./mes-campagnes.component.css']
})
export class MesCampagnesComponent implements OnInit {
  campagnes: Campagne[] = [];
  campagneForm: FormGroup;
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

  showForm: boolean =true ;
  isEditing: boolean =true;
  editingCampagneId: number | null = null;
  user: any;
activeSection: any;
  organisateur: any;

  constructor(
    private campagneService: CampagneService,
    private organisateurService: OrganisateurService,
    private fb: FormBuilder,
    private router: Router,
    private notificationService: NotificationService,
    private authService: AuthService
  ) {
    this.campagneForm = this.fb.group({
      theme: ['', Validators.required],
      description: [''],
      lieu: ['', Validators.required],
      date_debut: ['', Validators.required],
      date_fin: ['', Validators.required],
      Heure_debut: ['', Validators.required],
      Heure_fin: ['', Validators.required],
      participant: [1, [Validators.required, Validators.min(1)]],
      statut: ['', Validators.required],
      structure_transfusion_sanguin_id: [null, Validators.required],
      organisateur_id: [null]
    });
  }

  ngOnInit(): void {
    const user = this.authService.getUser();
    if (!user || !user.id) {
      console.error("Utilisateur non trouvé ou session expirée");
      return;
    }
  
    const id = user.id;
    this.fetchgetMesCampagnes(); // Ajoute cette ligne pour récupérer les campagnes dès l'initialisation
  }
  

  // getUserInfo(): void {
  //   this.authService.getUserInfo().subscribe({
      
  //     next: (userInfo: any) => {
  //       console.log(localStorage.getItem('token'));
  //       console.log('User info:', userInfo); // Pour vérifier dans la console
  //       this.user = userInfo; // Stocker les informations de l'utilisateur
  //       console.log("Utilisateur connecté :", userInfo); // Pour vérifier dans la console
        
  //       this.organisateurId = userInfo.organisateur?.id || null;
  //       this.structureId = userInfo.organisateur?.structure_transfusion_sanguin_id || null;
  
  //       this.fetchCampagnesByOrganisateur();
  //     },
  //     error: (error: any) => {
  //       console.error('Erreur lors de la récupération des informations utilisateur:', error);
  //     }
  //   });
  // }
  
  

  logout(): void {
    this.authService.logout();
  }

  fetchgetMesCampagnes(): void {
    console.log('[fetchCampagnes] Appel au service pour récupérer les campagnes...');
    this.campagneService.getCampagnes().subscribe({
      next: (response: any) => {
        this.campagnes = response.data;
        console.log('[fetchgetMesCampagnes] Données reçues du backend:', this.campagnes);
        this.filteredCampagnes = this.campagnes;
        this.filterCampagnes(); // Filtrer les campagnes en fonction de la date
      },
      error: (error: any) => {
        console.error('[fetchgetMesCampagnes] Erreur lors de la récupération des campagnes:', error);
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: 'Impossible de charger les campagnes. Veuillez réessayer plus tard.',
        });
      }
    });
  }
  
  
  
  

  fetchCampagnesByOrganisateur(): void {
    const organisateurId = this.authService.organisateurId;
    if (!organisateurId) return; // sécurité
  
    this.organisateurService.getCampagnesByOrganisateurId(organisateurId).subscribe({
      next: (data) => {
        this.campagnes = data;
        this.filteredCampagnes = this.campagnes;
        this.filterCampagnes();
      },
      error: (error) => {
        console.error('Erreur lors de la récupération des campagnes:', error);
        this.handleError(error);
      }
    });
  }
  

  fetchCampagnesByStructure(structureId: number): void {
    this.campagneService.getCampagnesByStructureId(structureId).subscribe({
      next: (data) => {
        this.campagnes = data;
        this.filteredCampagnes = this.campagnes;
        this.filterCampagnes();
      },
      error: (error) => {
        console.error('Error fetching structure campagnes:', error);
        this.handleError(error);
      }
    });
  }

  getCampagneDetails(campagneId: number): void {
    this.campagneService.getCampagneById(campagneId).subscribe({
      next: (data) => {
        console.log('Campagne details:', data);
        // Process the details as needed
      },
      error: (error) => {
        console.error('Error fetching campagne details:', error);
        this.handleError(error);
      }
    });
  }

  applyFilter(): void {
    if (this.searchTerm) {
      this.filteredCampagnes = this.campagnes.filter((campagne) =>
        campagne.theme.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        campagne.lieu.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        campagne.participant.toString().includes(this.searchTerm)
      );
    } else {
      this.filteredCampagnes = this.campagnes;
    }
  }

  sortBy(key: string): void {
    if (this.sortKey === key) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortKey = key;
      this.sortDirection = 'asc';
    }

    this.filteredCampagnes = this.filteredCampagnes.sort((a, b) => {
      let compareA = a[key as keyof Campagne];
      let compareB = b[key as keyof Campagne];

      if (typeof compareA === 'number' && typeof compareB === 'number') {
        return this.sortDirection === 'asc' ? compareA - compareB : compareB - compareA;
      }

      compareA = (compareA as string).toLowerCase();
      compareB = (compareB as string).toLowerCase();

      return this.sortDirection === 'asc'
        ? compareA.localeCompare(compareB)
        : compareB.localeCompare(compareA);
    });
  }

  resetFilters(): void {
    this.filteredCampagnes = this.campagnes;
    this.searchTerm = '';
    this.sortKey = '';
    this.sortDirection = 'asc';
  }

  filterCampagnes(): void {
    if (!Array.isArray(this.campagnes)) {
      console.error('Les campagnes ne sont pas un tableau:', this.campagnes);
      this.todayCampagnes = [];
      this.upcomingCampagnes = [];
      this.pastCampagnes = [];
      return;
    }
  
    const today = new Date();
    today.setHours(0, 0, 0, 0);
  
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
  
    this.todayCampagnes = this.campagnes.filter((campagne) => {
      const campagneDate = new Date(campagne.date_debut);
      return campagneDate.getTime() >= today.getTime() && campagneDate.getTime() < tomorrow.getTime();
    });
  
    this.upcomingCampagnes = this.campagnes.filter((campagne) => {
      const campagneDate = new Date(campagne.date_debut);
      return campagneDate.getTime() >= tomorrow.getTime();
    });
  
    this.pastCampagnes = this.campagnes.filter((campagne) => {
      const campagneDate = new Date(campagne.date_debut);
      return campagneDate.getTime() < today.getTime();
    });
  }
  
  toggleForm(): void {
    this.showForm = true;
    this.isEditing = false;
    this.campagneForm.reset();
    
    // Set default values if needed, like current user as organisateur
    if (this.organisateurId) {
      this.campagneForm.patchValue({
        organisateur_id: this.organisateurId
      });
    }
  }

  cancelForm(): void {
    this.showForm = false;
    this.campagneForm.reset();
  }

  editCampagne(campagne: Campagne): void {
    this.showForm = true;
    this.isEditing = true;
    this.editingCampagneId = campagne.id;
    this.campagneForm.patchValue(campagne);
  }
  
  validerParticipation(participationId: number): void {
    Swal.fire({
      title: 'Valider la participation ?',
      text: 'Confirmez-vous cette participation à la campagne ?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Oui, valider',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        this.campagneService.validerParticipation(participationId).subscribe({
          next: () => {
            Swal.fire('Succès', 'Participation validée avec succès.', 'success');
            this.fetchgetMesCampagnes(); 
          },
          error: (error) => {
            console.error('Erreur validation participation :', error);
            Swal.fire('Erreur', 'Impossible de valider la participation.', 'error');
          }
        });
      }
    });
  }
  
  validerCampagne(campagneId: number): void {
    Swal.fire({
      title: 'Valider la campagne ?',
      text: 'Êtes-vous sûr de vouloir valider cette campagne ?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Oui, valider',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        this.campagneService.validerCampagne(campagneId).subscribe({
          next: () => {
            Swal.fire('Succès', 'Campagne validée avec succès.', 'success');
            this.fetchgetMesCampagnes();
          },
          error: (error) => {
            console.error('Erreur validation campagne :', error);
            Swal.fire('Erreur', 'Impossible de valider la campagne.', 'error');
          }
        });
      }
    });
  }
  
  getParticipants(campagneId: number): void {
    this.campagneService.getParticipants(campagneId).subscribe({
      next: (participants) => {
        console.log('Participants:', participants);
        // Process participants data here
        // You might want to store it in a class property or pass it to another method
      },
      error: (error) => {
        console.error('Error fetching participants:', error);
        this.handleError(error);
      }
    });
  }
  
  onSubmit(): void {
    if (this.campagneForm.valid) {
      if (this.isEditing && this.editingCampagneId !== null) {
        this.campagneService.updateCampagne(this.editingCampagneId, this.campagneForm.value).subscribe(
          (response) => {
            console.log('Campagne updated successfully', response);
            this.fetchgetMesCampagnes();
            this.cancelForm();
            Swal.fire('Succès', 'La campagne a été mise à jour avec succès.', 'success');
          },
          (error) => {
            console.error('Error updating campagne:', error);
            this.handleError(error);
          }
        );
      } else {
        this.campagneService.createCampagne(this.campagneForm.value).subscribe(
          (response) => {
            console.log('Campagne added successfully', response);
            this.fetchgetMesCampagnes();
            this.campagneForm.reset();
            this.showForm = false;
            Swal.fire('Succès', 'La campagne a été ajoutée avec succès.', 'success');
          },
          (error) => {
            console.error('Error adding campagne:', error);
            this.handleError(error);
          }
        );
      }
    } else {
      Swal.fire('Erreur', 'Veuillez remplir tous les champs requis.', 'error');
    }
  }

  navigateToDetail(campagneId: number): void {
    this.router.navigate(['/campagne', campagneId]);
  }

  viewParticipants(campagneId: number): void {
    this.router.navigate(['/campagne', campagneId, 'participants']);
  }

  deleteCampagne(campagneId: number): void {
    Swal.fire({
      title: 'Êtes-vous sûr?',
      text: 'Vous ne pourrez pas annuler cette action!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        this.campagneService.deleteCampagne(campagneId).subscribe(
          (response) => {
            Swal.fire('Supprimé!', 'La campagne a été supprimée.', 'success');
            this.fetchgetMesCampagnes();
          },
          (error) => {
            this.handleError(error);
          }
        );
      }
    });
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('An error occurred:', error);
    Swal.fire('Erreur', 'Une erreur est survenue, veuillez réessayer plus tard.', 'error');
    return throwError(() => new Error('Something went wrong. Please try again later.'));
  }
  
  // Méthode pour rediriger vers la page de création de campagne
  navigateToCreateCampagne(): void {
    this.router.navigate(['/campagne/publier']);
  }
}
