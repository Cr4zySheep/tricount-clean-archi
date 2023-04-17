import { type Static, Type } from "@sinclair/typebox";
import { type FastifyPluginAsync } from "fastify";
import { type GroupRepository } from "src/core/repository/GroupRepository";
import { AddMemberToGroupUseCase } from "src/core/usecase/AddMemberToGroupUseCase";
import { RemoveMemberFromGroupUseCase } from "src/core/usecase/RemoveMemberFromGroupUseCase";

const GroupIdSchema = Type.Object({
  groupId: Type.Number(),
});
type GroupId = Static<typeof GroupIdSchema>;

const AddMemberInputSchema = Type.Object({
  username: Type.String(),
});
type AddMemberInput = Static<typeof AddMemberInputSchema>;

const RemoveMemberParamsSchema = Type.Object({
  groupId: Type.Number(),
  memberId: Type.Number(),
});
type RemoveMemberParams = Static<typeof RemoveMemberParamsSchema>;

export const GroupMemberController: FastifyPluginAsync<{
  repositories: { group: GroupRepository };
}> = async (fastify, options): Promise<void> => {
  const { group } = options.repositories;

  const addMemberToGroup = new AddMemberToGroupUseCase(group);
  fastify.post<{ Params: GroupId; Body: AddMemberInput }>(
    "/",
    {
      schema: {
        params: GroupIdSchema,
        body: AddMemberInputSchema,
        description: "Add a member to an existing group",
        tags: ["group-member"],
      },
    },
    async (request, reply) => {
      const result = await addMemberToGroup.execute(
        request.body.username,
        request.params.groupId
      );

      if (!result.success) {
        return reply.status(400).send({ error: result.error });
      }

      return reply.status(201).send(result.payload);
    }
  );

  const removeMemberFromGroup = new RemoveMemberFromGroupUseCase(group);
  fastify.delete<{ Params: RemoveMemberParams }>(
    "/:memberId",
    {
      schema: {
        params: RemoveMemberParamsSchema,
        description: "Remove a member from a group",
        tags: ["group-member"],
      },
    },
    async (request, reply) => {
      const result = await removeMemberFromGroup.execute(
        request.params.memberId,
        request.params.groupId
      );
      if (!result.success) {
        return reply.status(400).send({ error: result.error });
      }

      return reply.status(200).send(result.payload);
    }
  );
};
