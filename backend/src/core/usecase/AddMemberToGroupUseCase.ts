import { type Group } from "../entity/Group";
import { type Result } from "src/utils";
import type { GroupRepository } from "../repository/GroupRepository";

export interface IAddMemberToGroupUseCase {
  execute: (username: string, groupId: number) => Promise<Result<Group>>;
}

export type AddMemberToGroupUseCaseRequestObject = Parameters<
  IAddMemberToGroupUseCase["execute"]
>;
export type AddMemberToGroupUseCaseResponseObject = ReturnType<
  IAddMemberToGroupUseCase["execute"]
>;

export class AddMemberToGroupUseCase implements IAddMemberToGroupUseCase {
  constructor(private readonly groupRepo: GroupRepository) {}

  async execute(username: string, groupId: number): Promise<Result<Group>> {
    const group = await this.groupRepo.findById(groupId);
    if (group == null) {
      return {
        success: false,
        error: "Group not found",
      };
    }
    if (username.length === 0) {
      return {
        success: false,
        error: "Empty username",
      };
    }

    const updateGroup = await this.groupRepo.addMember(username, group);
    return {
      success: true,
      payload: updateGroup,
    };
  }
}
