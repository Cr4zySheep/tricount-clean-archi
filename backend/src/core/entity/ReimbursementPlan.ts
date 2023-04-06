/**
 * Describe a list of transactions to perform to reestablish the group balance
 */
export class ReimbursementPlan {
  /** Id of the group from which this balance was calculated */
  public readonly groupId: number;

  /**
   * @example amount = this.reimbursementPerMemberId.get(payerId).get(payeeId);
   */
  public reimbursementPerMemberId: Map<number, Map<number, number>>;

  constructor(
    groupId: number,
    reimbursementPerMemberId: Map<number, Map<number, number>>
  ) {
    this.groupId = groupId;
    this.reimbursementPerMemberId = reimbursementPerMemberId;
  }
}
