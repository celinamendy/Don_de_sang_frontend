import { Routes } from '@angular/router';
import { ConnexionComponent } from './composer/connexion/connexion.component';
import { AccueilComponent } from './composer/accueil/accueil.component'
import { DashboardComponent } from './composer/donateur/dashboard/dashboard.component';
import { CampagneComponent } from './composer/campagne/campagne.component';
import { PublierComponent } from './composer/campagne/publier/publier.component';
import { ListesComponent } from './composer/campagne/listes/listes.component';
import { MesCampagnesComponent } from './composer/organisateur/dashboard/mes-campagnes/mes-campagnes.component';
import { HistoriquesComponent } from './composer/donateur/historiques/historiques.component';
import { RegisterComponent } from './composer/register/register.component';
// ✅ Correct
// import { DetailComponent } from './composer/campagne/detail.component';
export const routes: Routes = [
    { path: '', redirectTo: 'accueil', pathMatch: 'full' }, // Redirection par défaut vers 'accueil'
    { path: 'accueil', component: AccueilComponent },
    { path: 'inscription', component: RegisterComponent },
    { path: 'connexion', loadComponent: () => import('./composer/connexion/connexion.component').then(m => m.ConnexionComponent) },
    { path: 'donateur/dashboard', loadComponent: () => import('./composer/donateur/dashboard/dashboard.component').then(m => m.DashboardComponent) },
    { path: 'campagnes', component: CampagneComponent },
    { path: 'campagnes/publier', component: PublierComponent }, // Route pour publier une campagne
    { path: 'liste', component: ListesComponent }, // Route pour publier une campagne
    // { path: 'organisateur/dashboard', loadComponent: () => import('./composer/organisateur/dashboard/dashboard.component').then(m => m.DashboardComponent) },
    { path: 'historique', component: HistoriquesComponent },
    // Organisateur Dashboard
  { path: 'organisateurs/dashboard', loadComponent: () => import('./composer/organisateur/dashboard/dashboard.component').then(m => m.DashboardComponent) },
  { path: 'mes-campagnes',component: MesCampagnesComponent},

    { path: '**', redirectTo: 'accueil' } // Redirection pour les routes inconnues
  ];
