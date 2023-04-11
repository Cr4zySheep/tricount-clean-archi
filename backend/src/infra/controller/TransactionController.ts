import { type FastifyInstance, type FastifyPluginAsync } from "fastify";
import { type Static, Type } from "@sinclair/typebox";
import { type GroupRepository } from "src/core/repository/GroupRepository";
import { AddTransactionToGroup } from "src/core/usecase/AddTransactionToGroup";

const AddTransactionInputSchema = Type.Object({
  payerId: Type.Number(),
  recipientsId: Type.Array(Type.Number()),
  amount: Type.Number(),
});
type AddTransactionInput = Static<typeof AddTransactionInputSchema>;

const GroupIdSchema = Type.Object({
  groupId: Type.Number(),
});
type GroupId = Static<typeof GroupIdSchema>;

export const TransactionController: FastifyPluginAsync<{
  repositories: { group: GroupRepository };
}> = async (fastify: FastifyInstance, options): Promise<void> => {
  const { group } = options.repositories;

  const addTransactionToGroup = new AddTransactionToGroup(group);
  fastify.post<{ Body: AddTransactionInput; Params: GroupId }>(
    "/",
    { schema: { body: AddTransactionInputSchema, params: GroupIdSchema } },
    async (request, reply) => {
      const { payerId, recipientsId, amount } = request.body;

      const result = await addTransactionToGroup.execute(
        request.params.groupId,
        payerId,
        recipientsId,
        amount
      );

      if (!result.success) {
        return reply.status(400).send({ error: result.error });
      }

      return reply.status(201).send(result.payload);
    }
  );
};
