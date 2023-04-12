import { describe, test, expect, beforeEach } from "vitest";
import { Group } from "src/core/entity/Group";
import { GroupMember } from "src/core/entity/GroupMember";
import { addMemberToGroup } from "src/core/entity/AddMemberToGroup";

describe("Add member to a group (entity)", () => {
  let testMembers: GroupMember[];

  beforeEach(() => {
    testMembers = [new GroupMember(0, "Luc"), new GroupMember(1, "Jessica")];
  });

  describe("Happy path", () => {
    test("should add members to a empty group when the members are not already in the group", async () => {
      // Arrange
      const group = new Group(1, "group", [], []);
      addMemberToGroup(testMembers, group);

      // Act
      const result = group.members;

      // Assert
      const expectedResult = testMembers;
      expect(result).toEqual(expectedResult);
    });

    test("should add members to a non-empty group when the members are not already in the group", async () => {
      // Arrange
      const group = new Group(1, "group", testMembers, []);
      const member = [new GroupMember(2, "Pierre")];
      addMemberToGroup(member, group);

      // Act
      const result = group.members;

      // Assert
      const expectedResult = [
        new GroupMember(0, "Luc"),
        new GroupMember(1, "Jessica"),
        new GroupMember(2, "Pierre"),
      ];
      expect(result).toEqual(expectedResult);
    });
  });

  describe("Unhappy path", () => {
    test("should not change the original group when the member is already in the group", async () => {
      // Arrange
      const group = new Group(1, "group", testMembers, []);
      const member = [new GroupMember(0, "Luc")];
      addMemberToGroup(member, group);

      // Act
      const result = group.members;

      // Assert
      const expectedResult = testMembers;
      expect(result).toEqual(expectedResult);
    });

    test("should not change group members when receiving an empty member list", async () => {
      // Arrange
      const group = new Group(1, "group", testMembers, []);
      addMemberToGroup([], group);

      // Act
      const result = group.members;

      // Assert
      const expectedResult = testMembers;
      expect(result).toEqual(expectedResult);
    });
  });
});
