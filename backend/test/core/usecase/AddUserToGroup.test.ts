import { Group } from "src/core/entity/Group";
import { User } from "src/core/entity/User";
import { type GroupRepository } from "src/core/repository/GroupRepository";
import { type UserRepository } from "src/core/repository/UserRepository";
import { AddUserToGroup } from "src/core/usecase/AddUserToGroup";
import { beforeEach, describe, test, vi, expect } from "vitest";

const UserRepositoryMock = vi.fn<any, UserRepository>();
const GroupRepositoryMock = vi.fn<any, GroupRepository>();

describe.skip("Add user to group (use case)", () => {
  let userRepo: UserRepository;
  let groupRepo: GroupRepository;

  beforeEach(() => {
    userRepo = new UserRepositoryMock();
    groupRepo = new GroupRepositoryMock();
  });

  test("Given a user that didn't exist, when adding it to a group, it should fail because the user is not found", async () => {
    // Arrange
    userRepo.findByFullName = vi.fn().mockResolvedValue(null);
    const addUserToGroup = new AddUserToGroup(userRepo, groupRepo);

    // Act
    const result = await addUserToGroup.execute("group name", "user name");

    // Assert
    expect(result).toStrictEqual({
      success: false,
      errors: ["User not found"],
    });
  });

  test("Given a user that exist and a group that didn't exist, when adding the user to the group, it should fail because the group is not found", async () => {
    // Arrange
    const user = new User("John", "Doe");
    userRepo.findByFullName = vi.fn().mockResolvedValue(user);
    groupRepo.findByName = vi.fn().mockResolvedValue(null);
    const addUserToGroup = new AddUserToGroup(userRepo, groupRepo);

    // Act
    const result = await addUserToGroup.execute("group name", user.fullName);

    // Assert
    expect(result).toStrictEqual({
      success: false,
      errors: ["Group not found"],
    });
  });

  test("Given a user and a group, when adding the user to the group, it should add it succesfully and save the updated group", async () => {
    // Arrange
    const user = new User("John", "Doe");
    const group = new Group("group1", []);
    userRepo.findByFullName = vi.fn().mockResolvedValue(user);
    groupRepo.findByName = vi.fn().mockResolvedValue(group);
    groupRepo.save = vi.fn(async (group) => Promise.resolve(group));
    const addUserToGroup = new AddUserToGroup(userRepo, groupRepo);

    // Act
    const result = await addUserToGroup.execute(group.name, user.fullName);

    // Assert
    const expectedSavedGroup = new Group("group1", [user]);
    expect(result).toStrictEqual({
      success: true,
      payload: expectedSavedGroup,
    });
    expect(groupRepo.save).toHaveBeenCalledWith(expectedSavedGroup);
  });
});
