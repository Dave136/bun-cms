export class AdminUserAlreadyExists extends Error {
  constructor() {
    super("Admin user already exists");

    this.name = "AdminUserAlreadyExists";
  }
}

export class UserWithIDNotFound extends Error {
  constructor(id: string) {
    super(`User with id ${id} not found`);

    this.name = "UserWithIDNotFound";
  }
}

export class UserByEmailNotFound extends Error {
  constructor(email: string) {
    super(`User with email ${email} not found`);

    this.name = "UserByEmailNotFound";
  }
}

export class InvalidCredentials extends Error {
  constructor() {
    super("Invalid credentials where provided");

    this.name = "InvalidCredentials";
  }
}
