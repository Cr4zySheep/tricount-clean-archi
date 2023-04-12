// Calcul group balance
import type { Group } from "./Group";
import { type GroupMember } from "./GroupMember";

export function removeMemberFromGroup(
  members: GroupMember[],
  group: Group
): void {
  for (const member of members) {
    if (group.members.includes(member)) {
      const memberIndex = group.members.indexOf(member);
      group.members.splice(memberIndex, 1);
    }
  }
}
