import { type Document, model, Schema } from "mongoose";

export interface ConsoleMapped {
  id: string;
  name: string;
}

interface ConsoleModel extends Document {
  name: string;
  mapped: () => ConsoleMapped;
}

export type IConsole = ConsoleModel;

const consoleSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
  versionKey: false,
});

consoleSchema.methods.mapped = function () {
  return {
    id: this._id,
    name: this.name,
  };
};

const Console = model<ConsoleModel>("Console", consoleSchema);

export default Console;
