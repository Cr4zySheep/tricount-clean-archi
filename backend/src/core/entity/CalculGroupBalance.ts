import type { Group } from "./Group";
import { GroupBalance } from "./GroupBalance";
import { type Transaction } from "./Transaction";

export class CalculGroupBalance {
  calcul(group: Group): GroupBalance {
    const memberIds = Array.from(group.members.keys());

    const result = balancePerMember(memberIds, group.transactions);

    return new GroupBalance(group.id, result);
  }
}

function balancePerMember(
  memberIds: number[],
  transactions: Transaction[]
): Map<number, number> {
  const result = new Map<number, number>();
  memberIds.forEach((id) => result.set(id, 0));

  transactions.forEach((transaction) => {
    memberIds.forEach((id) =>
      transaction.payerId === id
        ? result.set(
            id,
            Number(result.get(id)) + payerBalance(memberIds, transaction)
          )
        : result.set(
            id,
            Number(result.get(id)) + receiverBalance(memberIds, transaction)
          )
    );
  });
  for (const i of result.keys()) {
    // keeping only 10 digits
    result.set(i, Number(Number(result.get(i)).toFixed(10)));
  }
  return result;
}

function payerBalance(memberIds: number[], transaction: Transaction): number {
  return transaction.amount - transaction.amount / memberIds.length;
}
function receiverBalance(
  memberIds: number[],
  transaction: Transaction
): number {
  return -transaction.amount / memberIds.length;
}
