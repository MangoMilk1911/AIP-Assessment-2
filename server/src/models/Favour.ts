import { getModelForClass, modelOptions, prop } from "@typegoose/typegoose";
import { Base, TimeStamps } from "@typegoose/typegoose/lib/defaultClasses";
import { RewardClass } from "./Reward";
import { UserClass } from "./User";

export interface FavourClass extends Base {}

@modelOptions({
  options: { customName: "Favour" },
  schemaOptions: { collection: "favours" },
})
export class FavourClass extends TimeStamps {
  @prop()
  public debtor!: UserClass;

  @prop()
  public recipient!: UserClass;

  @prop()
  public rewards!: RewardClass;

  @prop()
  public proof?: Buffer;
}

export default getModelForClass(FavourClass);
