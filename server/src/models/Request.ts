import { DocumentType, getModelForClass, modelOptions, prop } from "@typegoose/typegoose";
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

export default mongoose.model<IRequest>(
  "Request",
  new Schema(
    {
      title: {
        type: String,
        required: true,
      },
      contributors: [
        new Schema(
          {
            userId: String,
            displayName: String,
            photoURL: String,
            rewards: {
              type: Map,
              of: Number,
            },
          },
          {
            _id: false,
          }
        ),
      ],
      description: {
        type: String,
        required: true,
      },
      evidence: {
        type: Buffer,
      },
      recipient: {
        type: new Schema({
          _id: String,
          displayName: String,
          photoURL: String,
        }),
      },
    },
    { timestamps: true }
  )
);
