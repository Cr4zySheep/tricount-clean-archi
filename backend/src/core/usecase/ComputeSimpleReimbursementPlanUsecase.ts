import type { Result } from "src/utils";
import type { GroupRepository } from "../repository/GroupRepository";
import type { ReimbursementPlan } from "../entity/ReimbursementPlan";
import { computeSimpleReimbursementPlan } from "../behaviour/computeSimpleReimbursementPlan";

export interface IComputeSimpleReimbursementPlanUsecase {
  execute: (groupId: number) => Promise<Result<ReimbursementPlan>>;
}

export type ComputeSimpleReimbursementPlanUsecaseRequestObject = Parameters<
  IComputeSimpleReimbursementPlanUsecase["execute"]
>;
export type ComputeSimpleReimbursementPlanUsecaseResponseObject = ReturnType<
  IComputeSimpleReimbursementPlanUsecase["execute"]
>;

export class ComputeSimpleReimbursementPlanUsecase
  implements IComputeSimpleReimbursementPlanUsecase
{
  constructor(private readonly groupRepo: GroupRepository) {}

  async execute(groupId: number): Promise<Result<ReimbursementPlan>> {
    const group = await this.groupRepo.findById(groupId);

    if (group === null) {
      return {
        success: false,
        error: "Group not found",
      };
    }

    const reimbursementPlan = computeSimpleReimbursementPlan(group);

    return {
      success: true,
      payload: reimbursementPlan,
    };
  }
}
