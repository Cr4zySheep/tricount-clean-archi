import { describe, test, expect, beforeEach, vi } from "vitest";
import type { GroupRepository } from "src/core/repository/GroupRepository";
import { GroupRepositoryMock } from "./test-helpers";
import { AddMemberToGroupUseCase } from "src/core/usecase/AddMemberToGroupUseCase";
import { GroupMember } from "src/core/entity/GroupMember";
import { Group } from "src/core/entity/Group";

describe("Add a member to a group (usecase)", () => {
  let groupRepo: GroupRepository;
  let testMember: GroupMember;

  beforeEach(() => {
    groupRepo = new GroupRepositoryMock();
    testMember = new GroupMember(0, "Pierre");
  });

  describe("Happy path", () => {
    test("Given a existing group id, when adding a valid username, it should return the updated group", async () => {
      // Arrange
      const member = new GroupMember(1, "John");
      const group = new Group(2, "groupName", [member], []);
      groupRepo.findById = vi.fn().mockResolvedValue(group);
      groupRepo.save = vi.fn(async (group) => Promise.resolve(group));
      groupRepo.addMember = vi.fn(async (memberName, group) => {
        return Promise.resolve(new Group(2, "groupName", [member, testMember], []));
      });
      const addMemberToGroupUseCase = new AddMemberToGroupUseCase(groupRepo);

      // Act
      const result = await addMemberToGroupUseCase.execute(testMember.name, group.id);

      // Assert
      expect(groupRepo.addMember).toBeCalledWith(testMember.name, group);
      expect(result).toStrictEqual({
        success: true,
        payload: new Group(2, "groupName", [member, testMember], []),
      });
    });

  })

  describe("Unhappy path", () => {
    test("Given a false group id, when adding a member to a non existing group, an error 'Group not found' should be returned", async () => {
      // Arrange
      groupRepo.findById = vi.fn().mockResolvedValue(null);
      const addMemberToGroupUseCase = new AddMemberToGroupUseCase(groupRepo);

      // Act
      const result = await addMemberToGroupUseCase.execute(testMember.name, 9999);

      // Assert
      expect(result).toStrictEqual({
        success: false,
        error: "Group not found",
      });
    });

    test("Given a invalid (empty) username, an error 'Empty username' should be returned", async () => {
      // Arrange
      const group = new Group(2, "groupName", [], [])
      groupRepo.findById = vi.fn().mockResolvedValue(group);
      const addMemberToGroupUseCase = new AddMemberToGroupUseCase(groupRepo);

      // Act
      const result = await addMemberToGroupUseCase.execute("", 9999);

      // Assert
      expect(result).toStrictEqual({
        success: false,
        error: "Empty username",
      });
    });
  });
});
