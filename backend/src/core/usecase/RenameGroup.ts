import { Group } from "../entity/Group";
import { type GroupRepository } from "../repository/GroupRepository";
import { type Result } from "../../utils";

export class RenameGroup {
  constructor(private readonly groupRepo: GroupRepository) {}

  async execute(id: number, name: string): Promise<Result<Group>> {
    const validationResult = Group.validateName(name);
    if (!validationResult.success) {
      return validationResult;
    }

    const group = await this.groupRepo.findById(id);
    if (group === null) {
      return { success: false, error: "Group not found" };
    }

    group.name = validationResult.payload;

    await this.groupRepo.save(group);

    return {
      success: true,
      payload: group,
    };
  }
}
