import { Group } from "src/core/entity/Group";
import { type GroupRepository } from "src/core/repository/GroupRepository";
import { beforeEach, describe, test, vi, expect } from "vitest";
import { GroupMember } from "src/core/entity/GroupMember";
import { Transaction } from "src/core/entity/Transaction";
import { RemoveTransactionToGroup } from "src/core/usecase/RemoveTransactionFromGroup";

const GroupRepositoryMock = vi.fn<any, GroupRepository>();

describe("Remove transaction to group (use case)", () => {
  let groupRepo: GroupRepository;

  beforeEach(() => {
    groupRepo = new GroupRepositoryMock();
  });

  describe("Unhappy path", () => {
    test("Given a false group id, when removing a transaction to a non existing group, an error 'Group not found' should be raised", async () => {
      // Arrange
      groupRepo.findById = vi.fn().mockResolvedValue(null);
      const removeTransactionToGroup = new RemoveTransactionToGroup(groupRepo);

      // Act
      const result = await removeTransactionToGroup.execute(1000, 1000);

      // Assert
      expect(result).toStrictEqual({
        success: false,
        error: "Group not found",
      });
    });

    test("Given a group having 0 transaction, when removing a transaction, an error 'Transaction does not exist' should be raised", async () => {
      // Arrange
      const user = new GroupMember(1, "John");
      const group = new Group(0, "group1", [user], []);
      groupRepo.findById = vi.fn().mockResolvedValue(group);
      const removeTransactionToGroup = new RemoveTransactionToGroup(groupRepo);

      // Act
      const result = await removeTransactionToGroup.execute(group.id, 1);

      // Assert
      expect(result).toStrictEqual({
        success: false,
        error: "Transaction does not exist",
      });
    });
  });

  describe("Happy path", () => {
    test("Given a group composed of one transaction, when removing this transaction, it should be successfull", async () => {
      // Arrange
      const user = new GroupMember(1, "John");
      const transaction = new Transaction(0, user.id, 1);
      const group = new Group(0, "group1", [user], [transaction]);
      groupRepo.findById = vi.fn().mockResolvedValue(group);
      groupRepo.save = vi.fn(async (group) => Promise.resolve(group));
      groupRepo.removeTransaction = vi.fn(async (group, transaction) => {
        return Promise.resolve(new Group(0, "group1", [user], []));
      });
      const removeTransactionToGroup = new RemoveTransactionToGroup(groupRepo);

      // Act
      const result = await removeTransactionToGroup.execute(
        group.id,
        transaction.id
      );

      // Assert
      expect(groupRepo.removeTransaction).toBeCalledWith(group, transaction);
      expect(result).toStrictEqual({
        success: true,
        payload: new Group(0, "group1", [user], []),
      });
    });

    test("Given a group composed of one user with two transaction, when removing one transaction, it should be successfull", async () => {
      // Arrange
      const user = new GroupMember(1, "John");
      const firstTransaction = new Transaction(0, user.id, 1);
      const secondTransaction = new Transaction(1, user.id, 3);
      const group = new Group(
        0,
        "group1",
        [user],
        [firstTransaction, secondTransaction]
      );
      groupRepo.findById = vi.fn().mockResolvedValue(group);
      groupRepo.save = vi.fn(async (group) => Promise.resolve(group));
      groupRepo.removeTransaction = vi.fn(async (group, transaction) => {
        return Promise.resolve(
          new Group(0, "group1", [user], [firstTransaction])
        );
      });
      const removeTransactionToGroup = new RemoveTransactionToGroup(groupRepo);

      // Act
      const result = await removeTransactionToGroup.execute(group.id, 1);

      // Assert
      expect(groupRepo.removeTransaction).toBeCalledWith(
        group,
        secondTransaction
      );
      expect(result).toStrictEqual({
        success: true,
        payload: new Group(0, "group1", [user], [firstTransaction]),
      });
    });
  });
});
