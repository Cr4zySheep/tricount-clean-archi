import Fastify, { type FastifyInstance } from "fastify";
import { Group } from "src/core/entity/Group";
import { ReimbursementPlan } from "src/core/entity/ReimbursementPlan";
import type {
  ComputeSimpleReimbursementPlanUsecaseRequestObject,
  ComputeSimpleReimbursementPlanUsecaseResponseObject,
} from "src/core/usecase/ComputeSimpleReimbursementPlanUsecase";
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
  type ComputeGroupBalanceUseCaseRequestObject,
  type ComputeGroupBalanceUseCaseResponseObject,
} from "src/core/usecase/ComputeGroupBalanceUseCase";
import { GroupController } from "src/infra/controller/GroupController";
import { ReimbursementPlanView } from "src/infra/view/ReimbursementPlanView";
import { GroupRepositoryMock } from "test/core/usecase/test-helpers";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { GroupBalanceView } from "src/infra/view/GroupBalance.view";

// Warning, using the absolute path doesn't work here
vi.mock("../../../src/core/usecase/CreateGroup");
vi.mock("../../../src/core/usecase/RenameGroup");
vi.mock("../../../src/core/usecase/ComputeSimpleReimbursementPlanUsecase");
vi.mock("../../../src/core/usecase/ComputeGroupBalanceUseCase");

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

  describe("Compute simple reimbursement plan", () => {
    let server: FastifyInstance;
    const groupRepo = new GroupRepositoryMock();
    const computeSimpleReimbursementPlanMock = {
      execute: vi.fn<
        ComputeSimpleReimbursementPlanUsecaseRequestObject,
        ComputeSimpleReimbursementPlanUsecaseResponseObject
      >(),
    };

    beforeEach(async () => {
      const module = await import(
        "src/core/usecase/ComputeSimpleReimbursementPlanUsecase"
      );
      // @ts-expect-error It isn't typed as a Mock
      module.ComputeSimpleReimbursementPlanUsecase.mockReturnValue(
        computeSimpleReimbursementPlanMock
      );

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

    test("Given an existing group, it should successfully compute a simple reimbursement plan of the group and have status code of 200", async () => {
      // Arrange
      const reimbursementPlan = new ReimbursementPlan(
        0,
        new Map<number, Map<number, number>>()
      );

      const reimbursementTransactionsForAMember: Map<number, number> = new Map<
        number,
        number
      >();
      reimbursementTransactionsForAMember.set(0, 3);
      reimbursementTransactionsForAMember.set(2, 2);
      reimbursementPlan.reimbursementPerMemberId.set(
        1,
        reimbursementTransactionsForAMember
      );

      computeSimpleReimbursementPlanMock.execute.mockResolvedValue({
        success: true,
        payload: reimbursementPlan,
      });

      // Act
      const response = await server.inject({
        method: "GET",
        url: "/group/0/simple-reimbursement-plan",
      });

      // Assert
      expect(computeSimpleReimbursementPlanMock.execute).toBeCalledWith(0);
      expect(response.statusCode).toBe(200);
      expect(response.json()).toEqual(
        ReimbursementPlanView.fromEntity(reimbursementPlan)
      );
    });

    test("When the group with groupId is not found, should return a 404 error with the adequate message", async () => {
      // Arrange
      computeSimpleReimbursementPlanMock.execute.mockResolvedValue({
        success: false,
        error: "Group not found", // TODO : Implement Error interface/enum
      });

      // Act
      const response = await server.inject({
        method: "GET",
        url: "/group/0/simple-reimbursement-plan",
      });

      // Assert
      expect(response.statusCode).toBe(404);
      expect(response.json()).toEqual({ error: "Group not found" });
    });
  });
  describe("Compute group balance", () => {
    let server: FastifyInstance;
    const groupRepo = new GroupRepositoryMock();
    const computeGroupBalanceMock = {
      execute: vi.fn<
        ComputeGroupBalanceUseCaseRequestObject,
        ComputeGroupBalanceUseCaseResponseObject
      >(),
    };

    beforeEach(async () => {
      const module = await import(
        "src/core/usecase/ComputeGroupBalanceUseCase"
      );
      // @ts-expect-error It isn't typed as a Mock
      module.ComputeGroupBalanceUseCase.mockReturnValue(
        computeGroupBalanceMock
      );

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
      computeGroupBalanceMock.execute.mockResolvedValue({
        success: true,
        payload: new GroupBalance(0, balanceMapTest),
      });

      // Act
      const response = await server.inject({
        method: "POST",
        url: "/group/0/computeBalance",
      });

      // Assert
      expect(computeGroupBalanceMock.execute).toBeCalledWith(0);
      expect(response.statusCode).toBe(200);
      expect(response.json()).toEqual(
        GroupBalanceView.fromGroupBalance(new GroupBalance(0, balanceMapTest))
      );
    });
  });
});
