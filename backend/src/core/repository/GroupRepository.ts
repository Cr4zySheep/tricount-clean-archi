import { type Group } from "../entity/Group";

export interface GroupRepository {
  create: (name: string) => Promise<Group>;
  findById: (id: number) => Promise<Group | null>;
  save: (group: Group) => Promise<Group>;
}
