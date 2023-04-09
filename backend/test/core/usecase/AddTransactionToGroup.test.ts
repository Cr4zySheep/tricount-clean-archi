import { Group } from "src/core/entity/Group";
import { type GroupRepository } from "src/core/repository/GroupRepository";
import { AddTransactionToGroup } from "src/core/usecase/AddTransactionToGroup";
import { beforeEach, describe, test, vi, expect } from "vitest";
import { GroupMember } from "src/core/entity/GroupMember";
import { Transaction } from "src/core/entity/Transaction";

const GroupRepositoryMock = vi.fn<any, GroupRepository>();

describe("Add transaction to group (use case)", () => {
  let groupRepo: GroupRepository;

  beforeEach(() => {
    groupRepo = new GroupRepositoryMock();
  });

  describe("Unhappy path", () => {
    test("Given a false group id, when adding a transaction to a non existing group, an error 'Group not found' should be raised", async () => {
      // Arrange
      groupRepo.findById = vi.fn().mockResolvedValue(null);
      const addTransactionToGroup = new AddTransactionToGroup(groupRepo);

      // Act
      const result = await addTransactionToGroup.execute(1000, 1000, 1);

      // Assert
      expect(result).toStrictEqual({
        success: false,
        error: "Group not found",
      });
    });

    test("Given a group composed of one user, when adding a transaction from another user, an error 'Payer does not belong to the group' should be raised", async () => {
      // Arrange
      const user = new GroupMember(1, "John");
      const anotherUser = new GroupMember(2, "John2");
      const group = new Group(0, "group1", [user], []);
      groupRepo.findById = vi.fn().mockResolvedValue(group);
      const addTransactionToGroup = new AddTransactionToGroup(groupRepo);

      // Act
      const result = await addTransactionToGroup.execute(
        group.id,
        anotherUser.id,
        1
      );

      // Assert
      expect(result).toStrictEqual({
        success: false,
        error: "Payer does not belong to the group",
      });
    });

    test("Given a group composed of one user, when adding a transaction of 0€ from this user, an error 'Non positive transaction was submitted' should be raised", async () => {
      // Arrange
      const user = new GroupMember(1, "John");
      const group = new Group(0, "group1", [user], []);
      groupRepo.findById = vi.fn().mockResolvedValue(group);
      groupRepo.save = vi.fn(async (group) => Promise.resolve(group));
      const addTransactionToGroup = new AddTransactionToGroup(groupRepo);

      // Act
      const result = await addTransactionToGroup.execute(group.id, user.id, 0);

      // Assert
      expect(result).toStrictEqual({
        success: false,
        error: "Non positive transaction was submitted",
      });
    });

    test("Given a group composed of one user, when adding a transaction of -1€ from this user, an error 'Non positive transaction was submitted' should be raised", async () => {
      // Arrange
      const user = new GroupMember(1, "John");
      const group = new Group(0, "group1", [user], []);
      groupRepo.findById = vi.fn().mockResolvedValue(group);
      groupRepo.save = vi.fn(async (group) => Promise.resolve(group));
      const addTransactionToGroup = new AddTransactionToGroup(groupRepo);

      // Act
      const result = await addTransactionToGroup.execute(group.id, user.id, -1);

      // Assert
      expect(result).toStrictEqual({
        success: false,
        error: "Non positive transaction was submitted",
      });
    });
  });

  describe("Happy path", () => {
    test("Given a group composed of one user, when adding a transaction from this user, it should be successfull", async () => {
      // Arrange
      const user = new GroupMember(1, "John");
      const group = new Group(0, "group1", [user], []);
      groupRepo.findById = vi.fn().mockResolvedValue(group);
      groupRepo.save = vi.fn(async (group) => Promise.resolve(group));
      groupRepo.addTransaction = vi.fn(async (group, user, amount) => {
        group.transactions.push(new Transaction(0, user.id, amount));
        return Promise.resolve(group);
      });
      const addTransactionToGroup = new AddTransactionToGroup(groupRepo);

      // Act
      const result = await addTransactionToGroup.execute(group.id, user.id, 1);

      // Assert
      expect(result).toStrictEqual({
        success: true,
        payload: new Group(
          0,
          "group1",
          [user],
          [new Transaction(0, user.id, 1)]
        ),
      });
    });

    test("Given a group composed of one user with one transaction, when adding another transaction from this user, it should be successfull", async () => {
      // Arrange
      const user = new GroupMember(1, "John");
      const transaction = new Transaction(0, user.id, 1);
      const group = new Group(0, "group1", [user], [transaction]);
      groupRepo.findById = vi.fn().mockResolvedValue(group);
      groupRepo.save = vi.fn(async (group) => Promise.resolve(group));
      groupRepo.addTransaction = vi.fn(async (group, user, amount) => {
        group.transactions.push(new Transaction(1, user.id, amount));
        return Promise.resolve(group);
      });
      const addTransactionToGroup = new AddTransactionToGroup(groupRepo);

      // Act
      const result = await addTransactionToGroup.execute(group.id, user.id, 7);

      // Assert
      expect(result).toStrictEqual({
        success: true,
        payload: new Group(
          0,
          "group1",
          [user],
          [transaction, new Transaction(1, user.id, 7)]
        ),
      });
    });
  });
});
