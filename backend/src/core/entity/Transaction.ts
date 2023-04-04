export class Transaction {
  /** Transaction's id */
  public readonly id: number;

  /** If of the group member that performed the transaction */
  public payerId: number;

  /** Total amount of the transaction */
  public amount: number;

  constructor(id: number, payerId: number, amount: number) {
    this.id = id;
    this.payerId = payerId;
    this.amount = amount;
  }
}
