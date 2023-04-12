import type { Group } from "../entity/Group";
import { type GroupMember } from "../entity/GroupMember";
import { ReimbursementPlan } from "../entity/ReimbursementPlan";
import type { Transaction } from "../entity/Transaction";

/**
 * Compute the reimbursement plan of a group thanks to its transactions.
 * Last cent problem is managed by minimizing the money to be sent (ie. truncating the values sent)
 */
export function computeSimpleReimbursementPlan(
  group: Group
): ReimbursementPlan {
  const reimbursementPlan = new ReimbursementPlan(group.id);

  computePairwiseReimbursementsFromTransactions(
    reimbursementPlan,
    group.transactions
  );

  aggregatePairwiseReimbursements(reimbursementPlan, group.members);

  return reimbursementPlan;
}

function computePairwiseReimbursementsFromTransactions(
  reimbursementPlan: ReimbursementPlan,
  transactions: Transaction[]
): void {
  transactions.forEach((transaction) => {
    const dueAmount = transaction.getDebtPerRecipient();

    transaction.recipientsId.forEach((recipientId) => {
      if (recipientId === transaction.payerId) {
        return;
      }

      const alreadyDueAmount = reimbursementPlan.getReimbursementAmount(
        recipientId,
        transaction.payerId
      );

      reimbursementPlan.setReimbursement(
        recipientId,
        transaction.payerId,
        dueAmount + alreadyDueAmount
      );
    });
  });
}

function aggregatePairwiseReimbursements(
  reimbursementPlan: ReimbursementPlan,
  groupMembers: GroupMember[]
): void {
  groupMembers.forEach((memberA, indexA) => {
    groupMembers.forEach((memberB, indexB) => {
      if (indexA < indexB) {
        const dueAmountFromAToB = reimbursementPlan.getReimbursementAmount(
          memberA.id,
          memberB.id
        );
        const dueAmountFromBToA = reimbursementPlan.getReimbursementAmount(
          memberB.id,
          memberA.id
        );

        const simplifiedDueAmountFromAToB =
          dueAmountFromAToB - dueAmountFromBToA;

        const realDueAmountFromAToB = computeRealDueAmount(
          simplifiedDueAmountFromAToB
        );
        const realDueAmountFromBToA = computeRealDueAmount(
          -simplifiedDueAmountFromAToB
        );

        reimbursementPlan.setReimbursement(
          memberA.id,
          memberB.id,
          realDueAmountFromAToB
        );
        reimbursementPlan.setReimbursement(
          memberB.id,
          memberA.id,
          realDueAmountFromBToA
        );
      }
    });
  });
}

function computeRealDueAmount(dueAmount: number): number {
  const positiveDueAmount = Math.max(dueAmount, 0);
  return Math.trunc(100 * positiveDueAmount) / 100;
}
