import { type Result } from "src/utils";
import type { GroupRepository } from "../repository/GroupRepository";
import type { GroupBalance } from "../entity/GroupBalance";
import { CalculGroupBalance } from "../entity/CalculGroupBalance";

export interface ICalculGroupBalanceUseCase {
  execute: (id: number) => Promise<Result<GroupBalance>>;
}

export type CalculGroupBalanceUseCaseRequestObject = Parameters<
  ICalculGroupBalanceUseCase["execute"]
>;
export type CalculGroupBalanceUseCaseResponseObject = ReturnType<
  ICalculGroupBalanceUseCase["execute"]
>;

export class CalculGroupBalanceUseCase implements ICalculGroupBalanceUseCase {
  constructor(private readonly groupRepo: GroupRepository) {}

  async execute(groupId: number): Promise<Result<GroupBalance>> {
    const groupFound = await this.groupRepo.findById(groupId);
    if (groupFound == null) {
      return {
        success: false,
        error: "Group id does not exist",
      };
    }

    const groupBalance = new CalculGroupBalance().calcul(groupFound);

    return {
      success: true,
      payload: groupBalance,
    };
  }
}
