import { type Group } from "../entity/Group";

export interface GroupRepository {
  findByName: (name: string) => Promise<Group | null>;
  save: (group: Group) => Promise<Group>;
}
