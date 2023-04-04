import type { Group } from "../entity/Group";
import type { GroupRepository } from "../repository/GroupRepository";
import type { Result } from "./utils";

export class CreateGroup {
  constructor(private readonly groupRepo: GroupRepository) {}

  async execute(name: string): Promise<Result<Group>> {
    if (name.length === 0) {
      return { success: false, error: "Group name should not be empty" };
    }

    const group = await this.groupRepo.create(name);

    return {
      success: true,
      payload: group,
    };
  }
}
