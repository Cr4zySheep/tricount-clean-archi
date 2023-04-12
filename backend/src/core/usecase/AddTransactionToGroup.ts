import { type Group } from "../entity/Group";
import { type GroupRepository } from "../repository/GroupRepository";
import { type Result } from "src/utils";
import { type GroupMember } from "../entity/GroupMember";

export interface IAddTransactionToGroup {
  execute: (
    groupId: number,
    payerId: number,
    recipientsId: number[],
    amount: number
  ) => Promise<Result<Group>>;
}

export type AddTransactionToGroupRequestObject = Parameters<
  IAddTransactionToGroup["execute"]
>;
export type AddTransactionToGroupResponseObject = ReturnType<
  IAddTransactionToGroup["execute"]
>;

export class AddTransactionToGroup implements IAddTransactionToGroup {
  constructor(private readonly groupRepo: GroupRepository) {}

  async execute(
    groupId: number,
    payerId: number,
    recipientsId: number[],
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

    const recipients = group.members.filter(member => recipientsId.includes(member.id));

    if (recipients.length !== recipientsId.length) {
      return {
        success: false,
        error: "One recipient does not belong to the group or is duplicated",
      };
    }

    const updatedGroup = await this.groupRepo.addTransaction(
      group,
      payer,
      recipients,
      amount
    );

    return { success: true, payload: updatedGroup };
  }
}
