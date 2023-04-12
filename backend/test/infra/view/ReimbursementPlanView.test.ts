import { describe, test, expect } from "vitest";
import { ReimbursementPlan } from "src/core/entity/ReimbursementPlan";
import {
  ReimbursementPlanView,
  DueSumToBeneficiary,
  MemberReimbursements,
} from "src/infra/view/ReimbursementPlanView";

describe("ReimbursementPlanView", () => {
  describe("From Entity", () => {
    test("Given an empty reimbursement plan, get the associated View", async () => {
      // Arrange
      const reimbursementPlan = new ReimbursementPlan(0);

      // Act
      const result = ReimbursementPlanView.fromEntity(reimbursementPlan);

      // Assert
      const expectedResult = new ReimbursementPlanView(
        reimbursementPlan.groupId,
        []
      );
      expect(result).toEqual(expectedResult);
    });

    test("Given an full reimbursement plan, get the associated View", async () => {
      // Arrange
      const reimbursementPlan = new ReimbursementPlan(0);

      reimbursementPlan.setReimbursement(1, 0, 3);
      reimbursementPlan.setReimbursement(1, 2, 2);
      reimbursementPlan.setReimbursement(2, 0, 3);

      // Act
      const result = ReimbursementPlanView.fromEntity(reimbursementPlan);

      // Assert
      const member1DueSumsTo0 = new DueSumToBeneficiary(0, 3);
      const member1DueSumsTo2 = new DueSumToBeneficiary(2, 2);
      const member1Reimbursements = new MemberReimbursements(1, [
        member1DueSumsTo0,
        member1DueSumsTo2,
      ]);

      const member2DueSumsTo0 = new DueSumToBeneficiary(0, 3);
      const member2Reimbursements = new MemberReimbursements(2, [
        member2DueSumsTo0,
      ]);

      const expectedResult = new ReimbursementPlanView(
        reimbursementPlan.groupId,
        [member1Reimbursements, member2Reimbursements]
      );
      expect(result).toEqual(expectedResult);
    });
  });
});
