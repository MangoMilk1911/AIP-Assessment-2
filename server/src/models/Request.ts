import {
  DocumentType,
  getModelForClass,
  modelOptions,
  prop,
} from "@typegoose/typegoose";
import { Base, TimeStamps } from "@typegoose/typegoose/lib/defaultClasses";

export interface Contributor {
  _id: string;
  displayName: string;
  rewards: Map<string, number>;
}

interface RequestClass extends Base {}

@modelOptions({
  options: { customName: "Request" },
  schemaOptions: { collection: "requests" },
})
class RequestClass extends TimeStamps {
  @prop({
    index: true,
    maxlength: 30,
  })
  public title!: string;

  @prop()
  public contributors!: Contributor[]; //how to make Array brother?

  @prop({
    maxlength: 800,
  })
  public description?: string;

  @prop()
  public evidence?: Buffer;

  @prop()
  public recipient?: string;
}

export default getModelForClass(RequestClass);
