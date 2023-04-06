import { type GroupRepository } from "src/core/repository/GroupRepository";
import { GroupRepositoryInMemory } from "./GroupRepositoryInMemory";

/**
 * All available repositories injected in controllers
 */
export interface Repositories {
  group: GroupRepository;
}

export function createRepositories(): Repositories {
  return { group: new GroupRepositoryInMemory() };
}
