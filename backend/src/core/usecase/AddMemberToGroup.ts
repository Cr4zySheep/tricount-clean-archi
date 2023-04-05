import { type Result } from "src/utils";
import type { GroupRepository } from "../repository/GroupRepository";
import { type GroupMemberRepository } from "../repository/GroupMemberRepository";
import { GroupMember } from "../entity/GroupMember";
import { Group } from "../entity/Group";

export class AddMemberToGroup {
  constructor(
    private readonly groupRepo: GroupRepository,
    private readonly groupMemberRepo: GroupMemberRepository
  ) {}

  async execute(
    groupId: number,
    memberName: string
  ): Promise<Result<GroupMember>> {
    const validationResult = GroupMember.validateName(memberName);
    if (!validationResult.success) {
      return validationResult;
    }

    const group = await this.groupRepo.findById(groupId);

    if (group === null) {
      return {
        success: false,
        error: `Group with id ${groupId} not found`,
      };
    }

    const groupMember = await this.groupMemberRepo.create(memberName);

    group.membersId.push(groupMember.id);

    await this.groupRepo.save(group);

    return {
      success: true,
      payload: groupMember,
    };
  }
}
