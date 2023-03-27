import { type User } from "../entity/User";

export interface UserRepository {
  findByFullName: (fullname: string) => Promise<User | null>;
}
