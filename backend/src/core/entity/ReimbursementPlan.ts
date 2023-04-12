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
    reimbursementPerMemberId?: Map<number, Map<number, number>>
  ) {
    this.groupId = groupId;
    this.reimbursementPerMemberId =
      reimbursementPerMemberId != null
        ? reimbursementPerMemberId
        : new Map<number, Map<number, number>>();
  }

  public toString(): string {
    if (this.reimbursementPerMemberId.size === 0) {
      return `The group is balanced.`;
    }

    const reimbursementPerMemberIdEntries = Array.from(
      this.reimbursementPerMemberId.entries()
    );
    reimbursementPerMemberIdEntries.sort((a, b) => a[0] - b[0]);

    return reimbursementPerMemberIdEntries
      .map(([payerId, reimbursementsOwedByPayer]) => {
        return ReimbursementPlan.getReimbursmentOwedByPayerString(
          payerId,
          reimbursementsOwedByPayer
        );
      })
      .join("\n");
  }

  public getReimbursementAmount(payerId: number, payeeId: number): number {
    const payerReimbursements = this.reimbursementPerMemberId.get(payerId);
    if (payerReimbursements === undefined) {
      return 0;
    }

    const reimbursementAmount = payerReimbursements.get(payeeId);
    if (reimbursementAmount === undefined) {
      return 0;
    }

    return reimbursementAmount;
  }

  public setReimbursement(
    payerId: number,
    payeeId: number,
    amount: number
  ): void {
    if (payerId === payeeId) {
      throw Error("A reimbursement cannot have the same payer and payee.");
    }

    if (amount < 0) {
      throw Error("A reimbursement cannot have a negative amount.");
    }

    let payerReimbursements = this.reimbursementPerMemberId.get(payerId);
    if (amount > 0) {
      if (payerReimbursements == null) {
        payerReimbursements = new Map<number, number>();
        this.reimbursementPerMemberId.set(payerId, payerReimbursements);
      }

      payerReimbursements.set(payeeId, amount);
    } else {
      if (payerReimbursements == null) {
        return;
      }

      if (payerReimbursements.has(payeeId)) {
        payerReimbursements.delete(payeeId);
      }

      if (payerReimbursements.size === 0) {
        this.reimbursementPerMemberId.delete(payerId);
      }
    }
  }

  private static getReimbursmentOwedByPayerString(
    payerId: number,
    reimbursementsOwedByPayer: Map<number, number>
  ): string {
    const reimbursementsOwedByPayerEntries = Array.from(
      reimbursementsOwedByPayer.entries()
    );
    reimbursementsOwedByPayerEntries.sort((a, b) => a[0] - b[0]);

    return (
      `Member ${payerId} owes` +
      reimbursementsOwedByPayerEntries
        .map(([payeeId, amount]) => {
          return ` ${amount} euros to member ${payeeId}`;
        })
        .join(",") +
      "."
    );
  }
}
