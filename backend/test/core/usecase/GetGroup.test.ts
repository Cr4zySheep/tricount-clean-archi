import { Group } from "src/core/entity/Group";
import type { GroupRepository } from "src/core/repository/GroupRepository";
import { GetGroup } from "src/core/usecase/GetGroup";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { GroupRepositoryMock } from "./test-helpers";
import { GroupMember } from "src/core/entity/GroupMember";
import { Transaction } from "src/core/entity/Transaction";

describe("Get group (use case)", () => {
  let groupRepo: GroupRepository;
  let getGroup: GetGroup;
  const group = new Group(
    5,
    "demo group",
    [new GroupMember(0, "Alice"), new GroupMember(1, "Bob")],
    [new Transaction(0, 0, [1], 5)]
  );

  beforeEach(() => {
    groupRepo = new GroupRepositoryMock();
    getGroup = new GetGroup(groupRepo);
  });

  describe("Happy path", () => {
    test("Given the id of an existing group, it should find it!", async () => {
      // Arrange
      groupRepo.findById = vi.fn().mockResolvedValue(group);

      // Act
      const result = await getGroup.execute(group.id);

      // Assert
      expect(result).toEqual({ success: true, payload: group });
    });
  });

  describe("Unhappy path", () => {
    test("When the group doesn't exist, it should return the according error", async () => {
      // Arrange
      groupRepo.findById = vi.fn().mockResolvedValue(null);

      // Act
      const result = await getGroup.execute(group.id);

      // Assert
      expect(result).toEqual({ success: false, error: "Group not found" });
    });
  });
});
