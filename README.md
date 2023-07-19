# Team Simulation - Server

## Setting up

### Pre-requisite

[Follow this guide to create your databases](./DB_SETUP.md)

Once you have complete the above guide, continue to the steps below.

1. Copy `.env.example` and name it `.env` (NOTE: Make sure to copy the file, don't remove the original)
2. Copy the URL of your **PRIMARY** database instance (see image below on how to get this) and place it into the `.env` file's `DATABASE_URL` variable, keeping `?schema=prisma` on the end. E.g. `DATABASE_URL="postgres://uy:ay@ka.db.elephantsql.com/ufy?schema=prisma"`
![](./assets/db-setup/4.PNG)
3. Do the same thing for your **SHADOW** database, placing its URL into the `SHADOW_DATABASE_URL` variable, keeping `?schema=shadow` on the end. E.g. `SHADOW_DATABASE_URL="postgres://jk:la@ka.db.elephantsql.com/irk?schema=shadow"`
4. `npm ci` to install dependencies
5. `npx prisma migrate reset` to build the database tables and insert some seed data (as defined in [./prisma/seed.js](./prisma/seed.js))
6. `npm run dev` to run the app

## API Spec

**INSERT API SPEC LINK HERE**

### Updating the API spec
1. update the `/docs/openapi.yml` file whenever the behaviour of the API changes
2. rebuild the html file that represents the user-facing view

```sh
# install the redoc-cli utility library first
$ npm install @redocly/cli -g

$ # then, build the html file
$ npx @redocly/cli build-docs docs/openapi.yml -o ./docs/index.html
```

3. Stage and commit the change alongside any commits that include work that changes the behaviour of the API
