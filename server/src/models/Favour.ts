import { getModelForClass, modelOptions, prop } from "@typegoose/typegoose";
import { TimeStamps } from "@typegoose/typegoose/lib/defaultClasses";
import { Reward } from "./Reward";

@modelOptions({
  schemaOptions: { collection: "favours" },
})
class Favour extends TimeStamps {
  @prop()
  public debtor!: string;

  @prop()
  public recipient!: string;

  @prop()
  public rewards!: Reward;

  @prop()
  public proof?: Buffer;
}

export default getModelForClass(Favour);
