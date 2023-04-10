import type { Group } from "./Group";
import { ReimbursementPlan } from "./ReimbursementPlan";
import type { Transaction } from "./Transaction";

export class ComputeSimpleReimbursementPlan {
  /**
   * Compute the reimbursement plan of a group thanks to its transactions.
   * Last cent problem is managed by minimizing the money to be sent (ie. truncating the values sent)
   */
  computeSimpleReimbursementPlan(group: Group): ReimbursementPlan {
    const dueSumsPerMemberId =
      ComputeSimpleReimbursementPlan.retrieveDueSumsPerMemberIdFromTransactions(
        group.transactions
      );

    const reimbursementPerMemberId =
      ComputeSimpleReimbursementPlan.aggregateDueSumsPerMemberId(
        dueSumsPerMemberId
      );
    return new ReimbursementPlan(group.id, reimbursementPerMemberId);
  }

  private static computeTransactionDueAmount(transaction: Transaction): number {
    if (transaction.recipientsId.length === 0) {
      return 0;
    }
    return transaction.amount / transaction.recipientsId.length;
  }

  private static retrieveDueSumsPerMemberIdFromTransactions(
    transactions: Transaction[]
  ): Map<number, Map<number, number[]>> {
    const dueSumsPerMemberId = new Map<number, Map<number, number[]>>();

    transactions.forEach((transaction) => {
      const dueAmount = this.computeTransactionDueAmount(transaction);

      transaction.recipientsId.forEach((recipientId) => {
        if (recipientId === transaction.payerId) {
          return;
        }

        this.addDueSumFromPayerToPayee(
          dueSumsPerMemberId,
          recipientId,
          transaction.payerId,
          dueAmount
        );
      });
    });

    return dueSumsPerMemberId;
  }

  private static addDueSumFromPayerToPayee(
    dueSumsPerMemberId: Map<number, Map<number, number[]>>,
    payerId: number,
    payeeId: number,
    dueSum: number
  ): void {
    const dueSumsByPayer = dueSumsPerMemberId.get(payerId);
    if (dueSumsByPayer === undefined) {
      const newDueSumsByPayer = new Map<number, number[]>();
      newDueSumsByPayer.set(payeeId, [dueSum]);
      dueSumsPerMemberId.set(payerId, newDueSumsByPayer);
      return;
    }

    const dueSumsByPayerToPayee = dueSumsByPayer.get(payeeId);
    if (dueSumsByPayerToPayee === undefined) {
      dueSumsByPayer.set(payeeId, [dueSum]);
      return;
    }

    dueSumsByPayerToPayee.push(dueSum);
  }

  private static aggregateDueSumsPerMemberId(
    dueSumsPerMemberId: Map<number, Map<number, number[]>>
  ): Map<number, Map<number, number>> {
    const reimbursementPerMemberId = new Map<number, Map<number, number>>();
    const alreadyComputedMembersId = new Map<number, boolean>();

    dueSumsPerMemberId.forEach((memberDueSums, memberId) => {
      memberDueSums.forEach((dueSums, beneficiaryId) => {
        if (alreadyComputedMembersId.get(memberId) !== undefined) {
          return;
        }

        const reverseDueSum = this.getSumDueByBeneficiaryToMember(
          dueSumsPerMemberId,
          memberId,
          beneficiaryId
        );
        const aggregatedDueSum =
          dueSums.reduce((a, b) => a + b) - reverseDueSum;
        const truncedAggregatedDueSum =
          Math.trunc(100 * aggregatedDueSum) / 100;

        if (aggregatedDueSum > 0) {
          this.addReimbursementFromPayerToPayee(
            reimbursementPerMemberId,
            memberId,
            beneficiaryId,
            truncedAggregatedDueSum
          );
        } else if (aggregatedDueSum < 0) {
          this.addReimbursementFromPayerToPayee(
            reimbursementPerMemberId,
            beneficiaryId,
            memberId,
            -truncedAggregatedDueSum
          );
        }
      });

      alreadyComputedMembersId.set(memberId, true);
    });

    return reimbursementPerMemberId;
  }

  private static getSumDueByBeneficiaryToMember(
    dueSumsPerMemberId: Map<number, Map<number, number[]>>,
    memberId: number,
    beneficiaryId: number
  ): number {
    const eventualReverseDueSum = dueSumsPerMemberId
      .get(beneficiaryId)
      ?.get(memberId);
    return eventualReverseDueSum != null
      ? eventualReverseDueSum.reduce((a, b) => a + b)
      : 0;
  }

  private static addReimbursementFromPayerToPayee(
    reimbursementPerMemberId: Map<number, Map<number, number>>,
    payerId: number,
    payeeId: number,
    dueSum: number
  ): void {
    const memberReimbursement = reimbursementPerMemberId.get(payerId);

    if (memberReimbursement === undefined) {
      const newMemberReimbursement = new Map<number, number>();
      newMemberReimbursement.set(payeeId, dueSum);
      reimbursementPerMemberId.set(payerId, newMemberReimbursement);
      return;
    }

    memberReimbursement.set(payeeId, dueSum);
  }
}
