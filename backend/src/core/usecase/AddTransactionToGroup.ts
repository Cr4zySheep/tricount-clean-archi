import { type Group } from "../entity/Group";
import { type GroupRepository } from "../repository/GroupRepository";
import { type Result } from "src/utils";

export class AddTransactionToGroup {
  constructor(private readonly groupRepo: GroupRepository) {}

  async execute(
    groupId: number,
    payerId: number,
    amount: number
  ): Promise<Result<Group>> {
    const group = await this.groupRepo.findById(groupId);
    if (group == null) {
      return { success: false, error: "Group not found" };
    }

    const payer = group.members.find(
      (groupMember) => groupMember.id === payerId
    );
    if (payer == null) {
      return {
        success: false,
        error: "Payer does not belong to the group",
      };
    }

    if (amount <= 0) {
      return {
        success: false,
        error: "Non positive transaction was submitted",
      };
    }

    const updatedGroup = await this.groupRepo.addTransaction(
      group,
      payer,
      amount
    );

    return { success: true, payload: updatedGroup };
  }
}
