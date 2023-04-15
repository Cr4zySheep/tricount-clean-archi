import { type Group } from "../entity/Group";
import { type Result } from "src/utils";
import type { GroupRepository } from "../repository/GroupRepository";

export interface IRemoveMemberFromGroupUseCase {
  execute: (memberId: number, groupId: number) => Promise<Result<Group>>;
}

export type RemoveMemberFromGroupUseCaseRequestObject = Parameters<
  IRemoveMemberFromGroupUseCase["execute"]
>;
export type RemoveMemberFromGroupUseCaseResponseObject = ReturnType<
  IRemoveMemberFromGroupUseCase["execute"]
>;

export class RemoveMemberFromGroupUseCase
  implements IRemoveMemberFromGroupUseCase
{
  constructor(private readonly groupRepo: GroupRepository) {}

  async execute(memberId: number, groupId: number): Promise<Result<Group>> {
    const group = await this.groupRepo.findById(groupId);
    if (group == null) {
      return {
        success: false,
        error: "Group not found",
      };
    }
    if (group.members.length === 0) {
      return {
        success: false,
        error: "No members in group",
      };
    }
    const member = group.members.find((member) => {
      return member.id === memberId;
    });
    if (member == null) {
      return {
        success: false,
        error: "Member does not exist",
      };
    }

    const updatedGroup = await this.groupRepo.removeMember(memberId, group);
    return {
      success: true,
      payload: updatedGroup,
    };
  }
}
