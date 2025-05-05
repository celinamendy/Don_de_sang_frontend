export interface CritereEligibilite {
    id: number;
    nom: string;
    critere: string;
    valeur: string;
    type: 'string' | 'boolean' | 'number'; // ou d'autres types selon vos besoins
    created_at: string; // ISO string
    updated_at: string; // ISO string
}

  