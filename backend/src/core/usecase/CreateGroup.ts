import { Group } from "../entity/Group";
import type { GroupRepository } from "../repository/GroupRepository";
import type { Result } from "../../utils";

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
