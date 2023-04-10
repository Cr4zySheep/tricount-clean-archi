import type { Group } from "./Group";
import { ReimbursementPlan } from "./ReimbursementPlan";
import type { Transaction } from "./Transaction";

export class ComputeSimpleReimbursementPlan {
  /**
   * Compute the reimbursement plan of a group thanks to its transactions.
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
    return transaction.amount / transaction.recipientsId.length;
  }

  private static retrieveDueSumsPerMemberIdFromTransactions(
    transactions: Transaction[]
  ): Map<number, Map<number, number[]>> {
    const dueSumsPerMemberId = new Map<number, Map<number, number[]>>();

    transactions.forEach((transaction) => {
      const dueAmount = this.computeTransactionDueAmount(transaction);

      transaction.recipientsId.forEach((recipientId) => {
        if (recipientId !== transaction.payerId) {
          this.addDueSumFromPayerToPayee(
            dueSumsPerMemberId,
            recipientId,
            transaction.payerId,
            dueAmount
          );
        }
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

    if (dueSumsByPayer !== undefined) {
      const dueSumsByPayerToPayee = dueSumsByPayer.get(payeeId);

      if (dueSumsByPayerToPayee !== undefined) {
        dueSumsByPayerToPayee.push(dueSum);
      } else {
        dueSumsByPayer.set(payeeId, [dueSum]);
      }
    } else {
      const newDueSumsByPayer = new Map<number, number[]>();
      newDueSumsByPayer.set(payeeId, [dueSum]);
      dueSumsPerMemberId.set(payerId, newDueSumsByPayer);
    }
  }

  private static aggregateDueSumsPerMemberId(
    dueSumsPerMemberId: Map<number, Map<number, number[]>>
  ): Map<number, Map<number, number>> {
    const reimbursementPerMemberId = new Map<number, Map<number, number>>();
    const alreadyComputedMembersId = new Map<number, boolean>();

    dueSumsPerMemberId.forEach((memberDueSums, memberId) => {
      memberDueSums.forEach((dueSums, beneficiaryId) => {
        if (alreadyComputedMembersId.get(memberId) !== null) {
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
    if (memberReimbursement != null) {
      memberReimbursement.set(payeeId, dueSum);
    } else {
      const newMemberReimbursement = new Map<number, number>();
      newMemberReimbursement.set(payeeId, dueSum);
      reimbursementPerMemberId.set(payerId, newMemberReimbursement);
    }
  }
}
