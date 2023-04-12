import { describe, test, expect, beforeEach, vi } from "vitest";
import type { GroupRepository } from "src/core/repository/GroupRepository";
import { Group } from "src/core/entity/Group";
import { GroupRepositoryMock } from "./test-helpers";
import { RemoveMemberFromGroupUseCase } from "src/core/usecase/RemoveMemberFromGroupUseCase";
import { GroupMember } from "src/core/entity/GroupMember";

describe("Remove member from a group (usecase)", () => {
  let groupRepo: GroupRepository;
  let testMembers: GroupMember[];

  beforeEach(() => {
    groupRepo = new GroupRepositoryMock();
    testMembers = [new GroupMember(0, "Luc"), new GroupMember(1, "Jessica")];
  });

    describe("Unhappy path", () => {
      test("Given a false group id, when removing a member to a non existing group, an error 'Group not found' should be returned", async () => {
        // Arrange
        groupRepo.findById = vi.fn().mockResolvedValue(null);
        const removeMemberFromGroup = new RemoveMemberFromGroupUseCase(groupRepo);
  
        // Act
        const result = await removeMemberFromGroup.execute(testMembers, 9999);
  
        // Assert
        expect(result).toStrictEqual({
          success: false,
          error: "Group not found",
        });
      });

      test("Given a group with 0 members, when removing a member, an error 'No members in group' should be raised", async () => {
        // Arrange
        const member = [testMembers[0]];
        const group = new Group(0, "group", [], []);
        groupRepo.findById = vi.fn().mockResolvedValue(group);
        const removeMemberFromGroup = new RemoveMemberFromGroupUseCase(groupRepo);
  
        // Act
        const result = await removeMemberFromGroup.execute(member, group.id);
  
        // Assert
        expect(result).toStrictEqual({
          success: false,
          error: "No members in group",
        });
    });
  });
});

