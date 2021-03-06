import { Lectura } from './Lectura'
import { Semana } from './Semana'

export interface Properties {
  objectId: number;
  codIne: string;
  codProv: string;
  nomMay: string;
  nomIne: string;
  nomIgn: string;
  etiqueta: string;
  sup: number;
  pob2014: number;
  densidad: number;
  tasa14: (number|string);
  ultimaSemana: Semana;
  estado: string;
}
