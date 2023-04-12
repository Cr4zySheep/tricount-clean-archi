import { type Result } from "src/utils";
import type { GroupRepository } from "../repository/GroupRepository";
import { GroupMember } from "../entity/GroupMember";

export interface IAddMemberToGroupUseCase {
  execute: (members: GroupMember[], groupId: number) => Promise<Result<void>>;
}

export type AddMemberToGroupUseCaseRequestObject = Parameters<
  IAddMemberToGroupUseCase["execute"]
>;
export type AddMemberToGroupUseCaseResponseObject = ReturnType<
  IAddMemberToGroupUseCase["execute"]
>;

export class AddMemberToGroupUseCase implements IAddMemberToGroupUseCase {
  constructor(private readonly groupRepo: GroupRepository) {}

  async execute(members: GroupMember[], groupId: number): Promise<Result<void>> {
    const groupFound = await this.groupRepo.findById(groupId);
    if (groupFound == null) {
      return {
        success: false,
        error: "Group not found",
      };
    }

    members.forEach((member) => {
      if (!groupFound.members.includes(member)) {
        groupFound.members.push(member);
      }
    });

    await this.groupRepo.save(groupFound);

    return {
      success: true,
      payload: undefined,
    };
  }
}


