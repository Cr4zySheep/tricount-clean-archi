import { Result } from "src/utils";

export class GroupMember {
  /** Member's id */
  public readonly id: number;

  /** Member's name */
  public name: string;

  constructor(id: number, name: string) {
    this.id = id;
    this.name = name;
  }

  static validateName(name: any): Result<string> {
    if (typeof name !== "string") {
      return { success: false, error: "GroupMember name should be a string" };
    }

    if (name.length === 0) {
      return { success: false, error: "GroupMember name should not be empty" };
    }

    return { success: true, payload: name };
  }
}
