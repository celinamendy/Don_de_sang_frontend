  import { Component, OnInit } from '@angular/core';
  import { CommonModule } from '@angular/common';
  import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, ValidationErrors, FormsModule } from '@angular/forms';
  import { Router } from '@angular/router';
  import { HttpClientModule } from '@angular/common/http';
  import Swal from 'sweetalert2';
  import { AuthService } from '../../../services/auth.service';
  import { CampagneService } from '../../../services/campagne.service';
  import { StructureService } from '../../../services/structure.service';
  import { OrganisateurService } from '../../../services/organisateur.service';

  @Component({
    selector: 'app-publier',
    standalone: true,
    imports: [ CommonModule, ReactiveFormsModule, HttpClientModule ,FormsModule ],
    providers : [
      StructureService,OrganisateurService,CampagneService
    ],
    templateUrl: './publier.component.html',
    styleUrls: ['./publier.component.css'] 
  })
  export class PublierComponent implements OnInit {
  isEditing: any;
  showForm: any;
    user: any;
  cancelForm() {
    this.showForm = true; // Cache le formulaire
    this.router.navigate(['/campagnes']); // Redirige vers une autre page
  // throw new Error('Method not implemented.');
  }
    campagnes: any[] = [];
    campagneForm: FormGroup;
    organisateur: any;
    structure: any;


    constructor(
      private fb: FormBuilder,
      private authService: AuthService,
      private campagneService: CampagneService,
      private router: Router
    
    ) {
      console.log('Initialisation du formulaire ne passe pas encore chargement du formulaire ...');
      this.campagneForm = this.fb.group({
        theme: ['', [Validators.required, Validators.minLength(3)]],
        description: ['', Validators.required],
        lieu: ['', Validators.required],
        date_debut: ['', Validators.required],
        date_fin: ['', Validators.required],
        Heure_debut: ['', Validators.required],
        Heure_fin: ['', Validators.required],
        participant: [null, [Validators.required, Validators.min(1)]],
        statut: ['en attente', Validators.required],
        structure_transfusion_sanguin_id: ['', Validators.required], 

      }, {
        validators: [this.dateCoherenceValidator]
      });
      console.log('Formulaire initialisé avec succé...');
    }
    dateCoherenceValidator(group: FormGroup): ValidationErrors | null {
      const dateDebut = new Date(group.get('date_debut')?.value);
      const dateFin = new Date(group.get('date_fin')?.value);
      const heureDebut = group.get('Heure_debut')?.value;
      const heureFin = group.get('Heure_fin')?.value;
    
      if (dateFin < dateDebut) {
        return { dateIncoherente: true };
      }
    
      if (dateFin.getTime() === dateDebut.getTime() && heureFin <= heureDebut) {
        return { heureIncoherente: true };
      }
    
      return null;
    }

    ngOnInit(): void {
      this.user = this.authService.getUser(); // Récupérer l'utilisateur connecté
    
      const role = this.authService.getRole()?.toLowerCase();
      console.log('Rôle récupéré :', role);
    
      if (role !== 'organisateur') {
        Swal.fire({
          icon: 'error',
          title: 'Accès refusé',
          text: 'Vous devez vous connecter en tant qu’organisateur',
        });
        this.router.navigate(['/login']);
        return;
      }
    
      console.log("Utilisateur récupéré :", this.user);
    }
    loadOrganisateur() {
      const user = this.authService.getUser();
      console.log('Erreurs du formulaire :', this.campagneForm.errors);
      if (user && user.organisateur) {
        this.organisateur = user.organisateur;
        console.log('Organisateur est bien connecté :', this.organisateur);
      } else {
        console.warn('Aucun organisateur trouvé.');
      }
    }


    onSubmit() {
      if (this.campagneForm.invalid) {
        console.warn('Formulaire non valide', this.campagneForm);
        return;
      }

      const formData = this.campagneForm.value;
      const organisateurId = this.user.organisateur_id;
      formData.structure_transfusion_sanguin_id = this.campagneForm.get('structure_transfusion_sanguin_id')?.value;
      formData.statut = 'en attente'; // Statut par défaut
      console.log('Données à envoyer :', formData);

      this.campagneService.createCampagne(formData).subscribe({
        next: (response: any) => {
          console.log('Campagne ajoutée :', response);
          Swal.fire({
            icon: 'success',
            title: 'Succès',
            text: 'La campagne a été publiée avec succès.',
            timer: 2000,
            showConfirmButton: true
          });

          setTimeout(() => {
            this.router.navigate(['/mes-campagnes']);
          }, 2000);
        },
        error: (err: any) => {
          console.error('Erreur lors de la publication', err);
          Swal.fire({
            icon: 'error',
            title: 'Erreur',
            text: 'Impossible de publier la campagne.',
          });
        }
      });
    }
  }
