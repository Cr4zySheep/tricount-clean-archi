import { type Group } from "../entity/Group";
import { type GroupRepository } from "../repository/GroupRepository";
import { type Result } from "./utils";

export class RenameGroup {
  constructor(private readonly groupRepo: GroupRepository) {}

  async execute(id: number, name: string): Promise<Result<Group>> {
    if (name.length === 0) {
      return { success: false, error: "Group name should not be empty" };
    }

    const group = await this.groupRepo.findById(id);
    if (group === null) {
      return { success: false, error: "Group not found" };
    }

    group.name = name;

    await this.groupRepo.save(group);

    return {
      success: true,
      payload: group,
    };
  }
}
