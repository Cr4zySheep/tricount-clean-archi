import { Group } from "src/core/entity/Group";
import { type GroupRepository } from "src/core/repository/GroupRepository";

export class GroupRepositoryInMemory implements GroupRepository {
  private readonly groups: Group[];
  private nextId: number;

  constructor(initialGroups?: Group[]) {
    this.groups = initialGroups ?? [];
    this.nextId =
      initialGroups != null
        ? initialGroups.reduce(
            (currentId, group) => Math.max(currentId, group.id),
            -1
          ) + 1
        : 0;
  }

  async create(name: string): Promise<Group> {
    const group = new Group(this.nextId, name, [], []);
    this.groups.push(group);
    this.nextId += 1;
    return group;
  }

  async findById(id: number): Promise<Group | null> {
    return this.groups.find((group) => group.id === id) ?? null;
  }

  async save(updatedGroup: Group): Promise<Group> {
    const idx = this.groups.findIndex((group) => group.id === updatedGroup.id);

    if (idx === -1) {
      throw new Error("Group not found");
    }

    this.groups[idx] = updatedGroup;

    return this.groups[idx];
  }
}
