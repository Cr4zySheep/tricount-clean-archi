import Fastify, { type FastifyInstance } from "fastify";
import FastifySwaggerUI from "@fastify/swagger-ui";

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

async function createServer(): Promise<FastifyInstance> {
  const server = Fastify({
    // TODO: Dynamically load the correct configuration
    logger: envToLogger.development,
  });

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

  // * App plugins

  // * Decorators

  // * Hooks

  // * App services
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
