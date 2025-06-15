
import IProperty, { IPropertyAPI } from "./IProperty";

export interface IPropertyDetailsResponse {
  property: IPropertyAPI; // Raw API response
  relaitedproperties: IPropertyAPI[]; // Raw API response
}
