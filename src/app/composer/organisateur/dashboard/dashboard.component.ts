import { Component, ElementRef, AfterViewInit, ViewChild, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, registerables } from 'chart.js';
import { OrganisateurService } from '../../../services/organisateur.service';
import { AuthService } from '../../../services/auth.service';
import { CampagneService } from '../../../services/campagne.service';
import { Campagne } from '../../../models/campagne';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { DashboardOrganisateurService } from '../../../services/dashboard-organisateur.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements AfterViewInit, OnInit {

  activeTab = 'overview';
  organisateur: any = null;

  requestsData: any[] = [];  // Demandes (à ne pas confondre avec urgentRequests)
  upcomingCampaigns: any[] = [];
  pastCampaigns: any[] = [];
  urgentRequests: any[] = [];
  stats: any = {};
  campagnesParMois: any[] = [];
  donneursParGroupe: any[] = [];
  filteredCampagnes: Campagne[] = [];
  campagnes: any[] = [];
  showForm: boolean = true;
  isEditing: boolean = true;
  editingCampagneId: number | null = null;
  campagnesPassees: any[] = [];
  donsParMois: any[] = [];
  donsParRegion: any[] = [];


  @ViewChild('lineCanvas') lineCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('pieCanvas') pieCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('barCanvas') barCanvas!: ElementRef<HTMLCanvasElement>;

  constructor(
    private organisateurService: OrganisateurService,
    private authService: AuthService,
    private campagneService: CampagneService,
    private dashboardService: DashboardOrganisateurService,
    private router: Router
  ) {
    Chart.register(...registerables);
  }

  ngOnInit(): void {
    this.organisateur = this.authService.getUser();
    console.log('Utilisateur connecté :', this.organisateur);
    this.loadDashboardData();
  }

  ngAfterViewInit(): void {
    this.createLineChart([], []);
    this.createPieChart();
    this.createBarChart();
  }

  fetchCampagnesByOrganisateur(): void {
    this.organisateurService.getMesCampagnes().subscribe({
      next: (data) => {
        this.campagnes = data.campagnes || data;
        this.filteredCampagnes = this.campagnes;
      },
      error: (error) => {
        console.error('Erreur lors de la récupération des campagnes:', error);
        this.handleError(error);
      }
    });
  }

  loadDashboardData(): void {
    // 1. Récupérer les campagnes
    this.organisateurService.getMesCampagnes().subscribe({
      next: (data: any) => {
        // S'assurer que nous avons un tableau, même si vide
        this.campagnes = data.data || data || [];
        console.log('Campagnes récupérées:', this.campagnes);
        
        // Filtrer les campagnes à venir et passées
        const today = new Date();
        this.upcomingCampaigns = this.campagnes.filter(c => new Date(c.date_debut) >= today);
        this.pastCampaigns = this.campagnes.filter(c => new Date(c.date_fin) < today);
        
        // Mettre à jour les campagnes filtrées (utilisé dans l'onglet 'Mes Campagnes')
        this.filteredCampagnes = this.campagnes;
      },
      error: (error) => {
        console.error('Erreur lors de la récupération des campagnes:', error);
        this.campagnes = [];
        this.upcomingCampaigns = [];
        this.pastCampaigns = [];
        this.filteredCampagnes = [];
      }
    });

    // 2. Récupérer les campagnes passées via le service dashboardService
    this.dashboardService.campagnesPassees().subscribe({
      next: (res: any) => {
        this.campagnesPassees = res.data || res.campagnes || [];
        console.log('Campagnes passées:', this.campagnesPassees);
      },
      error: (error) => {
        console.error('Erreur lors de la récupération des campagnes passées:', error);
        this.campagnesPassees = [];
      }
    });

    // 3. Récupérer les demandes urgentes
    this.dashboardService.demandesUrgentes().subscribe({
      next: (data: any) => {
        this.urgentRequests = data.data || data || [];
        console.log('Demandes urgentes:', this.urgentRequests);
      },
      error: (error) => {
        console.error('Erreur lors de la récupération des demandes urgentes:', error);
        this.urgentRequests = [];
      }
    });

    // 4. Récupérer les statistiques générales
    this.dashboardService.statistiquesGenerales().subscribe({
      next: (data: any) => {
        this.stats = data.data || data || {};
        console.log('Statistiques:', this.stats);
      },
      error: (error) => {
        console.error('Erreur lors de la récupération des statistiques:', error);
        this.stats = {};
      }
    });

    // 5. Récupérer toutes les demandes (pas seulement les urgentes)
    this.dashboardService.getDemandesParOrganisateur().subscribe({
      next: (data: any) => {
        console.log('Demandes récupérées :', data);
        
        // Vérifier la structure des données retournées
        if (Array.isArray(data)) {
          this.requestsData = data;
        } else if (data && data.data && Array.isArray(data.data)) {
          this.requestsData = data.data;
        } else if (data && data.demandes && Array.isArray(data.demandes)) {
          this.requestsData = data.demandes;
        } else {
          console.warn('Format inattendu pour les demandes:', data);
          this.requestsData = [];
        }
        
        console.log('Demandes traitées:', this.requestsData);
      },
      error: (err) => {
        console.error("Erreur lors de la récupération des demandes :", err);
        this.requestsData = [];
      }
    });

    // Appel existant pour getDonsParMois
  this.dashboardService.getDonsParMois().subscribe({
    next: (data: any) => {
      this.donsParMois = data;
      const mois = data.map((d: any) => d.mois);
      const valeurs = data.map((d: any) => d.total_dons);
      this.createLineChart(mois, valeurs);
    },
    error: (err) => {
      console.error("Erreur lors de la récupération des dons par mois :", err);
      this.donsParMois = [];
      this.createLineChart([], []);
    }
  });

  this.dashboardService.getDonsParRegion().subscribe({
    next: (data: any) => {
      this.donsParRegion = data;
      console.log('Dons par région:', this.donsParRegion);
      const regions = data.map((d: any) => d.region);
      const totals = data.map((d: any) => d.total);
      this.createBarChart(regions, totals);
    },
    error: (err) => {
      console.error("Erreur lors de la récupération des dons par région :", err);
      this.donsParRegion = [];
      this.createBarChart([], []);
    }
  });

   this.dashboardService.donneursParGroupe().subscribe({
    next: (data: any) => {
      this.donneursParGroupe = data;
      console.log('Donneurs par groupe sanguin:', this.donneursParGroupe);
      const groupes = data.map((d: any) => d.groupe_sanguin);
      const totals = data.map((d: any) => d.total);
      this.createPieChart(groupes, totals);
    },
    error: (err) => {
      console.error("Erreur lors de la récupération des donneurs par groupe sanguin :", err);
      this.donneursParGroupe = [];
      this.createPieChart([], []);
    }
  });
}
// Méthode mise à jour pour accepter des paramètres
createPieChart(labels: string[] = [], data: number[] = []): void {
  // Utiliser les données fournies ou des données par défaut si vides
  const finalLabels = labels.length ? labels : ['O+', 'A+', 'B+', 'AB+', 'O-', 'A-', 'B-', 'AB-'];
  const finalData = data.length ? data : [30, 20, 15, 10, 5, 10, 5, 5];
  
  new Chart(this.pieCanvas.nativeElement, {
    type: 'pie',
    data: {
      labels: finalLabels,
      datasets: [{
        data: finalData,
        backgroundColor: [
          '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0',
          '#9966FF', '#FF9F40', '#E7E9ED', '#B0BEC5'
        ]
      }]
    },
    options: { responsive: true }
  });
}

