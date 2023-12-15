import { Schema, model } from "mongoose";

// FederatedCredentials model
const federatedCredentialsSchema = new Schema({
  userName: String,
  provider: String,
  subject: String,
});

export const FederatedCredentials = model(
  "FederatedCredentials",
  federatedCredentialsSchema
);
