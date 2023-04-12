import Fastify, { type FastifyInstance } from "fastify";
import { GroupMember } from "src/core/entity/GroupMember";
import { Transaction } from "src/core/entity/Transaction";
import {
  type AddTransactionToGroupRequestObject,
  type AddTransactionToGroupResponseObject,
} from "src/core/usecase/AddTransactionToGroup";
import {
  type RemoveTransactionToGroupRequestObject,
  type RemoveTransactionToGroupResponseObject,
} from "src/core/usecase/RemoveTransactionFromGroup";
import { TransactionController } from "src/infra/controller/TransactionController";

import { GroupRepositoryMock } from "test/core/usecase/test-helpers";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

// Warning, using the absolute path doesn't work here
vi.mock("../../../src/core/usecase/AddTransactionToGroup");
vi.mock("../../../src/core/usecase/RemoveTransactionFromGroup");

describe("TransactionController", () => {
  describe("Add transaction", () => {
    let server: FastifyInstance;
    const groupRepo = new GroupRepositoryMock();
    const addTransactionToGroupMock = {
      execute: vi.fn<
        AddTransactionToGroupRequestObject,
        AddTransactionToGroupResponseObject
      >(),
    };

    beforeEach(async () => {
      const module = await import("src/core/usecase/AddTransactionToGroup");
      // @ts-expect-error It isn't typed as a Mock
      module.AddTransactionToGroup.mockReturnValue(addTransactionToGroupMock);

      // server = await createServer("test");
      server = Fastify({ logger: false });
      await server.register(TransactionController, {
        prefix: `/group/:groupId/transaction`,
        repositories: { group: groupRepo },
      });
      await server.ready();
    });

    afterEach(() => {
      vi.clearAllMocks();
      vi.resetAllMocks();
    });

    test("Given a payerId and a amount of 1€, it should succeed with a status 201 and return the updated group", async () => {
      // Arrange
      const groupId = 0;
      const memberId = 0;
      const transactionId = 1;
      const otherMemberId = 1;
      addTransactionToGroupMock.execute.mockResolvedValue({
        success: true,
        payload: {
          id: groupId,
          name: "new group",
          members: [new GroupMember(memberId, "John")],
          transactions: [
            new Transaction(transactionId, memberId, [otherMemberId], 1),
          ],
        },
      });

      // Act
      const response = await server.inject({
        method: "POST",
        url: `/group/${groupId}/transaction`,
        payload: {
          payerId: memberId,
          recipientsId: [otherMemberId],
          amount: 1,
        },
      });

      // Assert
      expect(addTransactionToGroupMock.execute).toBeCalledWith(
        groupId,
        memberId,
        [transactionId],
        1
      );
      expect(response.statusCode).toBe(201);
      expect(response.json()).toEqual({
        id: groupId,
        name: "new group",
        members: [new GroupMember(memberId, "John")],
        transactions: [
          new Transaction(transactionId, memberId, [otherMemberId], 1),
        ],
      });
    });

    test("Given a payerId and a amount of 3€, it should succeed with a status 201 and return the updated group", async () => {
      const groupId = 3;
      const memberId = 1;
      const transactionId = 0;
      const otherMemberId = 2;
      // Arrange
      addTransactionToGroupMock.execute.mockResolvedValue({
        success: true,
        payload: {
          id: groupId,
          name: "new group",
          members: [new GroupMember(1, "John")],
          transactions: [
            new Transaction(
              transactionId,
              memberId,
              [memberId, otherMemberId],
              3
            ),
          ],
        },
      });

      // Act
      const response = await server.inject({
        method: "POST",
        url: `/group/${groupId}/transaction`,
        payload: {
          payerId: memberId,
          recipientsId: [memberId, otherMemberId],
          amount: 1,
        },
      });

      // Assert
      expect(addTransactionToGroupMock.execute).toBeCalledWith(
        groupId,
        memberId,
        [memberId, otherMemberId],
        1
      );
      expect(response.statusCode).toBe(201);
      expect(response.json()).toEqual({
        id: groupId,
        name: "new group",
        members: [new GroupMember(memberId, "John")],
        transactions: [
          new Transaction(
            transactionId,
            memberId,
            [memberId, otherMemberId],
            3
          ),
        ],
      });
    });

    test("Given no payload, it should return an error 400", async () => {
      const response = await server.inject({
        method: "POST",
        url: `/group/0/transaction`,
      });

      expect(response.statusCode).toBe(400);
    });

    test("Given an empty payload, it should return an error 400", async () => {
      const response = await server.inject({
        method: "POST",
        url: `/group/0/transaction`,
        payload: {},
      });

      expect(response.statusCode).toBe(400);
    });

    test("Given not a full payload, it should return an error 400", async () => {
      const response = await server.inject({
        method: "POST",
        url: `/group/0/transaction`,
        payload: { payerId: 0 },
      });

      expect(response.statusCode).toBe(400);
    });

    test("When AddTransaction returns an error, it should return an error 400 with the same error message", async () => {
      // Arrange
      addTransactionToGroupMock.execute.mockResolvedValue({
        success: false,
        error: "Error message",
      });

      // Act
      const response = await server.inject({
        method: "POST",
        url: `/group/0/transaction`,
        payload: { payerId: 0, recipientsId: [2], amount: 1 },
      });

      // Assert
      expect(response.statusCode).toBe(400);
      expect(response.json()).toEqual({
        error: "Error message",
      });
    });
  });

  describe("Remove transaction", () => {
    let server: FastifyInstance;
    const groupRepo = new GroupRepositoryMock();
    const removeTransactionToGroupMock = {
      execute: vi.fn<
        RemoveTransactionToGroupRequestObject,
        RemoveTransactionToGroupResponseObject
      >(),
    };

    beforeEach(async () => {
      const module = await import(
        "src/core/usecase/RemoveTransactionFromGroup"
      );
      // @ts-expect-error It isn't typed as a Mock
      module.RemoveTransactionToGroup.mockReturnValue(
        removeTransactionToGroupMock
      );

      // server = await createServer("test");
      server = Fastify({ logger: false });
      await server.register(TransactionController, {
        prefix: `/group/:groupId/transaction`,
        repositories: { group: groupRepo },
      });
      await server.ready();
    });

    afterEach(() => {
      vi.clearAllMocks();
      vi.resetAllMocks();
    });

    test("Given a transaction to remove, it should succeed with a status 200 and return the updated group", async () => {
      // Arrange
      removeTransactionToGroupMock.execute.mockResolvedValue({
        success: true,
        payload: {
          id: 0,
          name: "new group",
          members: [new GroupMember(0, "John")],
          transactions: [],
        },
      });

      // Act
      const response = await server.inject({
        method: "DELETE",
        url: `/group/0/transaction/0`,
      });

      // Assert
      expect(removeTransactionToGroupMock.execute).toBeCalledWith(0, 0);
      expect(response.statusCode).toBe(200);
      expect(response.json()).toEqual({
        id: 0,
        name: "new group",
        members: [new GroupMember(0, "John")],
        transactions: [],
      });
    });

    test("When RemoveTransactionFromGroup returns an error, it should return an error 400 with the same error message", async () => {
      // Arrange
      removeTransactionToGroupMock.execute.mockResolvedValue({
        success: false,
        error: "Error message",
      });

      // Act
      const response = await server.inject({
        method: "DELETE",
        url: `/group/0/transaction/0`,
      });

      // Assert
      expect(response.statusCode).toBe(400);
      expect(response.json()).toEqual({
        error: "Error message",
      });
    });
  });
});
