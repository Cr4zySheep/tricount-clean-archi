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
      const group = new Group(0, "group0", [member], []);
      const groupRepo = new GroupRepositoryInMemory([group]);

      // Act
      await groupRepo.addTransaction(group, group.members[0], 1);
      const updatedGroup = await groupRepo.findById(group.id);

      // Assert
      const expectedResult = new Group(
        0,
        "group0",
        [group.members[0]],
        [new Transaction(0, group.members[0].id, 1)]
      );
      expect(updatedGroup).toEqual(expectedResult);
    });

    test("Given a group with a transaction, a new transaction should be added to this group with the next transactionId available", async () => {
      // Arrange
      const member = new GroupMember(0, "John");
      const transaction = new Transaction(2, member.id, 1);
      const group = new Group(0, "group0", [member], [transaction]);
      const groupRepo = new GroupRepositoryInMemory([group]);

      // Act
      await groupRepo.addTransaction(group, member, 3);
      const updatedGroup = await groupRepo.findById(group.id);

      // Assert
      const expectedResult = new Group(
        0,
        "group0",
        [member],
        [transaction, new Transaction(3, member.id, 3)]
      );
      expect(updatedGroup).toStrictEqual(expectedResult);
    });
  });
});
