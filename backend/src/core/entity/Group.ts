import type { Result } from "src/utils";
import type { GroupMember } from "./GroupMember";
import type { Transaction } from "./Transaction";

export class Group {
  /** Group's id */
  public readonly id: number;

  /** Group's name */
  public name: string;

  /** Group members */
  public members: GroupMember[];

  /** Group transactions */
  public transactions: Transaction[];

  constructor(
    id: number,
    name: string,
    members: GroupMember[],
    transactions: Transaction[]
  ) {
    this.id = id;
    this.name = name;
    this.members = members;
    this.transactions = transactions;
  }

  static validateName(name: any): Result<string> {
    if (typeof name !== "string") {
      return { success: false, error: "Group name should be a string" };
    }

    if (name.length === 0) {
      return { success: false, error: "Group name should not be empty" };
    }

    return { success: true, payload: name };
  }
}