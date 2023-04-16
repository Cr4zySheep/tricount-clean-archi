import { type Result } from "src/utils";
import { type Group } from "../entity/Group";
import type { GroupRepository } from "../repository/GroupRepository";

export interface IGetGroup {
  execute: (groupId: number) => Promise<Result<Group>>;
}

export type GetGroupRequestObject = Parameters<IGetGroup["execute"]>;
export type GetGroupResponseObject = ReturnType<IGetGroup["execute"]>;

export class GetGroup implements IGetGroup {
  constructor(private readonly groupRepo: GroupRepository) {}

  async execute(groupId: number): Promise<Result<Group>> {
    const group = await this.groupRepo.findById(groupId);

    if (group == null) {
      return { success: false, error: "Group not found" };
    }

    return {
      success: true,
      payload: group,
    };
  }
}
