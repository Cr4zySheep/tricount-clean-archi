import { type Result } from "src/utils";
import { type Group } from "../entity/Group";
import { type GroupRepository } from "../repository/GroupRepository";

export class RemoveTransactionToGroup {
  constructor(private readonly groupRepo: GroupRepository) {}

  async execute(
    groupId: number,
    transactionId: number
  ): Promise<Result<Group>> {
    const group = await this.groupRepo.findById(groupId);
    if (group == null) {
      return { success: false, error: "Group not found" };
    }
    const transaction = group.transactions.find((transaction) => {
      return transaction.id === transactionId;
    });
    if (transaction == null) {
      return {
        success: false,
        error: "Transaction does not exist",
      };
    }
    const updatedGroup = await this.groupRepo.removeTransaction(
      group,
      transaction
    );
    return {
      success: true,
      payload: updatedGroup,
    };
  }
}
