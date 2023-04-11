import Fastify, { type FastifyInstance } from "fastify";
import { Group } from "src/core/entity/Group";
import { GroupBalance } from "src/core/entity/GroupBalance";
import {
  type CreateGroupRequestObject,
  type CreateGroupResponseObject,
} from "src/core/usecase/CreateGroup";
import {
  type RenameGroupRequestObject,
  type RenameGroupResponseObject,
} from "src/core/usecase/RenameGroup";
import {
  type CalculGroupBalanceUseCaseRequestObject,
  type CalculGroupBalanceUseCaseResponseObject,
} from "src/core/usecase/CalculGroupBalanceUseCase";
import { GroupController } from "src/infra/controller/GroupController";
import { GroupRepositoryMock } from "test/core/usecase/test-helpers";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { GroupBalanceView } from "src/infra/view/GroupBalance.view";

// Warning, using the absolute path doesn't work here
vi.mock("../../../src/core/usecase/CreateGroup");
vi.mock("../../../src/core/usecase/RenameGroup");
vi.mock("../../../src/core/usecase/CalculGroupBalanceUseCase");

describe("GroupController", () => {
  describe("Create group", () => {
    let server: FastifyInstance;
    const groupRepo = new GroupRepositoryMock();
    const createGroupMock = {
      execute: vi.fn<CreateGroupRequestObject, CreateGroupResponseObject>(),
    };

    beforeEach(async () => {
      const module = await import("src/core/usecase/CreateGroup");
      // @ts-expect-error It isn't typed as a Mock
      module.CreateGroup.mockReturnValue(createGroupMock);

      server = Fastify({ logger: false });
      await server.register(GroupController, {
        prefix: "/group",
        repositories: { group: groupRepo },
      });
      await server.ready();
    });

    afterEach(() => {
      vi.clearAllMocks();
      vi.resetAllMocks();
    });

    test("Given a name, it should succeed with a status 201 and return the newly created group", async () => {
      // Arrange
      const expectedGroup = new Group(0, "new group", [], []);
      createGroupMock.execute.mockResolvedValue({
        success: true,
        payload: expectedGroup,
      });

      // Act
      const response = await server.inject({
        method: "POST",
        url: "/group/",
        payload: { name: expectedGroup.name },
      });

      // Assert
      expect(createGroupMock.execute).toBeCalledWith(expectedGroup.name);
      expect(response.statusCode).toBe(201);
      expect(response.json()).toEqual(expectedGroup);
    });

    test("Given no payload, it should return an error 400", async () => {
      const response = await server.inject({
        method: "POST",
        url: "/group/",
      });

      expect(response.statusCode).toBe(400);
    });

    test("Given an empty payload, it should return an error 400", async () => {
      const response = await server.inject({
        method: "POST",
        url: "/group/",
        payload: {},
      });

      expect(response.statusCode).toBe(400);
    });

    test("When CreateGroup returns an error, it should return an error 400 with the same error message", async () => {
      // Arrange
      createGroupMock.execute.mockResolvedValue({
        success: false,
        error: "Error message",
      });

      // Act
      const response = await server.inject({
        method: "POST",
        url: "/group/",
        payload: { name: "" },
      });

      // Assert
      expect(response.statusCode).toBe(400);
      expect(response.json()).toEqual({
        error: "Error message",
      });
    });
  });

  describe("Rename group", () => {
    let server: FastifyInstance;
    const groupRepo = new GroupRepositoryMock();
    const renameGroupMock = {
      execute: vi.fn<RenameGroupRequestObject, RenameGroupResponseObject>(),
    };

    beforeEach(async () => {
      const module = await import("src/core/usecase/RenameGroup");
      // @ts-expect-error It isn't typed as a Mock
      module.RenameGroup.mockReturnValue(renameGroupMock);

      // server = await createServer("test");
      server = Fastify({ logger: false });
      await server.register(GroupController, {
        prefix: "/group",
        repositories: { group: groupRepo },
      });
      await server.ready();
    });

    afterEach(() => {
      vi.clearAllMocks();
      vi.resetAllMocks();
    });

    test("Given a new name and an existing group, it should successfully rename the group and have status code of 200", async () => {
      // Arrange
      const group = new Group(0, "another name", [], []);
      renameGroupMock.execute.mockResolvedValue({
        success: true,
        payload: group,
      });

      // Act
      const expectedName = "another name";
      const response = await server.inject({
        method: "POST",
        url: `/group/${group.id}/rename`,
        payload: { name: expectedName },
      });

      // Assert
      expect(renameGroupMock.execute).toBeCalledWith(0, expectedName);
      expect(response.statusCode).toBe(200);
      expect(response.json()).toEqual({
        id: 0,
        name: expectedName,
        members: [],
        transactions: [],
      });
    });

    test("When RenameGroup returns an error, it should return an error 400 with the same error message", async () => {
      // Arrange
      renameGroupMock.execute.mockResolvedValue({
        success: false,
        error: "Error message",
      });

      // Act
      const response = await server.inject({
        method: "POST",
        url: "/group/0/rename",
        payload: { name: "" },
      });

      // Assert
      expect(response.statusCode).toBe(400);
      expect(response.json()).toEqual({ error: "Error message" });
    });
  });
  describe("Calcul group balance", () => {
    let server: FastifyInstance;
    const groupRepo = new GroupRepositoryMock();
    const calculGroupBalanceMock = {
      execute: vi.fn<
        CalculGroupBalanceUseCaseRequestObject,
        CalculGroupBalanceUseCaseResponseObject
      >(),
    };

    beforeEach(async () => {
      const module = await import("src/core/usecase/CalculGroupBalanceUseCase");
      // @ts-expect-error It isn't typed as a Mock
      module.CalculGroupBalanceUseCase.mockReturnValue(calculGroupBalanceMock);

      // server = await createServer("test");
      server = Fastify({ logger: false });
      await server.register(GroupController, {
        prefix: "/group",
        repositories: { group: groupRepo },
      });
      await server.ready();
    });

    afterEach(() => {
      vi.clearAllMocks();
      vi.resetAllMocks();
    });

    test("Given an existing group, it should successfully return the group balance and have status code of 200", async () => {
      // Arrange
      const balanceMapTest = new Map<number, number>();
      balanceMapTest.set(0, 1);
      calculGroupBalanceMock.execute.mockResolvedValue({
        success: true,
        payload: new GroupBalance(0, balanceMapTest),
      });

      // Act
      const response = await server.inject({
        method: "POST",
        url: "/group/0/calculBalance",
      });

      // Assert
      expect(calculGroupBalanceMock.execute).toBeCalledWith(0);
      expect(response.statusCode).toBe(200);
      expect(response.json()).toEqual(
        GroupBalanceView.fromGroupBalance(new GroupBalance(0, balanceMapTest))
      );
    });
  });
});
