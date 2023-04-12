import { type Group } from "../entity/Group";
import { type GroupMember } from "../entity/GroupMember";

export interface GroupRepository {
  create: (name: string) => Promise<Group>;
  findById: (id: number) => Promise<Group | null>;
  save: (group: Group) => Promise<Group>;
  addTransaction: (
    group: Group,
    payer: GroupMember,
    recipients: GroupMember[],
    amount: number
  ) => Promise<Group>;
}
