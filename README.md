# Team Simulation - Server

## Setting up

1. Clone (**do not fork**) the repository
2. `npm ci` to install dependencies
3. Copy `.env.example` to a `.env` file
4. Update the values inside the `.env` file, using your own database connection details. **Do not put the production database details in here, lest you incur the wrath of the gods.**
5. `npm run dev` to run the app
6. Profit

## Contributing

- Project management board: https://github.com/orgs/boolean-uk/projects/13/views/1
- Pull requests MUST be made from branches following the naming convention: `<username>-<issue_number>-<feature>`, e.g. `vherus-#1-user_registration`

## API Spec

[Deployed API Spec](https://team-dev-backend-api-nameless-cherry-5503.fly.dev/api-docs/)

The API Spec is hosted by the server itself (i.e. this project), and the view/page is generated automatically by the SwaggerUI library.

To view it locally, you can just go to: [http://localhost:4000/api-docs](http://localhost:4000/api-docs).

Whenever you make any change to the API (e.g. adding a new route, changing the payload for an existing route, adding a new error), you must update the API Spec accordingly. To do this, you just need to update the `openapi.yaml` file -- guidance on the basic structure of the `openapi.yaml` file can be found [here](https://swagger.io/docs/specification/about/).

## DATABASE ERD

You must create and include an ERD here. This needs to be kept up to date with any and all database schema changes.
