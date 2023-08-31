import { model, Schema } from "mongoose";

const revokedTokenSchema = new Schema({
  token: {
    type: String,
    required: true,
    unique: true,
  },
});

const RevokedToken = model("RevokedToken", revokedTokenSchema);

export default RevokedToken;
