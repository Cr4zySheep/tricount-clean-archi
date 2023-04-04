import { type Result } from "src/utils";
import { Group } from "../entity/Group";
import type { GroupRepository } from "../repository/GroupRepository";

export class CreateGroup {
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
