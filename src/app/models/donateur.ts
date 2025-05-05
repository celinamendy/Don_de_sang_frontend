// models/donateur.model.ts


// export interface Donateur {
//   id: number;
//   adresse: string;
//   date_naissance: string; // en ISO string
//   sexe: 'M' | 'F';
//   poids: string;
//   antecedent_medicament: 'Aucun' | 'Maladie chronique' | 'hépathite' | 'anémier' | 'autre';
//   date_dernier_don: string | null;
//   groupe_sanguin_id: number;
//   user_id: number;
  
// }
interface Donateur {
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
  // ... ajoute les autres champs si nécessaire
}

interface ApiResponse {
  status: boolean;
  message: string;
  data: Donateur;
}
