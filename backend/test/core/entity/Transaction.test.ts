import { describe, test, expect } from "vitest";
import { Transaction } from "src/core/entity/Transaction";

describe("Transaction", () => {
  describe("getDebtPerRecipient", () => {
    test("Given a Transaction with no recipients, it should return 0", async () => {
      // Arrange
      const transaction = new Transaction(0, 0, [], 3);

      // Act
      const reimbursementPlanString = transaction.getDebtPerRecipient();

      // Assert
      expect(reimbursementPlanString).toEqual(0);
    });

    test("Given a Transaction with one recipient and an amount of 3, it should return 3", async () => {
      // Arrange
      const transaction = new Transaction(0, 0, [0], 3);

      // Act
      const reimbursementPlanString = transaction.getDebtPerRecipient();

      // Assert
      expect(reimbursementPlanString).toEqual(3);
    });

    test("Given a Transaction with 3 recipients and an amount of 3, it should return 1", async () => {
      // Arrange
      const transaction = new Transaction(0, 0, [0, 1, 2], 3);

      // Act
      const reimbursementPlanString = transaction.getDebtPerRecipient();

      // Assert
      expect(reimbursementPlanString).toEqual(1);
    });
  });
});