// Méthode mise à jour pour accepter des paramètres
createBarChart(labels: string[] = [], data: number[] = []): void {
  // Utiliser les données fournies ou des données par défaut si vides
  const finalLabels = labels.length ? labels : ['Dakar', 'Pikine', 'Thies', 'Saint-Louis', 'Ziguinchor'];
  const finalData = data.length ? data : [100, 80, 60, 40, 30];
  
  new Chart(this.barCanvas.nativeElement, {
    type: 'bar',
    data: {
      labels: finalLabels,
      datasets: [{
        label: 'Dons par région',
        data: finalData,
        backgroundColor: '#42A5F5'
      }]
    },
    options: { responsive: true }
  });


  }

  filterCampagnes(status: string): void {
    this.filteredCampagnes = this.upcomingCampaigns.filter(c => c.statut === status);
  }

  redirectToNewCampagne(): void {
    this.router.navigate(['/campagnes/publier']);
  }

  handleError(error: any): void {
    alert('Une erreur est survenue. Veuillez réessayer plus tard.');
  }

  createLineChart(labels: string[], data: number[]): void {
  new Chart(this.lineCanvas.nativeElement, {
    type: 'line',
    data: {
      labels: labels.length ? labels : ['Janv', 'Fév', 'Mars', 'Avril', 'Mai', 'Juin'],
      datasets: [{
        label: 'Dons collectés',
        data: data.length ? data : [0, 0, 0, 0, 0, 0],
        fill: true,
        borderColor: '#4CAF50',
        backgroundColor: 'rgba(76, 175, 80, 0.3)',
        tension: 0.4
      }]
    },
    options: { responsive: true }
  });
}


