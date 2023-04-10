import type { ReimbursementPlan } from "src/core/entity/ReimbursementPlan";

export class ReimbursementPlanDTO {
  groupId: number;
  membersReimbursements: MemberReimbursements[];

  constructor(groupId: number, membersReimbursements: MemberReimbursements[]) {
    this.groupId = groupId;
    this.membersReimbursements = membersReimbursements;
  }

  public static fromEntity(
    reimbursementPlan: ReimbursementPlan
  ): ReimbursementPlanDTO {
    const newMemberReimbursements: MemberReimbursements[] = [];
    reimbursementPlan.reimbursementPerMemberId.forEach(
      (memberReimbursementsMap, memberId) => {
        newMemberReimbursements.push(
          MemberReimbursements.fromMap(memberId, memberReimbursementsMap)
        );
      }
    );
    return new ReimbursementPlanDTO(
      reimbursementPlan.groupId,
      newMemberReimbursements
    );
  }
}

export class MemberReimbursements {
  memberId: number;
  memberDueSums: MemberDueSumsToBeneficiary[];

  constructor(memberId: number, memberDueSums: MemberDueSumsToBeneficiary[]) {
    this.memberId = memberId;
    this.memberDueSums = memberDueSums;
  }

  public static fromMap(
    memberId: number,
    memberReimbursementsMap: Map<number, number>
  ): MemberReimbursements {
    const newMemberDueSums: MemberDueSumsToBeneficiary[] = [];
    memberReimbursementsMap.forEach((amount, beneficiaryId) => {
      newMemberDueSums.push(
        new MemberDueSumsToBeneficiary(beneficiaryId, amount)
      );
    });
    return new MemberReimbursements(memberId, newMemberDueSums);
  }
}

export class MemberDueSumsToBeneficiary {
  beneficiaryId: number;
  amount: number;

  constructor(beneficiaryId: number, amount: number) {
    this.beneficiaryId = beneficiaryId;
    this.amount = amount;
  }
}
