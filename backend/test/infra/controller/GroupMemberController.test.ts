import Fastify, { type FastifyInstance } from "fastify";
import { Group } from "src/core/entity/Group";
import { GroupMember } from "src/core/entity/GroupMember";
import {
  type AddMemberToGroupUseCaseResponseObject,
  type AddMemberToGroupUseCaseRequestObject,
} from "src/core/usecase/AddMemberToGroupUseCase";
import { GroupMemberController } from "src/infra/controller/GroupMemberController";
import { GroupRepositoryMock } from "test/core/usecase/test-helpers";
import { describe, vi, expect, beforeEach, test, afterEach } from "vitest";

// Warning, using the absolute path doesn't work here
vi.mock("../../../src/core/usecase/AddMemberToGroupUseCase");

describe("GroupMemberController", () => {
  let server: FastifyInstance;
  const groupRepo = new GroupRepositoryMock();

  afterEach(() => {
    vi.clearAllMocks();
    vi.resetAllMocks();
  });

  describe("Add group member", () => {
    const addMemberToGroupMock = {
      execute: vi.fn<
        AddMemberToGroupUseCaseRequestObject,
        AddMemberToGroupUseCaseResponseObject
      >(),
    };

    beforeEach(async () => {
      const module = await import("src/core/usecase/AddMemberToGroupUseCase");
      // @ts-expect-error It isn't typed as a Mock
      module.AddMemberToGroupUseCase.mockReturnValue(addMemberToGroupMock);

      server = Fastify({ logger: false });
      await server.register(GroupMemberController, {
        prefix: "/group/:groupId/member",
        repositories: { group: groupRepo },
      });
      await server.ready();
    });

    test("Given a valid username, it should succeed with a status 201 and return the group with the newly added member", async () => {
      // Arrange
      const groupId = 5;
      const username = "Alice";
      const expectedGroup = new Group(
        groupId,
        "group name",
        [new GroupMember(0, username)],
        []
      );
      addMemberToGroupMock.execute.mockResolvedValue({
        success: true,
        payload: expectedGroup,
      });

      // Act
      const response = await server.inject({
        method: "POST",
        url: `/group/${groupId}/member`,
        payload: { username },
      });

      // Assert
      expect(addMemberToGroupMock.execute).toBeCalledWith(username, groupId);
      expect(response.statusCode).toBe(201);
      expect(response.json()).toEqual(expectedGroup);
    });

    test("Given no payload, it should return an error 400", async () => {
      // Act
      const response = await server.inject({
        method: "POST",
        url: `/group/0/member`,
      });

      // Assert
      expect(response.statusCode).toBe(400);
    });

    test("When AddMemberToGroupUseCase returns an error, it should return an error 400 with the same error message", async () => {
      // Arrange
      addMemberToGroupMock.execute.mockResolvedValue({
        success: false,
        error: "Error message",
      });

      // Act
      const response = await server.inject({
        method: "POST",
        url: "/group/0/member",
        payload: { username: "" },
      });

      expect(response.statusCode).toBe(400);
      expect(response.json()).toEqual({
        error: "Error message",
      });
    });
  });

  describe.skip("Remove group member");
});
