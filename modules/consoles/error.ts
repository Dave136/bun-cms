export class ConsoleWithIDNotFound extends Error {
  constructor(id: string) {
    super(`Console with id ${id} not found`);

    this.name = "ConsoleWithIDNotFound";
  }
}
