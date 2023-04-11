import { type FastifyInstance, type FastifyPluginAsync } from "fastify";
import { CreateGroup } from "src/core/usecase/CreateGroup";
import { type Static, Type } from "@sinclair/typebox";
import { RenameGroup } from "src/core/usecase/RenameGroup";
import { type GroupRepository } from "src/core/repository/GroupRepository";

const CreateGroupInputSchema = Type.Object({
  name: Type.String(),
});
type CreateGroupInput = Static<typeof CreateGroupInputSchema>;

const RenameGroupInputSchema = Type.Object({
  name: Type.String(),
});
type RenameGroupInput = Static<typeof RenameGroupInputSchema>;

const GroupIdSchema = Type.Object({
  id: Type.Number(),
});
type GroupId = Static<typeof GroupIdSchema>;

export const GroupController: FastifyPluginAsync<{
  repositories: { group: GroupRepository };
}> = async (fastify: FastifyInstance, options): Promise<void> => {
  const { group } = options.repositories;

  const createGroup = new CreateGroup(group);
  fastify.post<{ Body: CreateGroupInput }>(
    "/",
    { schema: { body: CreateGroupInputSchema, tags: ["group"] } },
    async (request, reply) => {
      const { name } = request.body;

      const result = await createGroup.execute(name);

      if (!result.success) {
        return reply.status(400).send({ error: result.error });
      }

      return reply.status(201).send(result.payload);
    }
  );

  const renameGroup = new RenameGroup(group);
  fastify.post<{ Body: RenameGroupInput; Params: GroupId }>(
    "/:id/rename",
    {
      schema: {
        body: RenameGroupInputSchema,
        params: GroupIdSchema,
        tags: ["group"],
      },
    },
    async (request, reply) => {
      const { name } = request.body;
      const groupId = request.params.id;

      const result = await renameGroup.execute(groupId, name);

      // TODO: Return 400 when error because of invalid input and 404 when group not found
      if (!result.success) {
        return reply.status(400).send({ error: result.error });
      }

      return result.payload;
    }
  );
};
