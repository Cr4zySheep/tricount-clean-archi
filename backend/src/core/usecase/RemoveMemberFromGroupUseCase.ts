import { type Result } from "src/utils";
import type { GroupRepository } from "../repository/GroupRepository";
import { GroupMember } from "../entity/GroupMember";

export interface IRemoveMemberFromGroupUseCase {
  execute: (members: GroupMember[], groupId: number) => Promise<Result<void>>;
}

export type RemoveMemberFromGroupUseCaseRequestObject = Parameters<
  IRemoveMemberFromGroupUseCase["execute"]
>;
export type RemoveMemberFromGroupUseCaseResponseObject = ReturnType<
  IRemoveMemberFromGroupUseCase["execute"]
>;

export class RemoveMemberFromGroupUseCase implements IRemoveMemberFromGroupUseCase {
  constructor(private readonly groupRepo: GroupRepository) {}

  async execute( members: GroupMember[], groupId: number): Promise<Result<void>> {
    const groupFound = await this.groupRepo.findById(groupId);
    if (groupFound == null) {
      return {
        success: false,
        error: "Group not found",
      };
    }
    if (groupFound.members.length === 0) {
      return {
        success: false,
        error: "No members in group",
      };
    }
    members.forEach((member) => {
        if (groupFound.members.includes(member)) {
            const memberIndex = groupFound.members.indexOf(member);
            groupFound.members.splice(memberIndex, 1);
        }
    });

    await this.groupRepo.save(groupFound);

    return {
      success: true,
      payload: undefined,
    };
  }
}


