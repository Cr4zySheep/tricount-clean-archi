export class GroupBalance {
  /** Id of the group from which this balance was calculated */
  public readonly groupId: number;

  /**
   * Balance of each members.
   * - A negative amount means that this user owns money to the group.
   * - A positive amount means that the group owns money to this user.
   */
  public balancePerMemberId: Map<number, number>;

  constructor(groupId: number, balancePerMemberId: Map<number, number>) {
    this.groupId = groupId;
    this.balancePerMemberId = balancePerMemberId;
  }
}
