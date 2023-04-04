import { Group } from "src/core/entity/Group";
import type { GroupRepository } from "src/core/repository/GroupRepository";
import { RenameGroup } from "src/core/usecase/RenameGroup";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { GroupRepositoryMock } from "./test-helpers";

describe("Rename group (use case)", () => {
  let groupRepo: GroupRepository;

  beforeEach(() => {
    groupRepo = new GroupRepositoryMock();
  });

  describe("Happy path", () => {
    test("Given an existing group, when trying to name it, it should rename it accordingly", async () => {
      // Arrange
      const renameGroup = new RenameGroup(groupRepo);
      groupRepo.findById = vi
        .fn()
        .mockResolvedValue(new Group(2, "previous name", [1], []));

      // Act
      const result = await renameGroup.execute(2, "new name");

      // Assert
      const expectedGroup = new Group(2, "new name", [1], []);
      expect(result).toEqual({
        success: true,
        payload: expectedGroup,
      });
      expect(groupRepo.save).toHaveBeenCalledWith(expectedGroup);
    });
  });

  describe("Unhappy path", () => {
    test("Given an existing group, when trying to rename it with an empty name, it should return the according error", async () => {
      // Arrange
      const renameGroup = new RenameGroup(groupRepo);
      groupRepo.findById = vi
        .fn()
        .mockResolvedValue(new Group(2, "previous name", [1], []));

      // Act
      const result = await renameGroup.execute(1, "");

      // Assert
      expect(result).toEqual({
        success: false,
        error: "Group name should not be empty",
      });
    });

    test("When trying to rename a group that do not exist, it should return the according error", async () => {
      // Arrange
      const renameGroup = new RenameGroup(groupRepo);
      groupRepo.findById = vi.fn().mockResolvedValue(null);

      // Act
      const result = await renameGroup.execute(1, "new name!");

      // Assert
      expect(result).toEqual({
        success: false,
        error: "Group not found",
      });
    });
  });
});
