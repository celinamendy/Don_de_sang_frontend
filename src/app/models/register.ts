export interface Register {
    nom: string;
    email: string;
    password: string;
    type: 'admin' | 'donateur' | 'organisateur' | 'structure_transfusion_sanguin';
    telephone?: string;
    region_id?: number;
    adresse?: string;
    sexe?: 'M' | 'F';
    date_naissance?: string;
    poids?: number;
    antecedent_medicament?: string;
    date_dernier_don?: string;
    groupe_sanguin_id?: number;
    nom_responsable?: string;
    type_organisation?: string;
    type_entite?: string;
    structure_transfusion_sanguin_id?: number;
  }
  