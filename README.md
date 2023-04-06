# Tricount using Clean Architecture

## Backend

Technologies:

* Typescript
* Node v18
* [Vitest](https://vitest.dev/)
* Fastify server

### Get started

To share the same configuration, you can open the following workspace with VSCode `.vscode/tricount.code-workspace`, it should open the project!

**Note:** You should see two root folders in the explorer `tricount` (project root folder) and `backend` (backend root folder). This way, we can share the same configuration for multiple services, but still enjoy VSCode power in each sub-project (for example auto-format, debugging, etc.).

1. Make sure you are using node v18
2. Go into the `backend` directory
3. Install the dependancies with `npm i`
4. You can run the project with `npm start` and the API will be accessible at [localhost:8080](http://localhost:8080).
5. Or you can run the test with `npm test`, it will run the tests in watch mode.

**Note:** The dev server occasionnaly crash when editing files, you just to restart it manually.

### Swagger / OpenAPI

During development, you can access a swagger at [localhost:8080/docs](http://localhost:8080/docs).
