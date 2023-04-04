export class GroupMember {
  /** Member's id */
  public readonly id: number;

  /** Member's name */
  public name: string;

  constructor(id: number, name: string) {
    this.id = id;
    this.name = name;
  }
}
