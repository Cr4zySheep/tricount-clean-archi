import { Group } from "src/core/entity/Group";
import type { GroupRepository } from "src/core/repository/GroupRepository";
import { CreateGroup } from "src/core/usecase/CreateGroup";
import { describe, test, expect, beforeEach, vi } from "vitest";
import { GroupRepositoryMock } from "./test-helpers";

describe("Create group (use case)", () => {
  let groupRepo: GroupRepository;

  beforeEach(() => {
    groupRepo = new GroupRepositoryMock();
  });

  describe("Happy path", () => {
    test("Given a name, it should create a with appropriate name and use the next available id", async () => {
      // Arrange
      const createGroup = new CreateGroup(groupRepo);
      groupRepo.create = vi.fn(async (name) =>
        Promise.resolve(new Group(1, name, [], []))
      );

      // Act
      const result = await createGroup.execute("group name");

      // Assert
      const expectedGroup = new Group(1, "group name", [], []);
      expect(result).toEqual({
        success: true,
        payload: expectedGroup,
      });
      expect(groupRepo.create).toHaveBeenCalledWith("group name");
    });
  });

  describe("Unhappy path", () => {
    test("Given an empty name, when trying to create a group, it should return the appropriate error", async () => {
      // Arrange
      const createGroup = new CreateGroup(groupRepo);

      // Act
      const result = await createGroup.execute("");

      // Assert
      expect(result).toEqual({
        success: false,
        error: "Group name should not be empty",
      });
    });
  });
});
