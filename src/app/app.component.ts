import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

// import { ConnexionComponent } from './composer/connexion/connexion.component';
// import { AuthService } from './services/auth.service';
// import { AccueilComponent } from './composer/accueil/accueil.component';

// import { CampagneComponent } from './composer/campagne/campagne.component';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'frontend';
}
