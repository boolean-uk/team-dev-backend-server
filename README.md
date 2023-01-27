# Team Simulation - Server

## Setting up

1. Copy `.env.example` and name it `.env`
2. Create a postgres database and add its URL into the `DATABASE_URL` environment variable, keeping `?schema=prisma` on the end
    - Postgres db URLs are in the format: `postgres://[USERNAME]:[PASSWORD]@[HOST]:[PORT]/[DATABASE_NAME]`
    - Note that prisma doesn't store data in the public schema, so set the  search path to prisma in your db client. For PSQL client
    - use `\dn` to show available schemas
    - use SQL to set the search path to the correct schema: `SET search_path to prisma;`
    - `\dt` will then show available tables (once migrations have been run)
3. If using a cloud database provider:
    - Create another database and run `create schema shadow` on it
    - Add its URL into the `SHADOW_DATABASE_URL` env var, keeping `?schema=shadow` on the end
4. `npm ci` to install dependencies
5. `npx prisma migrate reset` to apply migrations to your db
6. `npm run dev` to run the app

## Sample Requests

If you use [Insomnia](https://insomnia.rest/), you can import [this request collection .json file](./assets/insomnia_request_collection.json) in the `./assets/` folder to hit the ground running with all of the requests ready to test.

## API Spec

Documented [here](https://jubilant-disco-r44mv9y.pages.github.io/)

### Updating the API spec
1. update the `/docs/openapi.yml` file whenever the behaviour of the API changes
2. rebuild the html file that represents the user-facing view
```sh
# install the redoc-cli utility library first
$ npm install -g redoc-cli
$ # then, build the html file
$ redoc-cli build docs/openapi.yml -o ./docs/index.html
```
3. Stage and commit the change alongside any commits that include work that changes the behaviour of the API

