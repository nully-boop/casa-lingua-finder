
import IProperty from "./IProperty";

export interface IPropertyDetailsResponse {
  property: IProperty;
  relaitedproperties: IProperty[];
}
