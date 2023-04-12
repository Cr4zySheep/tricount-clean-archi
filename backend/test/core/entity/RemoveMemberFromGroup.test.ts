import { describe, test, expect, beforeEach } from "vitest";
import { Group } from "src/core/entity/Group";
import { GroupMember } from "src/core/entity/GroupMember";
import { removeMemberFromGroup } from "src/core/entity/RemoveMemberFromGroup";

describe("Remove a member from a group (entity)", () => {
  let testMembers: GroupMember[];

  beforeEach(() => {
    testMembers = [
      new GroupMember(0, "Luc"),
      new GroupMember(1, "Jessica"),
      new GroupMember(2, "Pierre"),
    ];
  });

  describe("Happy path", () => {
    test("should remove members to a group when the members are already in the group", async () => {
      // Arrange
      const group = new Group(1, "group", testMembers, []);
      const member = [testMembers[0]];
      removeMemberFromGroup(member, group);

      // Act
      const result = group.members;

      // Assert
      const expectedResult = [
        new GroupMember(1, "Jessica"),
        new GroupMember(2, "Pierre"),
      ];
      expect(result).toEqual(expectedResult);
    });
  });

  describe("Unhappy path", () => {
    test("should not change the original group when the member is not already in the group", async () => {
      // Arrange
      const group = new Group(1, "group", testMembers, []);
      const member = [new GroupMember(3, "Sophie")];
      removeMemberFromGroup(member, group);

      // Act
      const result = group.members;

      // Assert
      const expectedResult = testMembers;
      expect(result).toEqual(expectedResult);
    });

    test("should not change group members when receiving an empty member list", async () => {
      // Arrange
      const group = new Group(1, "group", testMembers, []);
      removeMemberFromGroup([], group);

      // Act
      const result = group.members;

      // Assert
      const expectedResult = testMembers;
      expect(result).toEqual(expectedResult);
    });
  });
});
