import { type Document, model, Schema } from "mongoose";

export interface GameMapped {
  id: string;
  title: string;
  image: string;
  genre: string[];
}

interface GameModel extends Document {
  title: string;
  image: string;
  genre: string[];
  consoleId: string;
  mapped: () => GameMapped;
}

export type IGame = GameModel;

const gameSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  genre: {
    type: [String],
  },
  consoleId: {
    type: Schema.Types.ObjectId,
    ref: "Console",
  },
}, {
  timestamps: true,
  versionKey: false,
});

gameSchema.methods.mapped = function () {
  return {
    id: this._id,
    title: this.title,
    image: this.image,
    genre: this.genre,
    consoleId: this.consoleId,
  };
};

const Game = model<GameModel>("Game", gameSchema);

export default Game;
