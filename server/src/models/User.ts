import {
  createSchema,
  ExtractDoc,
  ExtractProps,
  Type,
  typedModel,
} from "ts-mongoose";

// ==================== User Model ====================

const UserSchema = createSchema(
  {
    _id: Type.string(),
    email: Type.string({ required: true, trim: true }),
    displayName: Type.string({ required: true, trim: true }),
    photoURL: Type.string({ trim: true }),

    // Instance method types
    ...({} as {
      asEmbedded: () => EmbeddedUserProps;
    }),
  },
  { timestamps: true }
);

// Instance method definitions
UserSchema.method("asEmbedded", function (this: UserDoc): EmbeddedUserProps {
  const { _id, email, displayName, photoURL } = this;

  return {
    _id,
    email,
    displayName,
    photoURL,
  };
});

const User = typedModel("User", UserSchema);

export type UserProps = ExtractProps<typeof UserSchema>;
export type UserDoc = ExtractDoc<typeof UserSchema>;

// ==================== Embedded User ====================

export const EmbeddedUserSchema = createSchema(
  {
    _id: Type.string(),
    email: Type.string({ required: true, trim: true }),
    displayName: Type.string({ required: true, trim: true }),
    photoURL: Type.string({ trim: true }),
  },
  { versionKey: false }
);

export type EmbeddedUserProps = ExtractProps<typeof EmbeddedUserSchema>;

export default User;
