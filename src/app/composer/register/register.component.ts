import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';
import { AuthService } from '../../services/auth.service';
import { RegionService } from '../../services/region.service';
import { GroupeSanguinService } from '../../services/groupe-sanguin.service';
import { StructureService } from '../../services/structure.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  loading = false;
  submitted = false;
  error = '';
  
  roles = [
    { id: 'donateur', name: 'Donateur' },
    { id: 'organisateur', name: 'Organisateur' },
    { id: 'structure_transfusion_sanguin', name: 'Structure de Transfusion Sanguin' }
  ];
  
  regions: any[] = [];
  groupesSanguins: any[] = [];
  structures: any[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private regionService: RegionService,
    private groupeSanguinService: GroupeSanguinService,
    private structureService: StructureService
  ) {
    this.registerForm = this.formBuilder.group({
      // Champs communs à tous les utilisateurs
      nom: ['', [Validators.required, Validators.maxLength(255)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.pattern(/[A-Z]/)]],
      // telephone: ['', [Validators.maxLength(20)]],
      telephone: ['', [Validators.required, Validators.pattern(/^\+?\d{7,15}$/)]],
      region_id: ['', Validators.required], 
      adresse: ['', Validators.required],
      type: ['donateur', Validators.required],
      
      // Champs spécifiques aux donateurs
      sexe: [''],
      date_naissance: [''],
      poids: [''],
      antecedent_medicament: [''],
      date_dernier_don: [''],
      groupe_sanguin_id: [''],
      
      // Champs spécifiques aux organisateurs
      nom_responsable: [''],
      type_organisation: [''],
      structure_transfusion_sanguin_id: [''],
      
      // Champs spécifiques aux structures
      type_entite: [''],
      
    });
  }

  ngOnInit(): void {
    // Charger les données nécessaires (régions, groupes sanguins, structures)
    this.loadRegions();
    this.loadGroupesSanguins();
    this.loadStructures();
    
    // Écouter les changements de type d'utilisateur pour ajuster les validateurs
    this.registerForm.get('type')?.valueChanges.subscribe(type => {
      this.updateValidators(type);
    });
    
    // Initialiser les validateurs pour le type par défaut
    this.updateValidators(this.registerForm.get('type')?.value);
  }

  loadRegions(): void {
      this.regionService.getAll().subscribe((data: any[]) => {
        this.regions = data;
      });
    }

    loadGroupesSanguins(): void {
    this.groupeSanguinService.getAll().subscribe((data: any[]) => {
      this.groupesSanguins = data;
    });
  }

  loadStructures(): void {
    this.structureService.getAllStructures().subscribe(
      (data: any[]) => this.structures = data,
      (error: any) => console.error('Erreur lors du chargement des structures:', error)
    );
  }

  updateValidators(type: string): void {
    // Réinitialiser tous les validateurs spécifiques
    const donateurFields = ['sexe', 'date_naissance', 'poids', 'antecedent_medicament', 'date_dernier_don', 'groupe_sanguin_id'];
    const organisateurFields = ['nom_responsable', 'type_organisation', 'structure_transfusion_sanguin_id'];
    const structureFields = ['nom_responsable', 'type_entite'];
    
    // Supprimer d'abord tous les validateurs spécifiques
    [...donateurFields, ...organisateurFields, ...structureFields].forEach(field => {
      this.registerForm.get(field)?.clearValidators();
      this.registerForm.get(field)?.updateValueAndValidity();
    });
    
    // Ajouter les validateurs en fonction du type sélectionné
    switch (type) {
      case 'donateur':
        this.registerForm.get('groupe_sanguin_id')?.setValidators([Validators.required]);
        break;
        
      case 'organisateur':
        this.registerForm.get('nom_responsable')?.setValidators([Validators.required]);
        this.registerForm.get('structure_transfusion_sanguin_id')?.setValidators([Validators.required]);
        break;
        
      case 'structure_transfusion_sanguin':
        this.registerForm.get('nom_responsable')?.setValidators([Validators.required]);
        this.registerForm.get('type_entite')?.setValidators([Validators.required]);
        break;
    }
    
    // Mettre à jour la validité
    [...donateurFields, ...organisateurFields, ...structureFields].forEach(field => {
      this.registerForm.get(field)?.updateValueAndValidity();
    });
  }

  // Getter pour faciliter l'accès aux champs du formulaire dans le template
  get f() { return this.registerForm.controls; }

  onSubmit(): void {
    this.submitted = true;

    // Si le formulaire est invalide, on arrête ici
    if (this.registerForm.invalid) {
      return;
    }

    this.loading = true;
    this.authService.register(this.registerForm.value)
      .subscribe({
       next: () => {
          Swal.fire({
            icon: 'success',
            title: 'Inscription réussie',
            text: 'Votre compte a été créé avec succès ! Vous allez être redirigé vers la page de connexion.',
            confirmButtonText: 'OK',
            timer: 3000,
            timerProgressBar: true
          }).then(() => {
            this.router.navigate(['/login'], { queryParams: { registered: true } });
          });
        },
        error: error => {
          this.error = error.error.message || 'Une erreur est survenue lors de l\'inscription';
          if (error.error.errors) {
             Swal.fire('Erreur', this.error, 'error');
            // Parcourir les erreurs de validation du backend
            Object.keys(error.error.errors).forEach(key => {
              const control = this.registerForm.get(key);
              if (control) {
                control.setErrors({ serverError: error.error.errors[key][0] });
              }
            });
          }
          this.loading = false;
        },
        complete: () => {
          this.loading = false;
        }
      });
  }
}