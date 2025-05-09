// models/donateur.model.ts

// src/app/models/donateur.model.ts

export interface Donateur {
  id: number;
  adresse: string;
  date_naissance: string;
  sexe: string;
  poids: string;
  antecedent_medicament: string;
  date_dernier_don: string;
  groupe_sanguin_id: number;
  user: {
    id: number;
    nom: string;
    telephone: string;
    email: string;
    region_id: number;
  };
}


interface ApiResponse {
  status: boolean;
  message: string;
  data: Donateur;
}
