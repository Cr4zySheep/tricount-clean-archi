import { Group } from "src/core/entity/Group";
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
});
