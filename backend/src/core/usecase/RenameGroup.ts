import { type Result } from "src/utils";
import { Group } from "../entity/Group";
import { type GroupRepository } from "../repository/GroupRepository";

export interface IRenameGroup {
  execute: (id: number, name: string) => Promise<Result<Group>>;
}

export type RenameGroupRequestObject = Parameters<IRenameGroup["execute"]>;
export type RenameGroupResponseObject = ReturnType<IRenameGroup["execute"]>;

export class RenameGroup implements IRenameGroup {
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
