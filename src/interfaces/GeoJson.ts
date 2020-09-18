import { Feature } from './Feature'
export interface GeoJson {
  type: string;
  features: Feature[];
}
