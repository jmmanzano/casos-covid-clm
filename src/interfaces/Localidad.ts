import { Semana } from './Semana'
import { Lectura } from './Lectura'

export interface Localidad{
  nombre: string;
  provincia: string;
  habitantes: number;
  listaSemanas: Semana[];
  lecturas: Lectura[];
  lecturasAct: Lectura[];
}
