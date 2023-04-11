import { GroupBalance } from "src/core/entity/GroupBalance";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { GroupBalanceDTO, MemberBalance } from "src/infra/dto/GroupBalance.dto";

describe("GroupBalanceDTO", () => {
  describe("Return group balance DTO from group balance", () => {
    let balanceMapTest: Map<number, number>;

    beforeEach(async () => {
      balanceMapTest = new Map<number, number>();
    });
    test("Given an empty groupBalance, it should successfully return the group balance DTO with an empty MemeberBalance Array", async () => {
      // Arrange
      const groupBalance = new GroupBalance(0, balanceMapTest);

      // Act
      const result = GroupBalanceDTO.fromEntries(groupBalance);

      // Assert
      const expectedResult = new GroupBalanceDTO(0, new Array<MemberBalance>());
      expect(result).toEqual(expectedResult);
    });
    test("Given a groupBalance with one user, it should successfully return the group balance DTO with an Array [MemeberBalance(0,0)] ", async () => {
      // Arrange
      balanceMapTest.set(0, 0);
      const groupBalance = new GroupBalance(0, balanceMapTest);

      // Act
      const result = GroupBalanceDTO.fromEntries(groupBalance);

      // Assert
      const expectedBalanceDTO = [new MemberBalance(0, 0)];
      const expectedResult = new GroupBalanceDTO(0, expectedBalanceDTO);
      expect(result).toEqual(expectedResult);
    });
    test("Given a groupBalance with multiple users, it should successfully return the group balance DTO with the same reimbursment values ", async () => {
      // Arrange
      balanceMapTest.set(0, -0.5);
      balanceMapTest.set(1, -0.25);
      balanceMapTest.set(2, 0.75);
      const groupBalance = new GroupBalance(0, balanceMapTest);

      // Act
      const result = GroupBalanceDTO.fromEntries(groupBalance);

      // Assert
      const expectedBalanceDTO = [
        new MemberBalance(0, -0.5),
        new MemberBalance(1, -0.25),
        new MemberBalance(2, 0.75),
      ];
      const expectedResult = new GroupBalanceDTO(0, expectedBalanceDTO);
      expect(result).toEqual(expectedResult);
    });
  });
});
