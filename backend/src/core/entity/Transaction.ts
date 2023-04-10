export class Transaction {
  /** Transaction's id */
  public readonly id: number;

  /** Id of the group member that performed the transaction */
  public payerId: number;

  /** List of the Ids of the group members that benifitted from the transaction */
  public recipientsId: number[];

  /** Total amount of the transaction */
  public amount: number;

  constructor(
    id: number,
    payerId: number,
    recipientsId: number[],
    amount: number
  ) {
    this.id = id;
    this.payerId = payerId;
    this.recipientsId = recipientsId;
    this.amount = amount;
  }
}
