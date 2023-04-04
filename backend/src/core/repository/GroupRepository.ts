import { type Group } from "../entity/Group";

export interface GroupRepository {
  create: (name: string) => Promise<Group>;
}
