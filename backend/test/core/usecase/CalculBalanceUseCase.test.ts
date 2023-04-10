import { Group } from "src/core/entity/Group";
import type { GroupRepository } from "src/core/repository/GroupRepository";
import { describe, test, expect, beforeEach, vi } from "vitest";
import { GroupRepositoryMock } from "./test-helpers";
import { CalculBalanceUseCase } from "src/core/usecase/CalculBalanceUseCase";

describe("Calcul balance (use case)", () => {
  let groupRepo: GroupRepository;

  beforeEach(() => {
    groupRepo = new GroupRepositoryMock();
  });

  describe("Unhappy path", () => {
    test("Given a group id that doesn't exist, it should return the appropriate error", async () => {
      // Arrange
      const calculBalance = new CalculBalanceUseCase(groupRepo);
      groupRepo.findById = vi.fn().mockResolvedValue(null);

      // Act
      const result = await calculBalance.execute(1);

      // Assert
      expect(result).toEqual({
        success: false,
        error: "Group id does not exist",
      });
    });
  });
});
