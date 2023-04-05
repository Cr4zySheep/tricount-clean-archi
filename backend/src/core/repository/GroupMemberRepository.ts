import { type GroupMember } from "../entity/GroupMember";

export interface GroupMemberRepository {
  create: (name: string) => Promise<GroupMember>;
}
