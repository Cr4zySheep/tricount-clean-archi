import { describe, test, expect } from "vitest";
import { ReimbursementPlan } from "src/core/entity/ReimbursementPlan";

describe("Reimbursement Plan", () => {
  test("Given an empty Reimbursement Plan, should display the corresponding string", async () => {
    // Arrange
    const reimbursementPlan = new ReimbursementPlan(0);

    // Act
    const reimbursementPlanString = reimbursementPlan.toString();

    // Assert
    const expectedResult = "The group is balanced.";
    expect(reimbursementPlanString).toEqual(expectedResult);
  });

  describe("setReimbursement", () => {
    test("Given a Reimbursement Plan, seting a reimbursement with a null amount should leave it as is", async () => {
      // Arrange
      const reimbursementPlan = new ReimbursementPlan(0);

      // Act
      reimbursementPlan.setReimbursement(1, 0, 0);

      // Assert
      const expectedResult = "The group is balanced.";
      expect(reimbursementPlan.toString()).toEqual(expectedResult);
    });

    test("Given an empty Reimbursement Plan, seting 1 reimbursement, should display the corresponding string", async () => {
      // Arrange
      const reimbursementPlan = new ReimbursementPlan(0);

      // Act
      reimbursementPlan.setReimbursement(1, 0, 3);

      // Assert
      const expectedResult = "Member 1 owes 3 euros to member 0.";
      expect(reimbursementPlan.toString()).toEqual(expectedResult);
    });

    test("Given an empty Reimbursement Plan, seting 2 reimbursements with the same payer and payee, should display the string with only the last reimbursement", async () => {
      // Arrange
      const reimbursementPlan = new ReimbursementPlan(0);

      // Act
      reimbursementPlan.setReimbursement(1, 0, 3);
      reimbursementPlan.setReimbursement(1, 0, 1);

      // Assert
      const expectedResult = "Member 1 owes 1 euros to member 0.";
      expect(reimbursementPlan.toString()).toEqual(expectedResult);
    });

    test("Given an empty Reimbursement Plan, seting 2 reimbursements from the same member, should display the corresponding string", async () => {
      // Arrange
      const reimbursementPlan = new ReimbursementPlan(0);

      // Act
      reimbursementPlan.setReimbursement(1, 0, 3);
      reimbursementPlan.setReimbursement(1, 2, 2);

      // Assert
      const expectedResult =
        "Member 1 owes 3 euros to member 0, 2 euros to member 2.";
      expect(reimbursementPlan.toString()).toEqual(expectedResult);
    });

    test("Given an empty Reimbursement Plan, seting 2 reimbursements from different members to the same member, should display the corresponding string", async () => {
      // Arrange
      const reimbursementPlan = new ReimbursementPlan(0);

      // Act
      reimbursementPlan.setReimbursement(1, 0, 3);
      reimbursementPlan.setReimbursement(2, 0, 2);

      // Assert
      const expectedResult =
        "Member 1 owes 3 euros to member 0.\n" +
        "Member 2 owes 2 euros to member 0.";
      expect(reimbursementPlan.toString()).toEqual(expectedResult);
    });

    test("Given an empty Reimbursement Plan, seting 3 reimbursements, should display the corresponding string in the right order (ascending order of the indexes)", async () => {
      // Arrange
      const reimbursementPlan = new ReimbursementPlan(0);

      // Act
      reimbursementPlan.setReimbursement(1, 2, 3);
      reimbursementPlan.setReimbursement(0, 2, 2);
      reimbursementPlan.setReimbursement(0, 1, 1.5);

      // Assert
      const expectedResult =
        "Member 0 owes 1.5 euros to member 1, 2 euros to member 2.\n" +
        "Member 1 owes 3 euros to member 2.";
      expect(reimbursementPlan.toString()).toEqual(expectedResult);
    });

    test("Given an empty Reimbursement Plan, seting a reimbursement from a member to the same member should trigger an error", async () => {
      // Arrange
      const reimbursementPlan = new ReimbursementPlan(0);

      // Act

      // Assert
      expect(() => {
        reimbursementPlan.setReimbursement(0, 0, 3);
      }).toThrowError("A reimbursement cannot have the same payer and payee.");
    });

    test("Given an empty Reimbursement Plan, seting a reimbursement with a strictly negative amount should trigger an error", async () => {
      // Arrange
      const reimbursementPlan = new ReimbursementPlan(0);

      // Act

      // Assert
      expect(() => {
        reimbursementPlan.setReimbursement(0, 1, -1);
      }).toThrowError("A reimbursement cannot have a negative amount.");
    });
  });

  describe("getReimbursementAmount", () => {
    test("Given a Reimbursement Plan with 1 reimbursement, getting this reimbursement should return its amount", async () => {
      // Arrange
      const reimbursementPlan = new ReimbursementPlan(0);
      const expectedAmount = 3;
      reimbursementPlan.setReimbursement(1, 0, expectedAmount);

      // Act
      const amount = reimbursementPlan.getReimbursementAmount(1, 0);

      // Assert
      expect(amount).toEqual(expectedAmount);
    });

    test("Given a Reimbursement Plan with 1 reimbursement, getting a reimbursement with the same payerId but a different payeeId should return 0", async () => {
      // Arrange
      const reimbursementPlan = new ReimbursementPlan(0);
      reimbursementPlan.setReimbursement(1, 0, 3);

      // Act
      const amount = reimbursementPlan.getReimbursementAmount(1, 1);

      // Assert
      expect(amount).toEqual(0);
    });

    test("Given an empty Reimbursement Plan, getting a reimbursement should return 0", async () => {
      // Arrange
      const reimbursementPlan = new ReimbursementPlan(0);

      // Act
      const amount = reimbursementPlan.getReimbursementAmount(1, 1);

      // Assert
      expect(amount).toEqual(0);
    });
  });
});
