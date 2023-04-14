import { describe, test, expect, beforeEach, vi } from "vitest";
import type { GroupRepository } from "src/core/repository/GroupRepository";
import { Group } from "src/core/entity/Group";
import { GroupRepositoryMock } from "./test-helpers";
import { RemoveMemberFromGroupUseCase } from "src/core/usecase/RemoveMemberFromGroupUseCase";
import { GroupMember } from "src/core/entity/GroupMember";

describe("Remove a member to a group (usecase)", () => {
  let groupRepo: GroupRepository;
  let testMember: GroupMember;

  beforeEach(() => {
    groupRepo = new GroupRepositoryMock();
    testMember = new GroupMember(0, "Pierre");
  });

  describe("Happy path", () => {
    test("Given a existing group id, when removing a existing member, it should return the updated group", async () => {
      // Arrange
      const member = new GroupMember(1, "John");
      const group = new Group(2, "groupName", [member], []);
      groupRepo.findById = vi.fn().mockResolvedValue(group);
      groupRepo.save = vi.fn(async (group) => Promise.resolve(group));
      groupRepo.removeMember = vi.fn().mockResolvedValue(new Group(2, "groupName", [], []));
      const removeMemberFromGroupUseCase = new RemoveMemberFromGroupUseCase(
        groupRepo
      );

      // Act
      const result = await removeMemberFromGroupUseCase.execute(
        member.id,
        group.id
      );

      // Assert
      expect(groupRepo.removeMember).toBeCalledWith(member.id, group);
      expect(result).toStrictEqual({
        success: true,
        payload: new Group(2, "groupName", [], []),
      });
    });
  });

  describe("Unhappy path", () => {
    test("Given a false group id, when removing a member from a non existing group, an error 'Group not found' should be returned", async () => {
      // Arrange
      groupRepo.findById = vi.fn().mockResolvedValue(null);
      const removeMemberFromGroupUseCase = new RemoveMemberFromGroupUseCase(
        groupRepo
      );

      // Act
      const result = await removeMemberFromGroupUseCase.execute(
        testMember.id,
        1000
      );

      // Assert
      expect(result).toStrictEqual({
        success: false,
        error: "Group not found",
      });
    });

    test("Given a empty group, when removing a member an error 'No members in group' should be returned", async () => {
      // Arrange
      const group = new Group(2, "groupName", [], []);
      groupRepo.findById = vi.fn().mockResolvedValue(group);
      const removeMemberFromGroupUseCase = new RemoveMemberFromGroupUseCase(
        groupRepo
      );

      // Act
      const result = await removeMemberFromGroupUseCase.execute(
        testMember.id,
        group.id
      );

      // Assert
      expect(result).toStrictEqual({
        success: false,
        error: "No members in group",
      });
    });

    test("Given a non empty group, when removing a non existing member an error 'Member does not exist' should be returned", async () => {
      // Arrange
      const member = new GroupMember(1, "John");
      const group = new Group(2, "groupName", [member], []);
      groupRepo.findById = vi.fn().mockResolvedValue(group);
      groupRepo.save = vi.fn(async (group) => Promise.resolve(group));
      groupRepo.removeMember = vi.fn(async (memberId, group) => {
        return Promise.resolve(new Group(0, "group1", [], []));
      });
      const removeMemberFromGroupUseCase = new RemoveMemberFromGroupUseCase(
        groupRepo
      );

      // Act
      const result = await removeMemberFromGroupUseCase.execute(
        testMember.id,
        group.id
      );

      // Assert
      expect(result).toStrictEqual({
        success: false,
        error: "Member does not exist",
      });
    });
  });
});
