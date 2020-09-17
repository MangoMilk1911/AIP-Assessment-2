import { getModelForClass, prop } from "@typegoose/typegoose";

export class RewardClass {
  @prop()
  public name!: string;
}

export default getModelForClass(RewardClass);
