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

  public toString(): string {
    let reimbursementPlanString = "";

    if (this.reimbursementPerMemberId.size === 0) {
      return `The group is balanced.`;
    }

    const reimbursementPerMemberIdEntries = Array.from(
      this.reimbursementPerMemberId.entries()
    );
    reimbursementPerMemberIdEntries.sort((a, b) => a[0] - b[0]);

    reimbursementPerMemberIdEntries.forEach((entries) => {
      const payerId = entries[0];
      const reimbursementsOwedByPayer = entries[1];
      reimbursementPlanString +=
        ReimbursementPlan.getReimbursmentOwedByPayerString(
          payerId,
          reimbursementsOwedByPayer
        );
      reimbursementPlanString += "\n";
    });
    return reimbursementPlanString.slice(0, -1);
  }

  private static getReimbursmentOwedByPayerString(
    payerId: number,
    reimbursementsOwedByPayer: Map<number, number>
  ): string {
    let reimbursementsOwedByPayerString = `Member ${payerId} owes`;

    const reimbursementsOwedByPayerEntries = Array.from(
      reimbursementsOwedByPayer.entries()
    );
    reimbursementsOwedByPayerEntries.sort((a, b) => a[0] - b[0]);

    reimbursementsOwedByPayerEntries.forEach((entries) => {
      const payeeId = entries[0];
      const amount = entries[1];
      reimbursementsOwedByPayerString += ` ${amount} euros to member ${payeeId},`;
    });

    return reimbursementsOwedByPayerString.slice(0, -1) + ".";
  }
}
