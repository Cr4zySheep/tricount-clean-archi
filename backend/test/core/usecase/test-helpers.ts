import type { GroupRepository } from "src/core/repository/GroupRepository";
import { vi } from "vitest";

export const GroupRepositoryMock = vi.fn<any, GroupRepository>(() => ({
  create: vi.fn(),
  findById: vi.fn().mockResolvedValue(null),
  save: vi.fn(async (group) => Promise.resolve(group)),
}));
