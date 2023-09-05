export class GameWithIDNotFound extends Error {
  constructor(id: string) {
    super(`Game with id ${id} not found`);

    this.name = "GameWithIDNotFound";
  }
}
