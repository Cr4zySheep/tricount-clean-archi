import { type FastifyInstance, type FastifyPluginAsync } from "fastify";
import { CreateGroup } from "src/core/usecase/CreateGroup";
import { type Static, Type } from "@sinclair/typebox";
import { RenameGroup } from "src/core/usecase/RenameGroup";
import { type GroupRepository } from "src/core/repository/GroupRepository";
import { TransactionController } from "./TransactionController";
import { ComputeSimpleReimbursementPlanUsecase } from "src/core/usecase/ComputeSimpleReimbursementPlanUsecase";
import { ReimbursementPlanView } from "../view/ReimbursementPlanView";
import { GroupBalanceView } from "../view/GroupBalance.view";
import { ComputeGroupBalanceUseCase } from "src/core/usecase/ComputeGroupBalanceUseCase";
import { GroupMemberController } from "./GroupMemberController";
import { GetGroup } from "src/core/usecase/GetGroup";

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
  await fastify.register(TransactionController, {
    prefix: "/:groupId/transaction",
    repositories: options.repositories,
  });
  await fastify.register(GroupMemberController, {
    prefix: "/:groupId/member",
    repositories: options.repositories,
  });

  const { group } = options.repositories;

  const createGroup = new CreateGroup(group);
  fastify.post<{ Body: CreateGroupInput }>(
    "/",
    {
      schema: {
        body: CreateGroupInputSchema,
        tags: ["group"],
        description: "Create a new group",
      },
    },
    async (request, reply) => {
      const { name } = request.body;

      const result = await createGroup.execute(name);

      if (!result.success) {
        return reply.status(400).send({ error: result.error });
      }

      return reply.status(201).send(result.payload);
    }
  );

  const getGroup = new GetGroup(group);
  fastify.get<{ Params: GroupId }>(
    "/:id",
    {
      schema: {
        params: GroupIdSchema,
        tags: ["group"],
        description: "Find a group by its id",
      },
    },
    async (request, reply) => {
      const result = await getGroup.execute(request.params.id);

      if (!result.success) {
        return reply.status(404).send();
      }

      return reply.status(200).send(result.payload);
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

  const computeSimpleReimbursementPlan =
    new ComputeSimpleReimbursementPlanUsecase(group);
  fastify.get<{ Params: GroupId }>(
    "/:id/simple-reimbursement-plan",
    {
      schema: {
        params: GroupIdSchema,
        tags: ["group"],
      },
    },
    async (request, reply) => {
      const groupId = request.params.id;

      const result = await computeSimpleReimbursementPlan.execute(groupId);

      if (!result.success) {
        return reply.status(404).send({ error: result.error });
      }

      return ReimbursementPlanView.fromEntity(result.payload);
    }
  );

  const computeBalance = new ComputeGroupBalanceUseCase(group);
  fastify.post<{ Body: RenameGroupInput; Params: GroupId }>(
    "/:id/computeBalance",
    {
      schema: {
        params: GroupIdSchema,
        tags: ["group"],
      },
    },
    async (request, reply) => {
      const groupId = request.params.id;

      const result = await computeBalance.execute(groupId);

      if (!result.success) {
        return reply.status(400).send({ error: result.error });
      }

      return GroupBalanceView.fromGroupBalance(result.payload);
    }
  );
};
