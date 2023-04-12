// Calcul group balance
import type { Group } from "./Group";
import { type GroupMember } from "./GroupMember";

export function addMemberToGroup(members: GroupMember[], group: Group): void {
  for (const member of members) {
    if (!group.members.includes(member)) {
      group.members.push(member);
    }
  }
}
