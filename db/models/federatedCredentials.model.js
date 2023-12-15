import { Schema, Types, model } from "mongoose";

// FederatedCredentials model
const federatedCredentialsSchema = new Schema({
  user_id: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  provider: String,
  subject: String,
});

export const FederatedCredentials = model(
  "FederatedCredentials",
  federatedCredentialsSchema
);
