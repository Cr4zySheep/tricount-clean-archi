import { type Group } from "../entity/Group";
import { type GroupRepository } from "../repository/GroupRepository";
import { type UserRepository } from "../repository/UserRepository";
import { type Response } from "./utils";

export class AddUserToGroup {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly groupRepo: GroupRepository
  ) {}

  async execute(
    groupName: string,
    userFullName: string
  ): Promise<Response<Group>> {
    const user = await this.userRepo.findByFullName(userFullName);
    if (user == null) {
      return { success: false, errors: ["User not found"] };
    }

    const group = await this.groupRepo.findByName(groupName);
    if (group == null) {
      return { success: false, errors: ["Group not found"] };
    }

    group.addMember(user);

    const savedGroup = await this.groupRepo.save(group);

    return { success: true, payload: savedGroup };
  }
}
