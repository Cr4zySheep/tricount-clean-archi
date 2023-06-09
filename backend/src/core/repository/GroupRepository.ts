import { type Group } from "../entity/Group";
import { type GroupMember } from "../entity/GroupMember";
import { type Transaction } from "../entity/Transaction";

export interface GroupRepository {
  create: (name: string) => Promise<Group>;
  findById: (id: number) => Promise<Group | null>;
  save: (group: Group) => Promise<Group>;

  addMember: (username: string, group: Group) => Promise<Group>;
  removeMember: (memberId: number, group: Group) => Promise<Group>;

  addTransaction: (
    group: Group,
    payer: GroupMember,
    recipients: GroupMember[],
    amount: number
  ) => Promise<Group>;
  removeTransaction: (group: Group, transaction: Transaction) => Promise<Group>;
}
