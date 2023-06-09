import { Group } from "src/core/entity/Group";
import { GroupMember } from "src/core/entity/GroupMember";
import { Transaction } from "src/core/entity/Transaction";
import { GroupRepositoryInMemory } from "src/infra/repository/GroupRepositoryInMemory";
import { describe, expect, test } from "vitest";

describe("GroupRepositoryInMemory", () => {
  describe("create", () => {
    test("When creating a new group, it should create the group with the provided information", async () => {
      // Arrange
      const groupRepo = new GroupRepositoryInMemory();

      // Act
      const group = await groupRepo.create("group name");

      // Assert
      const expectedGroup = new Group(0, "group name", [], []);
      expect(group).toEqual(expectedGroup);
    });

    test("Given that a group has already been created, when creating a new group, it should create the group with the provided information and the next available id", async () => {
      // Arrange
      const groupRepo = new GroupRepositoryInMemory([
        new Group(3, "first group", [], []),
      ]);

      // Act
      const group = await groupRepo.create("second group");

      // Assert
      const expectedGroup = new Group(4, "second group", [], []);
      expect(group).toEqual(expectedGroup);
    });
  });

  describe("findById", () => {
    test("Given no group has been created, when searching for a group, it should return null", async () => {
      // Arrange
      const groupRepo = new GroupRepositoryInMemory();

      // Act
      const result = await groupRepo.findById(0);

      // Assert
      expect(result).toBeNull();
    });

    test("Given that the group exists, when searching for it, it should return it", async () => {
      // Arrange
      const groupRepo = new GroupRepositoryInMemory([
        new Group(0, "first group", [], []),
        new Group(1, "second group", [], []),
      ]);

      // Act
      const result = await groupRepo.findById(1);

      // Assert
      const expectedResult = new Group(1, "second group", [], []);
      expect(result).toEqual(expectedResult);
    });
  });

  describe("save", () => {
    test("Given that the group has been created, when saving it, it should update its information", async () => {
      // Arrange
      const groupRepo = new GroupRepositoryInMemory();
      const group = await groupRepo.create("my group");

      // Act
      group.name = "new name";
      await groupRepo.save(group);
      const updatedGroup = await groupRepo.findById(group.id);

      // Assert
      const expectedResult = new Group(0, "new name", [], []);
      expect(updatedGroup).toEqual(expectedResult);
    });
  });

  describe("addTransaction", () => {
    test("Given a group without transaction, a new transaction should be added to this group with the next transactionId available", async () => {
      // Arrange
      const member = new GroupMember(0, "John");
      const secondMember = new GroupMember(1, "Dave");
      const group = new Group(0, "group0", [member, secondMember], []);
      const groupRepo = new GroupRepositoryInMemory([group]);

      // Act
      await groupRepo.addTransaction(
        group,
        group.members[0],
        [group.members[1]],
        1
      );
      const updatedGroup = await groupRepo.findById(group.id);

      // Assert
      const expectedResult = new Group(0, "group0", group.members, [
        new Transaction(0, group.members[0].id, [group.members[1].id], 1),
      ]);
      expect(updatedGroup).toEqual(expectedResult);
    });

    test("Given a group with a transaction, a new transaction should be added to this group with the next transactionId available", async () => {
      // Arrange
      const member = new GroupMember(0, "John");
      const secondMember = new GroupMember(1, "Dave");
      const transaction = new Transaction(2, member.id, [secondMember.id], 1);
      const group = new Group(0, "group0", [member], [transaction]);
      const groupRepo = new GroupRepositoryInMemory([group]);

      // Act
      await groupRepo.addTransaction(group, member, [member, secondMember], 3);
      const updatedGroup = await groupRepo.findById(group.id);

      // Assert
      const expectedResult = new Group(
        0,
        "group0",
        [member],
        [
          transaction,
          new Transaction(3, member.id, [member.id, secondMember.id], 3),
        ]
      );
      expect(updatedGroup).toStrictEqual(expectedResult);
    });
  });

  describe("removeTransaction", () => {
    test("Given a group with one transaction, the group transactions array should be empty", async () => {
      // Arrange
      const member = new GroupMember(0, "John");
      const transaction = new Transaction(0, member.id, 1);
      const group = new Group(0, "group0", [member], [transaction]);
      const groupRepo = new GroupRepositoryInMemory([group]);

      // Act
      await groupRepo.removeTransaction(group, transaction);
      const updatedGroup = await groupRepo.findById(group.id);

      // Assert
      const expectedResult = new Group(0, "group0", [group.members[0]], []);
      expect(updatedGroup).toEqual(expectedResult);
    });

    test("Given a group with a transaction, a new transaction should be added to this group with the next transactionId available", async () => {
      // Arrange
      const member = new GroupMember(0, "John");
      const firstTransaction = new Transaction(2, member.id, 1);
      const secondTransaction = new Transaction(4, member.id, 3);
      const group = new Group(
        0,
        "group0",
        [member],
        [firstTransaction, secondTransaction]
      );
      const groupRepo = new GroupRepositoryInMemory([group]);

      // Act
      await groupRepo.removeTransaction(group, secondTransaction);
      const updatedGroup = await groupRepo.findById(group.id);

      // Assert
      const expectedResult = new Group(
        0,
        "group0",
        [member],
        [firstTransaction]
      );
      expect(updatedGroup).toStrictEqual(expectedResult);
    });
  });
});
