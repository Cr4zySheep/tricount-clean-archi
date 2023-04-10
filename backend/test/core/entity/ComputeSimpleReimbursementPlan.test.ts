import { Group } from "src/core/entity/Group";
import { describe, test, expect } from "vitest";
import { GroupMember } from "src/core/entity/GroupMember";
import { Transaction } from "src/core/entity/Transaction";
import { ComputeSimpleReimbursementPlan } from "src/core/entity/ComputeSimpleReimbursementPlan";

describe("Reimbursement Plan", () => {
  describe("Compute Simple Reimbursement Plan", () => {
    describe("Single transaction case", () => {
      test("Given a group with 2 members, 0 paid 3 euros for the group", async () => {
        // Arrange
        const member0 = new GroupMember(0, "0");
        const member1 = new GroupMember(1, "1");
        const transaction = new Transaction(
          0,
          member0.id,
          [member0.id, member1.id],
          3
        );
        const group = new Group(
          0,
          "group name",
          [member0, member1],
          [transaction]
        );
        const computeSimpleReimbursementPlan =
          new ComputeSimpleReimbursementPlan();

        // Act
        const reimbursementPlan = computeSimpleReimbursementPlan.compute(group);

        // Assert
        const expectedResult = "Member 1 owes 1.5 euros to member 0.";
        expect(reimbursementPlan.groupId).toEqual(group.id);
        expect(reimbursementPlan.toString()).toEqual(expectedResult);
      });

      test("Given a group with 3 members, 0 paid 3 euros for the group", async () => {
        // Arrange
        const member0 = new GroupMember(0, "0");
        const member1 = new GroupMember(1, "1");
        const member2 = new GroupMember(2, "1");
        const transaction = new Transaction(
          0,
          member0.id,
          [member0.id, member1.id, member2.id],
          3
        );
        const group = new Group(
          0,
          "group name",
          [member0, member1, member2],
          [transaction]
        );
        const computeSimpleReimbursementPlan =
          new ComputeSimpleReimbursementPlan();

        // Act
        const reimbursementPlan = computeSimpleReimbursementPlan.compute(group);

        // Assert
        const expectedResult =
          "Member 1 owes 1 euros to member 0.\n" +
          "Member 2 owes 1 euros to member 0.";
        expect(reimbursementPlan.groupId).toEqual(group.id);
        expect(reimbursementPlan.toString()).toEqual(expectedResult);
      });

      test("Given a group with 3 members, 0 paid 2 euros for the group (last cent problem)", async () => {
        // Arrange
        const member0 = new GroupMember(0, "0");
        const member1 = new GroupMember(1, "1");
        const member2 = new GroupMember(2, "1");
        const transaction = new Transaction(
          0,
          member0.id,
          [member0.id, member1.id, member2.id],
          2
        );
        const group = new Group(
          0,
          "group name",
          [member0, member1, member2],
          [transaction]
        );
        const computeSimpleReimbursementPlan =
          new ComputeSimpleReimbursementPlan();

        // Act
        const reimbursementPlan = computeSimpleReimbursementPlan.compute(group);

        // Assert
        const expectedResult =
          "Member 1 owes 0.66 euros to member 0.\n" +
          "Member 2 owes 0.66 euros to member 0.";
        expect(reimbursementPlan.groupId).toEqual(group.id);
        expect(reimbursementPlan.toString()).toEqual(expectedResult);
      });

      test("Given a group with 3 members, 0 paid 3 euros for 0 and 1", async () => {
        // Arrange
        const member0 = new GroupMember(0, "0");
        const member1 = new GroupMember(1, "1");
        const member2 = new GroupMember(2, "1");
        const transaction = new Transaction(
          0,
          member0.id,
          [member0.id, member1.id],
          3
        );
        const group = new Group(
          0,
          "group name",
          [member0, member1, member2],
          [transaction]
        );

        const computeSimpleReimbursementPlan =
          new ComputeSimpleReimbursementPlan();

        // Act
        const reimbursementPlan = computeSimpleReimbursementPlan.compute(group);

        // Assert
        const expectedResult = "Member 1 owes 1.5 euros to member 0.";
        expect(reimbursementPlan.groupId).toEqual(group.id);
        expect(reimbursementPlan.toString()).toEqual(expectedResult);
      });
    });

    describe("Two transactions case", () => {
      test("Given a group with 2 members, 0 paid 3 euros for the group and 1 paid 1 euro for the group", async () => {
        // Arrange
        const member0 = new GroupMember(0, "0");
        const member1 = new GroupMember(1, "1");
        const transaction0 = new Transaction(
          0,
          member0.id,
          [member0.id, member1.id],
          3
        );
        const transaction1 = new Transaction(
          1,
          member1.id,
          [member0.id, member1.id],
          1
        );
        const group = new Group(
          0,
          "group name",
          [member0, member1],
          [transaction0, transaction1]
        );

        const computeSimpleReimbursementPlan =
          new ComputeSimpleReimbursementPlan();

        // Act
        const reimbursementPlan = computeSimpleReimbursementPlan.compute(group);

        // Assert
        const expectedResult = "Member 1 owes 1 euros to member 0.";
        expect(reimbursementPlan.groupId).toEqual(group.id);
        expect(reimbursementPlan.toString()).toEqual(expectedResult);
      });

      test("Given a group with 2 members, 0 paid 3 euros for the group and then paid 1 euro for the group", async () => {
        // Arrange
        const member0 = new GroupMember(0, "0");
        const member1 = new GroupMember(1, "1");
        const transaction0 = new Transaction(
          0,
          member0.id,
          [member0.id, member1.id],
          3
        );
        const transaction1 = new Transaction(
          1,
          member0.id,
          [member0.id, member1.id],
          1
        );
        const group = new Group(
          0,
          "group name",
          [member0, member1],
          [transaction0, transaction1]
        );

        const computeSimpleReimbursementPlan =
          new ComputeSimpleReimbursementPlan();

        // Act
        const reimbursementPlan = computeSimpleReimbursementPlan.compute(group);

        // Assert
        const expectedResult = "Member 1 owes 2 euros to member 0.";
        expect(reimbursementPlan.groupId).toEqual(group.id);
        expect(reimbursementPlan.toString()).toEqual(expectedResult);
      });

      test("Given a group with 2 members, 0 and 1 paid both 2 euros for the group", async () => {
        // Arrange
        const member0 = new GroupMember(0, "0");
        const member1 = new GroupMember(1, "1");
        const transaction0 = new Transaction(
          0,
          member0.id,
          [member0.id, member1.id],
          2
        );
        const transaction1 = new Transaction(
          1,
          member1.id,
          [member0.id, member1.id],
          2
        );
        const group = new Group(
          0,
          "group name",
          [member0, member1],
          [transaction0, transaction1]
        );

        const computeSimpleReimbursementPlan =
          new ComputeSimpleReimbursementPlan();

        // Act
        const reimbursementPlan = computeSimpleReimbursementPlan.compute(group);

        // Assert
        const expectedResult = "The group is balanced.";
        expect(reimbursementPlan.groupId).toEqual(group.id);
        expect(reimbursementPlan.toString()).toEqual(expectedResult);
      });

      test("Given a group with 3 members, 0 paid 3 euros for the group and 1 paid 1 euro for the group", async () => {
        // Arrange
        const member0 = new GroupMember(0, "0");
        const member1 = new GroupMember(1, "1");
        const member2 = new GroupMember(2, "2");
        const transaction0 = new Transaction(
          0,
          member0.id,
          [member0.id, member1.id, member2.id],
          3
        );
        const transaction1 = new Transaction(
          1,
          member1.id,
          [member0.id, member1.id, member2.id],
          1
        );
        const group = new Group(
          0,
          "group name",
          [member0, member1, member2],
          [transaction0, transaction1]
        );

        const computeSimpleReimbursementPlan =
          new ComputeSimpleReimbursementPlan();

        // Act
        const reimbursementPlan = computeSimpleReimbursementPlan.compute(group);

        // Assert
        const expectedResult =
          "Member 1 owes 0.66 euros to member 0.\n" +
          "Member 2 owes 1 euros to member 0, 0.33 euros to member 1.";
        expect(reimbursementPlan.groupId).toEqual(group.id);
        expect(reimbursementPlan.toString()).toEqual(expectedResult);
      });

      test("Given a group with 3 members, 0 paid 3 euros for 1 and 2, 1 paid 1 euro for 0 and 1", async () => {
        // Arrange
        const member0 = new GroupMember(0, "0");
        const member1 = new GroupMember(1, "1");
        const member2 = new GroupMember(2, "2");
        const transaction0 = new Transaction(
          0,
          member0.id,
          [member1.id, member2.id],
          3
        );
        const transaction1 = new Transaction(
          1,
          member1.id,
          [member0.id, member1.id],
          1
        );
        const group = new Group(
          0,
          "group name",
          [member0, member1, member2],
          [transaction0, transaction1]
        );

        const computeSimpleReimbursementPlan =
          new ComputeSimpleReimbursementPlan();

        // Act
        const reimbursementPlan = computeSimpleReimbursementPlan.compute(group);

        // Assert
        const expectedResult =
          "Member 1 owes 1 euros to member 0.\n" +
          "Member 2 owes 1.5 euros to member 0.";
        expect(reimbursementPlan.groupId).toEqual(group.id);
        expect(reimbursementPlan.toString()).toEqual(expectedResult);
      });
    });

    describe("Three or more transactions case", () => {
      test("Given a group with 3 members, 2 paid 1.5 euros for the group, 0 paid 3 euros for the group, 1 paid 1 euro for the group, 2 paid 2.5 for the group", async () => {
        // Arrange
        const member0 = new GroupMember(0, "0");
        const member1 = new GroupMember(1, "1");
        const member2 = new GroupMember(2, "2");

        const transaction0 = new Transaction(
          0,
          member2.id,
          [member0.id, member1.id, member2.id],
          1.5
        );
        const transaction1 = new Transaction(
          1,
          member0.id,
          [member0.id, member1.id, member2.id],
          3
        );
        const transaction2 = new Transaction(
          2,
          member1.id,
          [member0.id, member1.id, member2.id],
          1
        );
        const transaction3 = new Transaction(
          3,
          member2.id,
          [member0.id, member1.id, member2.id],
          2.5
        );
        const group = new Group(
          0,
          "group name",
          [member0, member1, member2],
          [transaction0, transaction1, transaction2, transaction3]
        );

        const computeSimpleReimbursementPlan =
          new ComputeSimpleReimbursementPlan();

        // Act
        const reimbursementPlan = computeSimpleReimbursementPlan.compute(group);

        // Assert
        const expectedResult =
          "Member 0 owes 0.33 euros to member 2.\n" +
          "Member 1 owes 0.66 euros to member 0, 1 euros to member 2.";
        expect(reimbursementPlan.groupId).toEqual(group.id);
        expect(reimbursementPlan.toString()).toEqual(expectedResult);
      });

      test("Given a group with 3 members, 2 paid 1.25 euros for 1 and 2, 0 paid 3 euros for 1, 2 paid 2.75 euros for the group", async () => {
        // Arrange
        const member0 = new GroupMember(0, "0");
        const member1 = new GroupMember(1, "1");
        const member2 = new GroupMember(2, "2");

        const transaction0 = new Transaction(
          0,
          member2.id,
          [member1.id, member2.id],
          1.25
        );
        const transaction1 = new Transaction(1, member0.id, [member1.id], 3);
        const transaction2 = new Transaction(
          2,
          member2.id,
          [member0.id, member1.id, member2.id],
          2.75
        );
        const group = new Group(
          0,
          "group name",
          [member0, member1, member2],
          [transaction0, transaction1, transaction2]
        );

        const computeSimpleReimbursementPlan =
          new ComputeSimpleReimbursementPlan();

        // Act
        const reimbursementPlan = computeSimpleReimbursementPlan.compute(group);

        // Assert
        const expectedResult =
          "Member 0 owes 0.91 euros to member 2.\n" +
          "Member 1 owes 3 euros to member 0, 1.54 euros to member 2.";
        expect(reimbursementPlan.groupId).toEqual(group.id);
        expect(reimbursementPlan.toString()).toEqual(expectedResult);
      });
    });
  });
});
