import { Campagne } from "./campagne";


export interface Participation {
    id: number;
    lieu_participation: String;
    date_participation: Date;
    quantite: number;
    campagne?: Campagne;
    statut: string;
  }
  