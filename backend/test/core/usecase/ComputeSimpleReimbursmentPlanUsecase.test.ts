import { Group } from "src/core/entity/Group";
import type { GroupRepository } from "src/core/repository/GroupRepository";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { GroupRepositoryMock } from "./test-helpers";
import { GroupMember } from "src/core/entity/GroupMember";
import { Transaction } from "src/core/entity/Transaction";
import { ComputeSimpleReimbursementPlanUsecase } from "src/core/usecase/ComputeSimpleReimbursementPlanUsecase";
import { ReimbursementPlan } from "src/core/entity/ReimbursementPlan";
import { computeSimpleReimbursementPlan } from "src/core/behaviour/computeSimpleReimbursementPlan";

// vi.mock("../../../src/core/behaviour/computeSimpleReimbursementPlan");

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

      const expectedReimbursementPlan = new ReimbursementPlan(group.id);
      expectedReimbursementPlan.setReimbursement(2, 1, 1.5);

      groupRepo.findById = vi.fn().mockResolvedValue(group);
      const mock = vi.fn().mockImplementation(computeSimpleReimbursementPlan);
      mock.mockImplementation(() => expectedReimbursementPlan);

      // Act
      const result = await computeSimpleReimbursementPlanUsecase.execute(
        group.id
      );

      // Assert
      expect(result).toEqual({
        success: true,
        payload: expectedReimbursementPlan,
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
