import { type GroupBalance } from "src/core/entity/GroupBalance";

export class GroupBalanceDTO {
  private readonly groupId: number;
  private readonly groupBalance: MemberBalance[];

  constructor(groupId: number, groupBalance: MemberBalance[]) {
    this.groupId = groupId;
    this.groupBalance = groupBalance;
  }

  static fromEntries(groupBalance: GroupBalance): GroupBalanceDTO {
    const groupId = groupBalance.groupId;
    const balancePerMember = new Array<MemberBalance>();
    groupBalance.balancePerMemberId.forEach((balance, memberId) => {
      const memberBalance = new MemberBalance(memberId, balance);
      balancePerMember.push(memberBalance);
    });
    return new GroupBalanceDTO(groupId, balancePerMember);
  }
}

export class MemberBalance {
  private readonly memberId: number;
  private readonly balance: number;
  constructor(memberId: number, balance: number) {
    this.memberId = memberId;
    this.balance = balance;
  }
}
