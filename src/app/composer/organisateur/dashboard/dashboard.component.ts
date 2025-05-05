import { Component, ElementRef, AfterViewInit, ViewChild, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, registerables } from 'chart.js';
import { OrganisateurService } from '../../../services/organisateur.service';
import { AuthService } from '../../../services/auth.service';
import { CampagneService } from '../../../services/campagne.service';
import { Campagne } from '../../../models/campagne';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements AfterViewInit, OnInit {

  activeTab = 'overview';
  organisateur: any = null;

  requestsData: any[] = [];
  upcomingCampaigns: any[] = [];
  pastCampaigns: any[] = [];
  urgentRequests: any[] = [];
  stats: any = {};
  filteredCampagnes: Campagne[] = [];
  campagnes: any[] = [];
  showForm: boolean = true;
  isEditing: boolean = true;
  editingCampagneId: number | null = null;

  @ViewChild('lineCanvas') lineCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('pieCanvas') pieCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('barCanvas') barCanvas!: ElementRef<HTMLCanvasElement>;

  constructor(
    private organisateurService: OrganisateurService,
    private authService: AuthService,
    private campagneService: CampagneService,
    private router: Router
  ) {
    Chart.register(...registerables);
  }

  ngOnInit(): void {
    this.organisateur = this.authService.getUser();
    console.log('Utilisateur connecté :', this.organisateur);
    // this.fetchCampagnesByOrganisateur();
  }

  ngAfterViewInit(): void {
    this.createLineChart();
    this.createPieChart();
    this.createBarChart();
    this.loadDashboardData();
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

  // loadDashboardData(): void {
  //   this.organisateurService.getMesCampagnes().subscribe((data: any) => {
  //     this.upcomingCampaigns = data;
  //   });
  loadDashboardData(): void {
    this.organisateurService.getMesCampagnes().subscribe((data: any) => {
      this.campagnes = data.campagnes || data;
      this.filteredCampagnes = this.campagnes;
      this.upcomingCampaigns = this.campagnes.filter(c => new Date(c.date_debut) >= new Date());
      this.pastCampaigns = this.campagnes.filter(c => new Date(c.date_fin) < new Date());
      this.requestsData = this.campagnes;
    });

    this.organisateurService.getCampagnesPassees().subscribe((data: any) => {
      this.pastCampaigns = data;
    });

    this.organisateurService.getDemandesUrgentes().subscribe((data: any) => {
      this.urgentRequests = data;
    });

    this.organisateurService.getStatistiques().subscribe((data: any) => {
      this.stats = data;
    });

    this.organisateurService.getMesCampagnes().subscribe((data: any) => {
      this.requestsData = data.campagnes || data;
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

  createLineChart(): void {
    new Chart(this.lineCanvas.nativeElement, {
      type: 'line',
      data: {
        labels: ['Janv', 'Fév', 'Mars', 'Avril', 'Mai', 'Juin'],
        datasets: [{
          label: 'Dons collectés',
          data: [50, 70, 40, 90, 60, 80],
          fill: true,
          borderColor: '#4CAF50',
          backgroundColor: 'rgba(76, 175, 80, 0.3)',
          tension: 0.4
        }]
      },
      options: { responsive: true }
    });
  }

  createPieChart(): void {
    new Chart(this.pieCanvas.nativeElement, {
      type: 'pie',
      data: {
        labels: ['O+', 'A+', 'B+', 'AB+', 'O-', 'A-', 'B-', 'AB-'],
        datasets: [{
          data: [30, 20, 15, 10, 5, 10, 5, 5],
          backgroundColor: [
            '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0',
            '#9966FF', '#FF9F40', '#E7E9ED', '#B0BEC5'
          ]
        }]
      },
      options: { responsive: true }
    });
  }

  createBarChart(): void {
    new Chart(this.barCanvas.nativeElement, {
      type: 'bar',
      data: {
        labels: ['Dakar', 'Pikine', 'Thies', 'Saint-Louis', 'Ziguinchor'],
        datasets: [{
          label: 'Dons par région',
          data: [100, 80, 60, 40, 30],
          backgroundColor: '#42A5F5'
        }]
      },
      options: { responsive: true }
    });
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  getStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'critique': return 'bg-danger text-white';
      case 'urgent': return 'bg-warning text-dark';
      case 'stable': return 'bg-success text-white';
      default: return 'bg-secondary text-white';
    }
  }

  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
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
