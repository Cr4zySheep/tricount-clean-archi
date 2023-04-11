import { type Result } from "src/utils";
import { Group } from "../entity/Group";
import type { GroupRepository } from "../repository/GroupRepository";

export interface ICreateGroup {
  execute: (name: string) => Promise<Result<Group>>;
}

export type CreateGroupRequestObject = Parameters<ICreateGroup["execute"]>;
export type CreateGroupResponseObject = ReturnType<ICreateGroup["execute"]>;

export class CreateGroup implements ICreateGroup {
  constructor(private readonly groupRepo: GroupRepository) {}

  async execute(name: string): Promise<Result<Group>> {
    const validationResult = Group.validateName(name);
    if (!validationResult.success) {
      return validationResult;
    }

    const group = await this.groupRepo.create(validationResult.payload);

    return {
      success: true,
      payload: group,
    };
  }
}
