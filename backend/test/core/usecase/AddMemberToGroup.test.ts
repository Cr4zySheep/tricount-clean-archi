import { Group } from "src/core/entity/Group";
import type { GroupRepository } from "src/core/repository/GroupRepository";
import { CreateGroup } from "src/core/usecase/CreateGroup";
import { describe, test, expect, beforeEach, vi } from "vitest";
import { GroupMemberRepositoryMock, GroupRepositoryMock } from "./test-helpers";
import { type GroupMemberRepository } from "src/core/repository/GroupMemberRepository";
import { AddMemberToGroup } from "src/core/usecase/AddMemberToGroup";
import { GroupMember } from "src/core/entity/GroupMember";

describe("Add member to group (use case)", () => {
  let groupRepo: GroupRepository;
  let groupMemberRepo: GroupMemberRepository;

  beforeEach(() => {
    groupRepo = new GroupRepositoryMock();
    groupMemberRepo = new GroupMemberRepositoryMock();
  });

  describe("Happy path", () => {
    describe("Given a name and an existing group id,", () => {
      test("It should have created a group member with appropriate name and use the next available id", async () => {
        // Arrange
        const addMemberToGroup = new AddMemberToGroup(
          groupRepo,
          groupMemberRepo
        );

        groupRepo.findById = vi.fn(async (id) =>
          Promise.resolve(new Group(id, "group name", [], []))
        );
        groupMemberRepo.create = vi.fn(async (name) =>
          Promise.resolve(new GroupMember(1, name))
        );

        // Act
        await addMemberToGroup.execute(1, "member name");

        // Assert
        expect(groupMemberRepo.create).toHaveBeenCalledWith("member name");
      });

      test("It should have added the group member id in an empty group", async () => {
        // Arrange
        const addMemberToGroup = new AddMemberToGroup(
          groupRepo,
          groupMemberRepo
        );

        groupRepo.findById = vi.fn(async (id) =>
          Promise.resolve(new Group(id, "group name", [], []))
        );
        groupMemberRepo.create = vi.fn(async (name) =>
          Promise.resolve(new GroupMember(1, name))
        );

        // Act
        await addMemberToGroup.execute(1, "member name");

        // Assert
        expect(groupRepo.save).toHaveBeenCalledWith(
          new Group(1, "group name", [1], [])
        );
      });

      test("It should have added the group member id in a non-empty group", async () => {
        // Arrange
        const addMemberToGroup = new AddMemberToGroup(
          groupRepo,
          groupMemberRepo
        );

        groupRepo.findById = vi.fn(async (id) =>
          Promise.resolve(new Group(id, "group name", [1], []))
        );
        groupMemberRepo.create = vi.fn(async (name) =>
          Promise.resolve(new GroupMember(2, name))
        );

        // Act
        await addMemberToGroup.execute(1, "member name");

        // Assert
        expect(groupRepo.save).toHaveBeenCalledWith(
          new Group(1, "group name", [1, 2], [])
        );
      });

      test("It should return the groupMember created", async () => {
        // Arrange
        const addMemberToGroup = new AddMemberToGroup(
          groupRepo,
          groupMemberRepo
        );

        groupRepo.findById = vi.fn(async (id) =>
          Promise.resolve(new Group(id, "group name", [], []))
        );
        groupMemberRepo.create = vi.fn(async (name) =>
          Promise.resolve(new GroupMember(1, name))
        );

        // Act
        const result = await addMemberToGroup.execute(1, "member name");

        // Assert
        const expectedGroupMember = new GroupMember(1, "member name");
        expect(result).toEqual({
          success: true,
          payload: expectedGroupMember,
        });
      });
    });
  });

  describe("Unhappy path", () => {
    // Should we add wrong type tests for the input ?
    test("Given the id of a group that does not exist, it should return the appropriate error without having persisted anything", async () => {
      const addMemberToGroup = new AddMemberToGroup(groupRepo, groupMemberRepo);

      groupRepo.findById = vi.fn(async (id) => Promise.resolve(null));

      // Act
      const result = await addMemberToGroup.execute(1, "member name");

      // Assert
      expect(result).toEqual({
        success: false,
        error: `Group with id ${1} not found`,
      });
      expect(groupMemberRepo.create).not.toHaveBeenCalled();
      expect(groupRepo.save).not.toHaveBeenCalled();
    });

    test("Given an empty memberName, it should return the appropriate error without having persisted anything", async () => {
      const addMemberToGroup = new AddMemberToGroup(groupRepo, groupMemberRepo);

      groupRepo.findById = vi.fn(async (id) =>
        Promise.resolve(new Group(id, "group name", [], []))
      );

      // Act
      const result = await addMemberToGroup.execute(1, "");

      // Assert
      expect(result).toEqual({
        success: false,
        error: `GroupMember name should not be empty`,
      });
      expect(groupMemberRepo.create).not.toHaveBeenCalled();
      expect(groupRepo.save).not.toHaveBeenCalled();
    });
  });
});
