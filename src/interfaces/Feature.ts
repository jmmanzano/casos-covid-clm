import { Geometry } from './Geometry'
import { Properties } from './Properties'
export interface Feature {
  type: string;
  geometry: Geometry;
  properties: Properties;
  id: number;
}