//   createPieChart(): void {
//     new Chart(this.pieCanvas.nativeElement, {
//       type: 'pie',
//       data: {
//         labels: ['O+', 'A+', 'B+', 'AB+', 'O-', 'A-', 'B-', 'AB-'],
//         datasets: [{
//           data: [30, 20, 15, 10, 5, 10, 5, 5],
//           backgroundColor: [
//             '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0',
//             '#9966FF', '#FF9F40', '#E7E9ED', '#B0BEC5'
//           ]
//         }]
//       },
//       options: { responsive: true }
//     });
//   }

//   createBarChart(): void {
//     new Chart(this.barCanvas.nativeElement, {
//       type: 'bar',
//       data: {
//         labels: ['Dakar', 'Pikine', 'Thies', 'Saint-Louis', 'Ziguinchor'],
//         datasets: [{
//           label: 'Dons par région',
//           data: [100, 80, 60, 40, 30],
//           backgroundColor: '#42A5F5'
//         }]
//       },
//       options: { responsive: true }
//     });
//   }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  /**
   * Retourne une classe CSS Bootstrap selon le statut médical.
   * @param status - Le statut du patient (critique, urgent, stable, etc.).
   * @returns La classe CSS correspondante.
   */
  getStatusClass(status: string | null | undefined): string {
    if (!status) return 'bg-secondary text-white';
    switch (status.toLowerCase()) {
      case 'critique': return 'bg-danger text-white';
      case 'urgent': return 'bg-warning text-dark';
      case 'stable': return 'bg-success text-white';
      default: return 'bg-secondary text-white';
    }
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: () => {
        console.log('Déconnexion réussie');
      },
      error: (error) => {
        console.error('Erreur lors de la déconnexion', error);
      },
      complete: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        sessionStorage.clear();
        this.router.navigate(['/login']);
      }
    });
  }

  deleteCampagne(id: number): void {
    console.log('Suppression campagne id :', id);
  }

  validerCampagne(id: number): void {
    console.log('Validation campagne id :', id);
  }

  viewParticipants(id: number): void {
    console.log('Afficher les participants pour la campagne id :', id);
  }

  navigateToDetail(id: number): void {
    this.router.navigate(['/campagnes/detail', id]);
  }

  editCampagne(campagne: Campagne): void {
    console.log('Édition de la campagne :', campagne);
    this.editingCampagneId = campagne.id;
    this.showForm = true;
  }
}