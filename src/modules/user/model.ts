import { type Document, model, Schema } from "mongoose";

export enum Role {
  Admin = "admin",
  User = "user",
  Guest = "guest",
}

interface UserModel extends Document {
  name: string;
  lastname: string;
  password: string;
  email: string;
  refreshToken: string | null;
  role: Role;
  recoveryCodes: string[];
  comparePassword: (password: string) => Promise<boolean>;
  mapped: () => Partial<User>;
}

export type User = UserModel;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    refreshToken: {
      type: String,
    },
    role: {
      type: String,
      enum: Object.values(Role),
      default: Role.User,
    },
    recoveryCodes: {
      type: [String],
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  try {
    this.password = await Bun.password.hash(this.password);
    next();
  } catch (error) {
    throw new Error(error as string);
  }
});

userSchema.methods.comparePassword = async function (password: string) {
  return await Bun.password.verify(password, this.password);
};

userSchema.methods.mapped = function () {
  return {
    id: this._id,
    name: this.name,
    lastname: this.lastname,
    email: this.email,
    role: this.role,
  };
};

const User = model<UserModel>("User", userSchema);

export default User;
