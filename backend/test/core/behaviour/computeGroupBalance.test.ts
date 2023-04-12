import { Group } from "src/core/entity/Group";
import { describe, test, expect, beforeEach } from "vitest";
import { GroupBalance } from "src/core/entity/GroupBalance";
import { computeGroupBalance } from "src/core/behaviour/computeGroupBalance";
import { GroupMember } from "src/core/entity/GroupMember";
import { Transaction } from "src/core/entity/Transaction";

describe("Compute group balance (entity)", () => {
  let members: GroupMember[];
  describe("Happy path", () => {
    describe("V0, transactions for the whole group ", () => {
      describe("Given a group of two members with one transaction", () => {
        beforeEach(() => {
          members = [new GroupMember(0, "Luc"), new GroupMember(1, "Jessica")];
        });
        test("with payerId 0 and amount 0 for the whole group, it should return a balance null", async () => {
          // Arrange
          const group = new Group(1, "group", members, [
            new Transaction(0, 0, [0, 1], 0),
          ]);

          // Act
          const result = computeGroupBalance(group);

          // Assert
          const expectedResult = new GroupBalance(
            1,
            new Map<number, number>([
              [0, 0],
              [1, 0],
            ])
          );
          expect(result).toEqual(expectedResult);
        });
        test("with payerId 0 and amount 2 for the whole group, it should return a balance {0 :1,1 :-1}", async () => {
          // Arrange
          const group = new Group(1, "group", members, [
            new Transaction(0, 0, [0, 1], 2),
          ]);

          // Act
          const result = computeGroupBalance(group);

          // Assert
          const expectedResult = new GroupBalance(
            1,
            new Map<number, number>([
              [0, 1],
              [1, -1],
            ])
          );
          expect(result).toEqual(expectedResult);
        });
        test("with payerId 0 and amount 3 for the whole group, it should return a balance {0 :3/2,1 :-3/2}", async () => {
          // Arrange
          const group = new Group(1, "group", members, [
            new Transaction(0, 0, [0, 1], 3),
          ]);

          // Act
          const result = computeGroupBalance(group);

          // Assert
          const expectedResult = new GroupBalance(
            1,
            new Map<number, number>([
              [0, Number((3 / 2).toFixed(10))],
              [1, Number((-3 / 2).toFixed(10))],
            ])
          );
          expect(result).toEqual(expectedResult);
        });
      });

      describe("Given a group of three members with one transaction", () => {
        beforeEach(() => {
          members = [
            new GroupMember(0, "Luc"),
            new GroupMember(1, "Jessica"),
            new GroupMember(2, "Théo"),
          ];
        });
        test("with payerId 0 and amount 0 for the whole group, it should return a balance null", async () => {
          // Arrange
          const group = new Group(1, "group", members, [
            new Transaction(0, 0, [0, 1, 2], 0),
          ]);

          // Act
          const result = computeGroupBalance(group);

          // Assert
          const expectedResult = new GroupBalance(
            1,
            new Map<number, number>([
              [0, 0],
              [1, 0],
              [2, 0],
            ])
          );
          expect(result).toEqual(expectedResult);
        });
        test("with payerId 0 and amount 3 for the whole group, it should return a balance {0 :2,1 :-1, 2 :-1}", async () => {
          // Arrange
          const group = new Group(1, "group", members, [
            new Transaction(0, 0, [0, 1, 2], 3),
          ]);

          // Act
          const result = computeGroupBalance(group);

          // Assert
          const expectedResult = new GroupBalance(
            1,
            new Map<number, number>([
              [0, 2],
              [1, -1],
              [2, -1],
            ])
          );
          expect(result).toEqual(expectedResult);
        });
        test("with payerId 0 and amount 4 for the whole group, it should return a balance {0 :8/3,1 :-4/3, 2 :-4/3}", async () => {
          // Arrange
          const group = new Group(1, "group", members, [
            new Transaction(0, 0, [0, 1, 2], 4),
          ]);

          // Act
          const result = computeGroupBalance(group);

          // Assert
          const expectedResult = new GroupBalance(
            1,
            new Map<number, number>([
              [0, Number((8 / 3).toFixed(10))],
              [1, Number((-4 / 3).toFixed(10))],
              [2, Number((-4 / 3).toFixed(10))],
            ])
          );
          expect(result).toEqual(expectedResult);
        });
      });

      describe("Given a group of two members with two transactions", () => {
        beforeEach(() => {
          members = [new GroupMember(0, "Luc"), new GroupMember(1, "Jessica")];
        });
        test("with payerId 0 and amount 0, it should return a balance null", async () => {
          // Arrange
          const group = new Group(1, "group", members, [
            new Transaction(0, 0, [0, 1], 0),
            new Transaction(0, 0, [0, 1], 0),
          ]);

          // Act
          const result = computeGroupBalance(group);

          // Assert
          const expectedResult = new GroupBalance(
            1,
            new Map<number, number>([
              [0, 0],
              [1, 0],
            ])
          );
          expect(result).toEqual(expectedResult);
        });
        test("with payerId 0 and amount 1, it should return a balance {0 :1,1 :-1}", async () => {
          // Arrange
          const group = new Group(1, "group", members, [
            new Transaction(0, 0, [0, 1], 1),
            new Transaction(0, 0, [0, 1], 1),
          ]);

          // Act
          const result = computeGroupBalance(group);

          // Assert
          const expectedResult = new GroupBalance(
            1,
            new Map<number, number>([
              [0, 1],
              [1, -1],
            ])
          );
          expect(result).toEqual(expectedResult);
        });
      });
      describe("Given a group of three members with two transactions", () => {
        beforeEach(() => {
          members = [
            new GroupMember(0, "Luc"),
            new GroupMember(1, "Jessica"),
            new GroupMember(2, "Théo"),
          ];
        });
        test("with transaction 1 :payerId 0 and amount 3 transaction 2 :payerId 0 and amount 2, it should return a balance {0 :10/3 ,1 :-5/3, 2 :-5/3}.", async () => {
          // Arrange
          const group = new Group(1, "group", members, [
            new Transaction(0, 0, [0, 1, 2], 3),
            new Transaction(0, 0, [0, 1, 2], 2),
          ]);

          // Act
          const result = computeGroupBalance(group);

          // Assert
          const expectedResult = new GroupBalance(
            1,
            new Map<number, number>([
              [0, Number((10 / 3).toFixed(10))],
              [1, Number((-5 / 3).toFixed(10))],
              [2, Number((-5 / 3).toFixed(10))],
            ])
          );
          expect(result).toEqual(expectedResult);
        });
      });
    });
    describe("V1, transactions for some members only ", () => {
      describe("Given a group of two members with one transaction", () => {
        beforeEach(() => {
          members = [new GroupMember(0, "Luc"), new GroupMember(1, "Jessica")];
        });
        test("with payerId 0 and amount 0 for 0, it should return a balance null", async () => {
          // Arrange
          const group = new Group(1, "group", members, [
            new Transaction(0, 0, [0], 0),
          ]);

          // Act
          const result = computeGroupBalance(group);

          // Assert
          const expectedResult = new GroupBalance(
            1,
            new Map<number, number>([
              [0, 0],
              [1, 0],
            ])
          );
          expect(result).toEqual(expectedResult);
        });
        test("with payerId 0 and amount 1 for 1, it should return a balance {0 :1,1 :-1}", async () => {
          // Arrange
          const group = new Group(1, "group", members, [
            new Transaction(0, 0, [1], 1),
          ]);

          // Act
          const result = computeGroupBalance(group);

          // Assert
          const expectedResult = new GroupBalance(
            1,
            new Map<number, number>([
              [0, 1],
              [1, -1],
            ])
          );
          expect(result).toEqual(expectedResult);
        });
      });
      describe("Given a group of two members that with two transactions", () => {
        beforeEach(() => {
          members = [new GroupMember(0, "Luc"), new GroupMember(1, "Jessica")];
        });
        test("with transaction 1 :payerId 1 and amount 3 for whole group, transaction 2 :payerId 1 and amount 1 for member 0, it should return a balance {0 :-2.5,1 :2.5}.", async () => {
          // Arrange
          const group = new Group(1, "group", members, [
            new Transaction(1, 1, [0, 1], 3),
            new Transaction(2, 1, [0], 1),
          ]);

          // Act
          const result = computeGroupBalance(group);

          // Assert
          const expectedResult = new GroupBalance(
            1,
            new Map<number, number>([
              [0, -2.5],
              [1, 2.5],
            ])
          );
          expect(result).toEqual(expectedResult);
        });
      });
      describe("Given a group of two members with two transactions, membersId starting at 1", () => {
        beforeEach(() => {
          members = [new GroupMember(1, "Luc"), new GroupMember(2, "Jessica")];
        });
        test("with transaction 1 :payerId 1 and amount 3 for whole group, transaction 2 :payerId 1 and amount 1 for member 0, it should return a balance {0 :-2.5,1 :2.5}.", async () => {
          // Arrange
          const group = new Group(1, "group", members, [
            new Transaction(1, 1, [1, 2], 3),
            new Transaction(2, 1, [2], 1),
          ]);

          // Act
          const result = computeGroupBalance(group);

          // Assert
          const expectedResult = new GroupBalance(
            1,
            new Map<number, number>([
              [1, 2.5],
              [2, -2.5],
            ])
          );
          expect(result).toEqual(expectedResult);
        });
      });
      describe("Given a group of three members with one transaction", () => {
        beforeEach(() => {
          members = [
            new GroupMember(0, "Luc"),
            new GroupMember(1, "Jessica"),
            new GroupMember(2, "Théo"),
          ];
        });
        test("with payerId 0 and amount 1 for member 1, it should return a balance {0 :1,1 :-1, 2 :-0}", async () => {
          // Arrange
          const group = new Group(1, "group", members, [
            new Transaction(0, 0, [1], 1),
          ]);

          // Act
          const result = computeGroupBalance(group);

          // Assert
          const expectedResult = new GroupBalance(
            1,
            new Map<number, number>([
              [0, 1],
              [1, -1],
              [2, 0],
            ])
          );
          expect(result).toEqual(expectedResult);
        });
        test("with payerId 0 and amount 1 for members 1 and 2, it should return a balance {0 :1, 1 :-0.5, 2 :-0.5}..", async () => {
          // Arrange
          const group = new Group(1, "group", members, [
            new Transaction(0, 0, [1, 2], 1),
          ]);

          // Act
          const result = computeGroupBalance(group);

          // Assert
          const expectedResult = new GroupBalance(
            1,
            new Map<number, number>([
              [0, 1],
              [1, -0.5],
              [2, -0.5],
            ])
          );
          expect(result).toEqual(expectedResult);
        });
      });
      describe("Given a group of three members with two transactions", () => {
        beforeEach(() => {
          members = [
            new GroupMember(0, "Luc"),
            new GroupMember(1, "Jessica"),
            new GroupMember(2, "Théo"),
          ];
        });
        test("with transaction 1 :payerId 0 and amount 3 for member 1, transaction 2 :payerId 1 and amount 2 for whole group, it should return a balance {0 :1/3,1 :1/3, 2 :-2/3}.", async () => {
          // Arrange
          const group = new Group(1, "group", members, [
            new Transaction(0, 0, [1], 1),
            new Transaction(0, 1, [0, 1, 2], 2),
          ]);

          // Act
          const result = computeGroupBalance(group);

          // Assert
          const expectedResult = new GroupBalance(
            1,
            new Map<number, number>([
              [0, Number((1 / 3).toFixed(10))],
              [1, Number((1 / 3).toFixed(10))],
              [2, Number((-2 / 3).toFixed(10))],
            ])
          );
          expect(result).toEqual(expectedResult);
        });
      });
    });
  });
  describe("Unhappy path", () => {
    test("Given a group without members, it should return an empty balance", async () => {
      // Arrange
      const group = new Group(
        1,
        "group",
        [],
        [new Transaction(0, 0, [], 3), new Transaction(0, 0, [], 2)]
      );

      // Act
      const result = computeGroupBalance(group);

      // Assert
      const expectedResult = new GroupBalance(1, new Map<number, number>());
      expect(result).toEqual(expectedResult);
    });
    test("Given a group without transactions, it should return a balance {0 :0 ,1 :0, 2 :0}.", async () => {
      // Arrange
      members = [
        new GroupMember(0, "Luc"),
        new GroupMember(1, "Jessica"),
        new GroupMember(2, "Théo"),
      ];

      // Act
      const group = new Group(1, "group", members, []);
      const result = computeGroupBalance(group);

      // Assert
      const expectedResult = new GroupBalance(
        1,
        new Map<number, number>([
          [0, 0],
          [1, 0],
          [2, 0],
        ])
      );
      expect(result).toEqual(expectedResult);
    });
  });
});
