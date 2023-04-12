import type { GroupRepository } from "src/core/repository/GroupRepository";
import { describe, test, expect, beforeEach, vi } from "vitest";
import { GroupRepositoryMock } from "./test-helpers";
import { ComputeGroupBalanceUseCase } from "src/core/usecase/ComputeGroupBalanceUseCase";
import { GroupBalance } from "src/core/entity/GroupBalance";
import { Group } from "src/core/entity/Group";
import { GroupMember } from "src/core/entity/GroupMember";
import { Transaction } from "src/core/entity/Transaction";
import { computeGroupBalance } from "src/core/behaviour/computeGroupBalance";

describe("Compute balance (use case)", () => {
  let groupRepo: GroupRepository;

  beforeEach(() => {
    groupRepo = new GroupRepositoryMock();
  });

  describe("Happy path", () => {
    test("Given a group already created with two members and two transactions, it should return the balance of the group", async () => {
      // Arrange
      const computeBalance = new ComputeGroupBalanceUseCase(groupRepo);
      const group = new Group(
        0,
        "group name",
        [
          new GroupMember(1, "group member 1"),
          new GroupMember(2, "group member 2"),
        ],
        [new Transaction(1, 1, [1, 2], 3), new Transaction(2, 1, [2], 1)]
      );
      groupRepo.findById = vi.fn().mockResolvedValue(group);
      const mock = vi.fn().mockImplementation(computeGroupBalance);
      mock.mockImplementation(
        () =>
          new GroupBalance(
            0,
            new Map<number, number>([
              [1, 2.5],
              [2, -2.5],
            ])
          )
      );

      // Act
      const result = await computeBalance.execute(0);

      // Assert
      const expectedGroupBalance = new GroupBalance(
        0,
        new Map<number, number>([
          [1, 2.5],
          [2, -2.5],
        ])
      );
      expect(result).toEqual({
        success: true,
        payload: expectedGroupBalance,
      });
    });
  });

  describe("Unhappy path", () => {
    test("Given a group id that doesn't exist, it should return the appropriate error", async () => {
      // Arrange
      const computeBalance = new ComputeGroupBalanceUseCase(groupRepo);
      groupRepo.findById = vi.fn().mockResolvedValue(null);

      // Act
      const result = await computeBalance.execute(1);

      // Assert
      expect(result).toEqual({
        success: false,
        error: "Group not found",
      });
    });
  });
});
