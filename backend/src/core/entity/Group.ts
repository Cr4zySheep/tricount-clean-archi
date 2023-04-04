export class Group {
  /** Group's id */
  public readonly id: number;

  /** Group's name */
  public name: string;

  /** Ids of the group's members */
  public membersId: number[];

  /** Ids of the group's transactions */
  public transactionsId: number[];

  constructor(
    id: number,
    name: string,
    membersId: number[],
    transactionsId: number[]
  ) {
    this.id = id;
    this.name = name;
    this.membersId = membersId;
    this.transactionsId = transactionsId;
  }
}
