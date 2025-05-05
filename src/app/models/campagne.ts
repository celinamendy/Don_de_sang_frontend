// models/campagne.model.ts
export interface Campagne {
    id: number;
    theme: string;
    description: string;
    lieu: string;
    date_debut: string;     // ISO
    date_fin: string;
    Heure_debut: string;
    Heure_fin: string;
    participant: number;
    statut: string;
    organisateur_id: number;
    structure_transfusion_sanguin_id: number;
    isUserRegistered?: boolean;
  }
  