import { getModelForClass, prop } from "@typegoose/typegoose";

export class Reward {
  @prop()
  public name!: string;
}

export default getModelForClass(Reward);
