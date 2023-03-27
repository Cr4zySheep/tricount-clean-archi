import { type User } from "src/core/entity/User";
import { type UserRepository } from "src/core/repository/UserRepository";

export class UserRepositoryInMemory implements UserRepository {
  private readonly users: User[];

  constructor() {
    this.users = [];
  }

  async findByFullName(fullname: string): Promise<User | null> {
    const user = this.users.find((user) => user.fullName === fullname);
    return await Promise.resolve(user ?? null);
  }
}
