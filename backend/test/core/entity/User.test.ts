import { User } from "src/core/entity/User";
import { assert, expect, test, describe } from "vitest";

describe("User", () => {
  describe("fullName", () => {
    test("Given a user with the first name 'John' and last name 'Smith', its full name should be 'John Smith'", () => {
      const user = new User("John", "Smith");

      expect(user.fullName).toBe("John Smith");
    });
  });
});
