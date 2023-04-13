import { type Result } from "src/utils";
import type { GroupRepository } from "../repository/GroupRepository";
import type { GroupBalance } from "../entity/GroupBalance";
import { computeGroupBalance } from "../behaviour/computeGroupBalance";

export interface IComputeGroupBalanceUseCase {
  execute: (id: number) => Promise<Result<GroupBalance>>;
}

export type ComputeGroupBalanceUseCaseRequestObject = Parameters<
  IComputeGroupBalanceUseCase["execute"]
>;
export type ComputeGroupBalanceUseCaseResponseObject = ReturnType<
  IComputeGroupBalanceUseCase["execute"]
>;

export class ComputeGroupBalanceUseCase implements IComputeGroupBalanceUseCase {
  constructor(private readonly groupRepo: GroupRepository) {}

  async execute(groupId: number): Promise<Result<GroupBalance>> {
    const groupFound = await this.groupRepo.findById(groupId);
    if (groupFound == null) {
      return {
        success: false,
        error: "Group not found",
      };
    }

    const groupBalance = computeGroupBalance(groupFound);

    return {
      success: true,
      payload: groupBalance,
    };
  }
}
