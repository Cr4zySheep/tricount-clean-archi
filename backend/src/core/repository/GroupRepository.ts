import { type Group } from "../entity/Group";

export interface GroupRepository {
  /**
   * Create a ne wpersisted group
   * @param name Group's name
   * @returns The created group
   */
  create: (name: string) => Promise<Group>;

  /**
   * Find a group by its id
   * @param id Group's id
   * @returns The found group or null
   */
  findById: (id: number) => Promise<Group | null>;

  /**
   * Save a group
   * @param group Group to save
   * @returns The saved group
   */
  save: (group: Group) => Promise<Group>;
}
