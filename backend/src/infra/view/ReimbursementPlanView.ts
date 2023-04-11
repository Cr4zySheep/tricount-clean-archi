import type { ReimbursementPlan } from "src/core/entity/ReimbursementPlan";

export class ReimbursementPlanView {
  groupId: number;
  membersReimbursements: MemberReimbursements[];

  constructor(groupId: number, membersReimbursements: MemberReimbursements[]) {
    this.groupId = groupId;
    this.membersReimbursements = membersReimbursements;
  }

  public static fromEntity(
    reimbursementPlan: ReimbursementPlan
  ): ReimbursementPlanView {
    const newMemberReimbursements: MemberReimbursements[] = [];
    reimbursementPlan.reimbursementPerMemberId.forEach(
      (memberReimbursementsMap, memberId) => {
        newMemberReimbursements.push(
          MemberReimbursements.fromMap(memberId, memberReimbursementsMap)
        );
      }
    );
    return new ReimbursementPlanView(
      reimbursementPlan.groupId,
      newMemberReimbursements
    );
  }
}

export class MemberReimbursements {
  memberId: number;
  memberDueSums: DueSumToBeneficiary[];

  constructor(memberId: number, memberDueSums: DueSumToBeneficiary[]) {
    this.memberId = memberId;
    this.memberDueSums = memberDueSums;
  }

  public static fromMap(
    memberId: number,
    memberReimbursementsMap: Map<number, number>
  ): MemberReimbursements {
    const newMemberDueSums: DueSumToBeneficiary[] = [];
    memberReimbursementsMap.forEach((amount, beneficiaryId) => {
      newMemberDueSums.push(new DueSumToBeneficiary(beneficiaryId, amount));
    });
    return new MemberReimbursements(memberId, newMemberDueSums);
  }
}

export class DueSumToBeneficiary {
  beneficiaryId: number;
  amount: number;

  constructor(beneficiaryId: number, amount: number) {
    this.beneficiaryId = beneficiaryId;
    this.amount = amount;
  }
}
