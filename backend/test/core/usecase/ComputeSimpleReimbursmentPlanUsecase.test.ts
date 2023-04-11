import { Group } from "src/core/entity/Group";
import type { GroupRepository } from "src/core/repository/GroupRepository";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { GroupRepositoryMock } from "./test-helpers";
import { GroupMember } from "src/core/entity/GroupMember";
import { Transaction } from "src/core/entity/Transaction";
import { ComputeSimpleReimbursementPlanUsecase } from "src/core/usecase/ComputeSimpleReimbursementPlanUsecase";
import { computeSimpleReimbursementPlan } from "src/core/behaviours/computeSimpleReimbursementPlan";

describe("Compute Simple Reimbursement Plan Usecase (use case)", () => {
  let groupRepo: GroupRepository;

  beforeEach(() => {
    groupRepo = new GroupRepositoryMock();
  });

  describe("Happy path", () => {
    test("Given an existing group, it should return the computed reimbursement plan", async () => {
      // Arrange
      const computeSimpleReimbursementPlanUsecase =
        new ComputeSimpleReimbursementPlanUsecase(groupRepo);

      const group = new Group(
        1,
        "group name",
        [
          new GroupMember(1, "group member 1"),
          new GroupMember(2, "group member 2"),
        ],
        [new Transaction(1, 1, [1, 2], 3)]
      );

      groupRepo.findById = vi.fn().mockResolvedValue(group);

      // Act
      const result = await computeSimpleReimbursementPlanUsecase.execute(
        group.id
      );

      // Assert
      expect(result).toEqual({
        success: true,
        payload: computeSimpleReimbursementPlan(group),
      });
    });
  });

  describe("Unhappy path", () => {
    test("When trying to compute the reimbursement plan of a group that does not exist, it should return the according error", async () => {
      // Arrange
      const computeSimpleReimbursementPlanUsecase =
        new ComputeSimpleReimbursementPlanUsecase(groupRepo);
      groupRepo.findById = vi.fn().mockResolvedValue(null);

      // Act
      const result = await computeSimpleReimbursementPlanUsecase.execute(1);

      // Assert
      expect(result).toEqual({
        success: false,
        error: "Group not found",
      });
    });
  });
});
