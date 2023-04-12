import { Group } from "src/core/entity/Group";
import { type GroupMember } from "src/core/entity/GroupMember";
import { Transaction } from "src/core/entity/Transaction";
import { type GroupRepository } from "src/core/repository/GroupRepository";

export class GroupRepositoryInMemory implements GroupRepository {
  private readonly groups: Group[];
  private nextId: number;
  private nextTransactionId: number;

  constructor(initialGroups?: Group[]) {
    this.groups = initialGroups ?? [];
    this.nextId =
      initialGroups != null
        ? initialGroups.reduce(
            (currentId, group) => Math.max(currentId, group.id),
            -1
          ) + 1
        : 0;
    const transactionIds = this.groups
      .flatMap((group) => group.transactions)
      .map((transaction) => transaction.id);
    this.nextTransactionId =
      transactionIds.length === 0 ? 0 : Math.max(...transactionIds) + 1;
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
}
