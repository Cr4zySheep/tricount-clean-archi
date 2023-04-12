import type { Group } from "../entity/Group";
import { GroupBalance } from "../entity/GroupBalance";
import { type Transaction } from "../entity/Transaction";

export function computeGroupBalance(group: Group): GroupBalance {
  const memberIds = group.members.map((member) => member.id);

  const result = computeBalancePerMemberId(memberIds, group.transactions);

  return new GroupBalance(group.id, result);
}

function computeBalancePerMemberId(
  memberIds: number[],
  transactions: Transaction[]
): Map<number, number> {
  const result = new Map<number, number>();
  memberIds.forEach((id) => result.set(id, 0));

  transactions.forEach((transaction) => {
    memberIds.forEach((id) => {
      let memberBalance = result.get(id) ?? 0;
      if (transaction.payerId === id) {
        memberBalance += transaction.amount;
      }
      if (transaction.recipientsId.includes(id)) {
        memberBalance -= transaction.getDebtPerRecipient();
      }
      result.set(id, memberBalance);
    });
  });
  for (const id of result.keys()) {
    // keeping only 10 digits
    const memberBalance = result.get(id) ?? 0;
    result.set(id, Number(memberBalance.toFixed(10)));
  }
  return result;
}
