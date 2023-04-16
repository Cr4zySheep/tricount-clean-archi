import Fastify, { type FastifyInstance } from "fastify";
import { GroupController } from "../controller/GroupController";
import FastifySwagger from "@fastify/swagger";
import FastifySwaggerUI from "@fastify/swagger-ui";
import FastifyCors from "@fastify/cors";
import { createRepositories } from "../repository/createRepositories";

const envToLogger = {
  development: {
    transport: {
      target: "pino-pretty",
      options: {
        translateTime: "HH:MM:ss Z",
        ignore: "pid,hostname",
      },
    },
  },
  production: true,
  test: false,
};
export type EnvironmentType = keyof typeof envToLogger;

export async function createServer(
  env: EnvironmentType = "development"
): Promise<FastifyInstance> {
  const server = Fastify({
    logger: envToLogger[env],
  });

  // Create services, repositories, ...
  const repositories = createRepositories();

  // Loading order
  // * Plugins
  await server.register(FastifySwagger, {
    swagger: {
      info: {
        title: "Tricount backend swagger",
        version: "0.1.0",
      },
      host: "localhost:8080",
      schemes: ["http"],
      consumes: ["application/json"],
      produces: ["application/json"],
      tags: [{ name: "group", description: "Group related end-points" }],
      definitions: {},
    },
  });
  await server.register(FastifySwaggerUI, {
    routePrefix: "/docs",
  });
  await server.register(FastifyCors, {});

  // * App plugins

  // * Decorators

  // * Hooks

  // * App services
  await server.register(GroupController, { prefix: "/group", repositories });

  await server.ready();
  server.swagger();

  return server;
}

createServer()
  .then(async (server) => {
    try {
      await server.listen({ port: 8080 });
    } catch (error) {
      server.log.error(error);
      process.exit(1);
    }
  })
  .catch((error) => {
    console.error(error);
    console.log("Failed to start server");
  });
