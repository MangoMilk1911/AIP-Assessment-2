import {
  DocumentType,
  getModelForClass,
  modelOptions,
  prop,
} from "@typegoose/typegoose";
import { Base, TimeStamps } from "@typegoose/typegoose/lib/defaultClasses";
import { UserClass } from "./User";

export class Contributor {
  public userId!: string;
  public displayName!: string;
  public rewards!: Map<string, number>;
}

interface RequestClass extends Base {}

@modelOptions({
  options: { customName: "Request" },
  schemaOptions: { collection: "requests" },
})
class RequestClass extends TimeStamps {
  @prop({
    index: true,
    maxlength: 90,
  })
  public title!: string;

  @prop({ type: () => [Contributor] })
  public contributors!: Contributor[];

  @prop({
    maxlength: 800,
  })
  public description?: string;

  @prop()
  public evidence?: Buffer;

  @prop()
  public recipient?: UserClass;
}

export default getModelForClass(RequestClass);
