import { type User } from "./User";

export class Group {
  name: string;
  members: User[];

  constructor(name: string, members: User[]) {
    this.name = name;
    this.members = members;
  }

  addMember(user: User): void {
    this.members.push(user);
  }
}
