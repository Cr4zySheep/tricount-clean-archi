import { describe, test, expect } from "vitest";
import { ReimbursementPlan } from "src/core/entity/ReimbursementPlan";
import {
  MemberDueSumsToBeneficiary,
  MemberReimbursements,
  ReimbursementPlanDTO,
} from "src/infra/dto/ReimbursementPlan.dto";

describe("Reimbursement Plan DTO", () => {
  describe("From Entity", () => {
    test("Given an empty reimbursement plan, get the associated DTO", async () => {
      // Arrange
      const reimbursementPlan = new ReimbursementPlan(
        0,
        new Map<number, Map<number, number>>()
      );

      // Act
      const result = ReimbursementPlanDTO.fromEntity(reimbursementPlan);

      // Assert
      const expectedResult = new ReimbursementPlanDTO(
        reimbursementPlan.groupId,
        []
      );
      expect(result).toEqual(expectedResult);
    });

    test("Given an full reimbursement plan, get the associated DTO", async () => {
      // Arrange
      const reimbursementPlan = new ReimbursementPlan(
        0,
        new Map<number, Map<number, number>>()
      );

      const reimbursementTransactionsForMember1: Map<number, number> = new Map<
        number,
        number
      >();
      reimbursementTransactionsForMember1.set(0, 3);
      reimbursementTransactionsForMember1.set(2, 2);
      reimbursementPlan.reimbursementPerMemberId.set(
        1,
        reimbursementTransactionsForMember1
      );

      const reimbursementTransactionsForMember2: Map<number, number> = new Map<
        number,
        number
      >();
      reimbursementTransactionsForMember2.set(0, 3);
      reimbursementPlan.reimbursementPerMemberId.set(
        2,
        reimbursementTransactionsForMember2
      );

      // Act
      const result = ReimbursementPlanDTO.fromEntity(reimbursementPlan);

      // Assert
      const member1DueSumsTo0 = new MemberDueSumsToBeneficiary(0, 3);
      const member1DueSumsTo2 = new MemberDueSumsToBeneficiary(2, 2);
      const member1Reimbursements = new MemberReimbursements(1, [
        member1DueSumsTo0,
        member1DueSumsTo2,
      ]);

      const member2DueSumsTo0 = new MemberDueSumsToBeneficiary(0, 3);
      const member2Reimbursements = new MemberReimbursements(2, [
        member2DueSumsTo0,
      ]);

      const expectedResult = new ReimbursementPlanDTO(
        reimbursementPlan.groupId,
        [member1Reimbursements, member2Reimbursements]
      );
      expect(result).toEqual(expectedResult);
    });
  });
});
