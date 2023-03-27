export class User {
  firstName: string;
  lastName: string;

  constructor(firstName: string, lastName: string) {
    this.firstName = firstName;
    this.lastName = lastName;
  }

  public get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }
}
