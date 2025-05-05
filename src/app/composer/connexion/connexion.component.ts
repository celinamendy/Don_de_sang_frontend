import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-connexion',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './connexion.component.html',
  styleUrl: './connexion.component.css'
})
export class ConnexionComponent implements OnInit {
  loginForm!: FormGroup;
  loading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  ngOnInit(): void {
    // const storedRole = localStorage.getItem('userRole')?.toLowerCase();

    // if (storedRole) {
    //   switch (storedRole) {
    //     case 'admin':
    //       this.router.navigate(['/admin/dashboard']);
    //       break;
    //     case 'donateur':
    //       this.router.navigate(['/donateur/dashboard']);
    //       break;
    //     case 'organisateur':
    //       this.router.navigate(['/organisateurs/dashboard']);
    //       break;
    //     case 'structure_transfusion_sanguin':
    //       this.router.navigate(['/structure/accueil']);
    //       break;
    //     default:
    //       this.router.navigate(['/']);
    //   }
    // }
  }

  onSubmit(): void {
    if (this.loginForm.invalid) return;
  
    this.loading = true;
    this.errorMessage = '';
  
    this.authService.login(this.loginForm.value).subscribe({
      next: (res) => {
        console.log('Réponse de login :', res);
  
        // Stocker le token, les rôles, l'utilisateur
        this.authService.handleLogin(res);
  
        // Récupérer le rôle principal
        const primaryRole = this.authService.getRole()?.toLowerCase();
        if (primaryRole) {
          this.redirectUser(primaryRole);
        } else {
          this.errorMessage = 'Rôle utilisateur inconnu.';
        }

        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.error?.message || 'Une erreur est survenue lors de la connexion.';
      }
    });
  }
  private redirectUser(role: string): void {
    switch (role) {
      case 'admin':
        this.router.navigate(['/admin/dashboard']);
        break;
      case 'donateur':
        this.router.navigate(['/donateur/dashboard']);
        break;
      case 'organisateur':
        this.router.navigate(['/organisateurs/dashboard']);
        break;
      case 'structure_transfusion_sanguin':
        this.router.navigate(['/structure/accueil']);
        break;
      default:
        this.router.navigate(['/']);
    }
  }
}