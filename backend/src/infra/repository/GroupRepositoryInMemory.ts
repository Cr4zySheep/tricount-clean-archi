import { Group } from "src/core/entity/Group";
import { GroupMember } from "src/core/entity/GroupMember";
import { Transaction } from "src/core/entity/Transaction";
import { type GroupRepository } from "src/core/repository/GroupRepository";

export class GroupRepositoryInMemory implements GroupRepository {
  private readonly groups: Group[];
  private nextGroupId: number;
  private nextMemberId: number;
  private nextTransactionId: number;

  constructor(initialGroups?: Group[]) {
    this.groups = initialGroups ?? [];

    this.nextGroupId =
      initialGroups != null
        ? initialGroups.reduce(
            (currentId, group) => Math.max(currentId, group.id),
            -1
          ) + 1
        : 0;

    this.nextMemberId =
      initialGroups != null
        ? initialGroups.reduce(
            (currentId, group) =>
              Math.max(
                currentId,
                group.members.reduce(
                  (max, member) => Math.max(max, member.id),
                  -1
                )
              ),
            -1
          ) + 1
        : 0;

    const membersIds = this.groups
      .flatMap((group) => group.members)
      .map((member) => member.id);
    this.nextTransactionId =
      membersIds.length === 0 ? 0 : Math.max(...membersIds) + 1;

    const transactionIds = this.groups
      .flatMap((group) => group.transactions)
      .map((transaction) => transaction.id);
    this.nextTransactionId =
      transactionIds.length === 0 ? 0 : Math.max(...transactionIds) + 1;
  }

  async create(name: string): Promise<Group> {
    const group = new Group(this.nextGroupId, name, [], []);
    this.groups.push(group);
    this.nextGroupId += 1;
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

  async addMember(username: string, group: Group): Promise<Group> {
    const member = new GroupMember(this.nextMemberId, username);
    group.members.push(member);
    this.nextMemberId += 1;
    return this.save(group);
  }

  async removeMember(memberId: number, group: Group): Promise<Group> {
    group.members = group.members.filter(
      (currentMember) => currentMember.id !== memberId
    );

    return this.save(group);
  }

  async addTransaction(
    group: Group,
    payer: GroupMember,
    recipients: GroupMember[],
    amount: number
  ): Promise<Group> {
    const transaction = new Transaction(
      this.nextTransactionId,
      payer.id,
      recipients.map((recipient) => recipient.id),
      amount
    );
    group.transactions.push(transaction);
    this.nextTransactionId += 1;
    return this.save(group);
  }

  async removeTransaction(
    group: Group,
    transaction: Transaction
  ): Promise<Group> {
    group.transactions = group.transactions.filter(
      (currentTransaction) => currentTransaction.id !== transaction.id
    );

    return this.save(group);
  }
}
