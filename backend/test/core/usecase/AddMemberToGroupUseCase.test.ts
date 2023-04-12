import { describe, test, expect, beforeEach, vi } from "vitest";
import type { GroupRepository } from "src/core/repository/GroupRepository";
import { GroupRepositoryMock } from "./test-helpers";
import { AddMemberToGroupUseCase} from "src/core/usecase/AddMemberToGroupUseCase";
import { GroupMember } from "src/core/entity/GroupMember";

describe("Add a member to a group (usecase)", () => {
  let groupRepo: GroupRepository;
  let testMembers: GroupMember[];

  beforeEach(() => {
    groupRepo = new GroupRepositoryMock();
    testMembers = [new GroupMember(0, "Luc"), new GroupMember(1, "Jessica")];
  });

    describe("Unhappy path", () => {
      test("Given a false group id, when adding a member to a non existing group, an error 'Group not found' should be returned", async () => {
        // Arrange
        groupRepo.findById = vi.fn().mockResolvedValue(null);
        const addMemberToGroupUseCase = new AddMemberToGroupUseCase(groupRepo);
  
        // Act
        const result = await addMemberToGroupUseCase.execute(testMembers, 9999);
  
        // Assert
        expect(result).toStrictEqual({
          success: false,
          error: "Group not found",
        });
      });
    });
  });


