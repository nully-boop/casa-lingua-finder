
import { IPropertyAPI } from "./IProperty";

export interface IPropertyDetailsResponse {
  property: IPropertyAPI[]; // Changed from single object to array
  relaitedproperties: IPropertyAPI[];
}
