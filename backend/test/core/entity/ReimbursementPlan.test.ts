import { describe, test, expect } from "vitest";
import { ReimbursementPlan } from "src/core/entity/ReimbursementPlan";

describe("Reimbursement Plan", () => {
  describe("ToString", () => {
    test("Given an empty Reimbursement Plan,", async () => {
      // Arrange
      const reimbursementPlan = new ReimbursementPlan(
        0,
        new Map<number, Map<number, number>>()
      );

      // Act
      const reimbursementPlanString = reimbursementPlan.toString();

      // Assert
      const expectedResult = "The group is balanced.";
      expect(reimbursementPlanString).toEqual(expectedResult);
    });

    test("Given a 1 transaction Reimbursement Plan,", async () => {
      // Arrange
      const reimbursementPlan = new ReimbursementPlan(
        0,
        new Map<number, Map<number, number>>()
      );

      const reimbursementTransactionsForMember1: Map<number, number> = new Map<
        number,
        number
      >();
      // 1 owes 3 euros to 0
      reimbursementTransactionsForMember1.set(0, 3);
      reimbursementPlan.reimbursementPerMemberId.set(
        1,
        reimbursementTransactionsForMember1
      );

      // Act
      const reimbursementPlanString = reimbursementPlan.toString();

      // Assert
      const expectedResult = "Member 1 owes 3 euros to member 0.";
      expect(reimbursementPlanString).toEqual(expectedResult);
    });

    test("Given a Reimbursement Plan where a member owes money to 2 other members", async () => {
      // Arrange
      const reimbursementPlan = new ReimbursementPlan(
        0,
        new Map<number, Map<number, number>>()
      );

      const reimbursementTransactionsForMember1: Map<number, number> = new Map<
        number,
        number
      >();
      // 1 owes 3 euros to 0 and 2 euros to 2
      reimbursementTransactionsForMember1.set(0, 3);
      reimbursementTransactionsForMember1.set(2, 2);
      reimbursementPlan.reimbursementPerMemberId.set(
        1,
        reimbursementTransactionsForMember1
      );

      // Act
      const reimbursementPlanString = reimbursementPlan.toString();

      // Assert
      const expectedResult =
        "Member 1 owes 3 euros to member 0, 2 euros to member 2.";
      expect(reimbursementPlanString).toEqual(expectedResult);
    });

    test("Given a Reimbursement Plan where two members owe to 1 member", async () => {
      // Arrange
      const reimbursementPlan = new ReimbursementPlan(
        0,
        new Map<number, Map<number, number>>()
      );

      const reimbursementTransactionsForMember1: Map<number, number> = new Map<
        number,
        number
      >();
      // 1 owes 3 euros to 0
      reimbursementTransactionsForMember1.set(0, 3);
      reimbursementPlan.reimbursementPerMemberId.set(
        1,
        reimbursementTransactionsForMember1
      );

      const reimbursementTransactionsForMember2: Map<number, number> = new Map<
        number,
        number
      >();
      // 2 owes 2 euros to 0
      reimbursementTransactionsForMember2.set(0, 2);
      reimbursementPlan.reimbursementPerMemberId.set(
        2,
        reimbursementTransactionsForMember2
      );

      // Act
      const reimbursementPlanString = reimbursementPlan.toString();

      // Assert
      const expectedResult =
        "Member 1 owes 3 euros to member 0.\n" +
        "Member 2 owes 2 euros to member 0.";
      expect(reimbursementPlanString).toEqual(expectedResult);
    });

    test("Given a Reimbursement Plan where member 1 owes to member 2 and member 0 owes to member 2 and member 1, the string should be always ordered in the same way", async () => {
      // Arrange
      const reimbursementPlan = new ReimbursementPlan(
        0,
        new Map<number, Map<number, number>>()
      );

      const reimbursementTransactionsForMember1: Map<number, number> = new Map<
        number,
        number
      >();
      // 1 owes 3 euros to 2
      reimbursementTransactionsForMember1.set(2, 3);
      reimbursementPlan.reimbursementPerMemberId.set(
        1,
        reimbursementTransactionsForMember1
      );

      const reimbursementTransactionsForMember0: Map<number, number> = new Map<
        number,
        number
      >();
      // 0 owes 2 euros to member 2 and 1.50 to member 1
      reimbursementTransactionsForMember0.set(2, 2);
      reimbursementTransactionsForMember0.set(1, 1.5);
      reimbursementPlan.reimbursementPerMemberId.set(
        0,
        reimbursementTransactionsForMember0
      );

      // Act
      const reimbursementPlanString = reimbursementPlan.toString();

      // Assert
      const expectedResult =
        "Member 0 owes 1.5 euros to member 1, 2 euros to member 2.\n" +
        "Member 1 owes 3 euros to member 2.";
      expect(reimbursementPlanString).toEqual(expectedResult);
    });
  });
});
