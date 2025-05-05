import { Component ,OnInit} from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';


@Component({
  selector: 'app-accueil',
  standalone: true,
  imports: [
    CommonModule,
    NgIf, HttpClientModule
  ],
  templateUrl: './accueil.component.html',
  styleUrl: './accueil.component.css'
})
export class AccueilComponent implements OnInit {
  isLoggedIn: boolean = false;
  isDonateur: boolean = false;
  constructor(private router: Router) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    this.isLoggedIn = !!token;

    const role = localStorage.getItem('role');
    this.isDonateur = role === 'donateur';
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    this.isLoggedIn = false;
    this.isDonateur = false;
    this.router.navigate(['/connexion']);
  }

  goToLogin(): void {
    this.router.navigate(['/connexion']);
  }

  goToRegister(): void {
    this.router.navigate(['/register']);
  }
}