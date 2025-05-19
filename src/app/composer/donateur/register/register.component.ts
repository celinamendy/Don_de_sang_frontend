// import { Component,OnInit } from '@angular/core';
// import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
// import { CommonModule } from '@angular/common';
// import { GroupeSanguinService } from '../../../services/groupe-sanguin.service';
// import { RegionService } from '../../../services/region.service';
// import { DonateurService } from './../../../services/donateur.service';
// import { AuthService } from '../../../services/auth.service';
// import Swal from 'sweetalert2';

// @Component({
//   selector: 'app-register',
//   standalone: true,
//   imports: [ReactiveFormsModule, CommonModule],
//   templateUrl: './register.component.html',
//   styleUrl: './register.component.css'
// })
// export class RegisterComponent implements OnInit {
//  registerForm!: FormGroup;
//   groupesSanguins: any[] = [];
//   regions: any[] = [];
// user: any;

//   constructor(
//     private fb: FormBuilder,
//     private groupeSanguinService: GroupeSanguinService,
//     private regionService: RegionService,
//     private donateurService: DonateurService,
//     private authService : AuthService
//   ) {}

//   ngOnInit(): void {
//     this.registerForm = this.fb.group({
//       prenom: ['', Validators.required],
//       nom: ['', Validators.required],
//       email: ['', [Validators.required, Validators.email]],
//       date_naissance: ['', Validators.required],
//       password: ['', [Validators.required, Validators.minLength(6)]],
//       sexe: ['', Validators.required],
//       adresse: ['', Validators.required],
//       groupe_sanguin_id: ['', Validators.required],
//       region_id: ['', Validators.required],
//       telephone: ['', [Validators.required, Validators.pattern(/^\+?\d{7,15}$/)]],
//       dernier_don: ['']
//     });

//     this.loadGroupesSanguins();
//     this.loadRegions();
//   }

//   loadGroupesSanguins(): void {
//     this.groupeSanguinService.getAll().subscribe(data => {
//       this.groupesSanguins = data;
//     });
//   }

//   loadRegions(): void {
//     this.regionService.getAll().subscribe(data => {
//       this.regions = data;
//     });
//   }

// onSubmit(): void {
//   if (this.registerForm.valid) {
//     const formData = this.registerForm.value;

//     // Transformation des dates au bon format
//     const [dd, mm, yyyy] = formData.date_naissance.split('/');
//     formData.date_naissance = `${yyyy}-${mm}-${dd}`;

//     if (formData.dernier_don) {
//       const [d, m, y] = formData.dernier_don.split('/');
//       formData.dernier_don = `${y}-${m}-${d}`;
//     }

//     this.authService.register(formData).subscribe({
//       next: (response) => {
//         console.log('Inscription réussie', response);
//         Swal.fire('Succès', 'Inscription réussie !', 'success');
//         this.registerForm.reset();
//       },
//       error: err => {
//         console.error(err); // ← pour afficher tous les détails
//         Swal.fire('Erreur', err.error.message || 'Erreur lors de l\'inscription.', 'error');
//       }
//     });
//   } else {
//     Swal.fire('Formulaire invalide', 'Merci de remplir tous les champs obligatoires.', 'warning');
//   }
// }

// }
