
import IProperty from "./IProperty";

export interface IPropertyDetailsResponse {
  property: IProperty[]; // Array of properties from API
  relaitedproperties: IProperty[];
}
