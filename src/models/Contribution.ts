import {
  defaultClasses,
  getModelForClass,
  modelOptions,
  plugin,
  prop,
  Severity,
} from "@typegoose/typegoose";
import * as findorcreate from "mongoose-findorcreate";
import { EmbeddedUserSchema } from "./User";

export type Rewards = { [key: string]: number };

@modelOptions({
  options: { allowMixed: Severity.ALLOW },
  schemaOptions: { _id: false },
})
class RequestContribution {
  @prop()
  public user!: EmbeddedUserSchema;

  @prop()
  public rewards!: Rewards;
}

// ==================== Contribution ====================

@plugin(findorcreate)
@modelOptions({
  options: {
    customName: "Contribution",
    allowMixed: Severity.ALLOW,
  },
})
export class ContributionSchema extends defaultClasses.FindOrCreate {
  @prop({ type: () => RequestContribution })
  public contributions!: Map<string, RequestContribution>;
}

const Contribution = getModelForClass(ContributionSchema);

export default Contribution;
