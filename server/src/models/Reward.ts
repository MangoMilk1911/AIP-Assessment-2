import { getModelForClass, prop } from "@typegoose/typegoose";
import { Base } from "@typegoose/typegoose/lib/defaultClasses";

export class RewardClass extends Base {
  @prop()
  public name!: string;
}

export default getModelForClass(RewardClass);
