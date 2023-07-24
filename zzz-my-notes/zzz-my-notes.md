# NOTES

- Create a new branch to work from
  `git checkout main`
  `git pull origin main`
  `git checkout -b posts_team-13-posts_delete_endpoint`
  `git push --set-upstream origin posts_team-13-posts_delete_endpoint`

- Get someone else’s branch onto your machine.

  1. `git fetch origin <name_of_the_persons_branch>` => a partcular branch
  2. `git fetch` => gets all new branches
  3. `git pull` => `git pull` is a combination of `git fetch` and `git merge` commands
  4. Then checkout from your current branch to the required branch `git checkout <name_of_the_persons_branch>`.

- Update your working branch after the source/base branch has changed

  1. `git checkout main`
  2. `git pull`
  3. `git checkout <my_working_branch>`
  4. `git merge main`
  5. Instead of step 4 above, you can rebase but it will not include your merge in the commit history.: `git rebase main`

- Keep Your Local Server Up-To-Date

  1. Stop your server project from running
  2. `git checkout main`
  3. `git pull`
  4. If you are working on a different branch, then rebase your working branch onto main. See guide above.
  5. `npx prisma migrate reset` or
  6. `npx prisma migrate reset --force`
  7. Start your server again and resume work

## DATABASE

- Making A Change To The DB Schema

  1. Make sure your working branch is based off the most up-to-date `origin/main`.
  2. `npx prisma migrate reset --force`
  3. `npx prisma generate`
  4. Ideally, new columns you are adding should be `NULLABLE` or have a `DEFAULT` value assigned.
  5. Update the `seed.js` file to reflect any new or changed fields, relations or constraints.

- MIGRATE
  1. Generate the migration:: `npx prisma migrate dev --create-only --skip-seed --name <some_useful_name>`
  2. Check the migration file to ensure the SQL is what you are expecting!
  3. Ensure you have updated the seed file
  4. Run the migration against your local/dev database:: `npx prisma migrate reset --force`
  5. Detail what checks/tests you have completed in your PR to indicate you’ve checked migration compatibility.

## DOCUMENT

- Update the API spec and/or README as necessary:

1. Request:
   1. authorisation headers
   2. payload body
   3. query parameters
2. Response:
   1. Success - status and data (response body)
   2. Failure(s) - status and data (error message)

Commit when you have a small but functioning feature/fix and explaining in a few words what it does

## 3.1.2 Migration Failures and Fixes

**You want to add a column to a table with constraints like `NOT NULL` or `UNIQUE` when the table already has records in it**

1. Delete the failed migration file
2. Reset the database: `npx prisma migrate reset --force`
3. Create the migration again but with the new column as `NULLABLE`.
4. Create an empty migration file and add custom SQL to alter existing rows of data with some default/placeholder value for the new column
5. Create a migration to now make the column `NOT NULL`

## GITHUB

### Create a new branch to work from

_Scenario_: You are starting work on a new ticket and need to setup a new branch to work from. You later push your work so that it is not just on your machine but also in the remote repo.

1. You will usually want to branch off `main`: `git checkout main`
2. Make sure your local version is up-to-date with the remote: `git pull origin main`
3. Create a new branch. Use the following naming convention: `git checkout -b <team_name-ticket_number-feature_title>`
   - Example branch name: posts_team-13-posts_delete_endpoint
   - Example command: `git checkout -b posts_team-13-posts_delete_endpoint`.
   - This is a shorthand version of doing:
   - This is a shorthand version of doing. `git branch <team_name-ticket_number-feature_title>`. Then `git checkout <team_name-ticket_number-feature_title>`
4. After you have staged and committed some work, you will then need to push your work to Github so that there is a remote version
   - `git add .`
   - `git commit -m 'commit message'`
   - `git push --set-upstream origin posts_team-13-posts_delete_endpoint`

### Get someone else’s branch onto your machine

_Scenario_: You are pairing with someone who has already been working on a branch and they have already pushed their work to the remote repo. You have not worked on this branch yet, and you want to be the “driver” now so you need their existing work on your machine.

You need to sync up your local machine's content with the remote repo so that it has any new work on it. There are a number of ways you can do this:

1. Get just the new branch that you want to work on: `git fetch origin <name_of_the_persons_branch>`
2. Get all new branches of work: `git fetch`
3. Get all new branches and update the current branch of your local repository to match any new content found in the remote (e.g. if someone has merged a PR to the remote branch): `git pull`. `git pull` is a combination of `git fetch` and `git merge` commands
4. Now that you have your partners working branch on your machine, you need to checkout from your current branch to the required branch: `git checkout <name_of_the_persons_branch>`
5. Once you have done your work and you push your changes to the remote, then the person who originally started working on the branch will need to run `git pull` to retrieve your work and update their local machine.

### Update your working branch after the source/base branch has changed

_Scenario:_ You and another developer have created separate branches of work from the same source/base (e.g. `main`). Each of you are working on different tickets/features. The other person has now merged their work into `main` and you want to ensure that your local `main` includes their work / is up-to-date.

1. Checkout the source/base branch (typically, `main`): `git checkout main`
2. Pull from the remote `main` so that your local copy of it is in sync: `git pull`
3. Checkout back to the branch you were working on: `git checkout <my_working_branch>`
4. Merge the updated local source branch (main) so that your working branch now includes any updated code: `git merge main`

### Alternative Approach: Rebasing

You can achieve this by “rebasing” as well. This has the same outcome as using the `git merge` approach but it will not include your merge in the commit history. This allows for a “cleaner” history which only details your actual work.

1. Checkout the source/base branch (typically, `main`): `git checkout main`
2. Pull from the remote `main` so that your local copy of it is in sync: `git pull`
3. Checkout back to the branch you were working on: `git checkout <my_working_branch>`
4. Rebase the commits from your working branch onto the updated source branch (main) so that your working branch now branches off from the updated source branch@ `git rebase main`

### Keep Your Local Server Up-To-Date

1. Stop your server project from running
2. Checkout to, and pull the `main` branch:
   1. `git checkout main`
   2. `git pull`
3. If you are working on a different branch (e.g. one for your ticket), then rebase your working branch onto `main`.
4. Refresh the database back to its original state (including seeding data)
   1. `npx prisma migrate reset`
   2. Sometimes you may get a warning/error saying you need to use the `--force` flag, in which case you run: `npx prisma migrate reset --force`
5. Start your server again and resume work

## 1) PULL REQUEST

- Organise 15-min max standup @ 9.30am.
- Use PRs to merge work.
- PR Description must include
  1. Objective - what your work should achieve at a high level e.g. "Replaces the hard-coded POST endpoint for /posts with a real working version".
  2. What Has Changed - a summary of the code changes that you have made. e.g. "1) Replaced hard-coded response with success/error responses. 2) Updated the DB by adding columns for... 3) Refactored the controller so that..."
  3. PRs should only be merged after it has approval from 1 teacher and 1 student.

## 2) Scrum Master

- Ensuring nobody on your team is blocked, check that everyone is able to move forward with their work
- Talk to the other scrum master(s) and make sure you're working to the same goals.
- Reviewing and pre-approving plans / tasks for work before notifying a teacher that plans are ready to be reviewed.
- Quality assurance on PR's before notifying a teacher that a PR is ready for review
- Responsible for `breaking the epic down` into the required work on individual backlog tickets.
- Deciding which team members are going to complete the work.

## 3) ASSIGNED TICKETS

- For a ticket you are assigned, you must come up with a detailed plan of your approach.
- A teacher must review and approve your plan before you start working on it.

## 4) MODEL

- When adding a new column, make sure to support `nullable` or `default` value to avoid db crashes when migrated to production

## 5) Your effort is in writing routes that are ROBUST

- Provide proper validation
- Check each property and return errors if incorrect
- Be methodical in your database changes (especially when updating or adding to the model)

## 6) API Spec

- API Spec changes must be documented in your issues before work can begin. This involves:
  1. payload examples;
  2. response example;
  3. error response examples.

## Day 1 Plan & Outcomes

- Outcomes from each team by the end of today is:
  Setup your repo for localhost development with your personal Elephant SQL db.
  Create an ERD based on the given prisma schema file.
  Essentially become really familiar with the existing db model.
  There are example images of ERDs in the repo - these are just for reference, and you need to create a live working document/model.
  Create a new insomnia collection (or load an existing one from before) and ensure all the current existing routes are there and are all working.
  Remove any routes that do not exist/work right now.
  Read the API spec and confirm, with Insomnia, that everything matches.
  Produce flow diagram(s) mapping out a request and follow through the full chain of function calls and in which files each function call is happening.
  Review how Auth has been implemented.
  Review how user Roles have been implemented
  i.e. how do we know if the user making a request has teacher or student permissions?
  Review how the JWT tokens are used and what data is added to their payload.

## Key Information (Summary of info in Student Handbook)

Git Strategy
Clone the repository (do not fork).
Branches and PRs:
Always work on a new branch when creating a new feature.
Branches should follow the naming convention: <your_username>-<trello_issue_number>-<feature_description>, e.g. vherus-12-create-post-endpoint.
Use PRs to merge work.
PRs must have a description of the work. As a minimum, it must have these sections:
Objective - what your work should achieve at a high level
e.g. "Replaces the hard-coded POST endpoint for /posts with a real working version"
What Has Changed - a summery of the code changes that you have made
e.g. "1) Replaced hard-coded response with success/error responses. 2) Updated the DB by adding columns for... 3) Refactored the controller so that..."
PRs should only be merged after it has approval from 1 teacher and 1 student.

## Scrum Master

You are responsible for:
a) Ensuring nobody on your team is blocked, check that everyone is able to move forward with their work;
b) Communication between teams. Talk to the other scrum master(s) and make sure you're working to the same goals;
c) Reviewing and pre-approving plans / tasks for work before notifying a teacher that plans are ready to be reviewed;
d) Quality assurance on PR's before notifying a teacher that a PR is ready for review
We will rotate scrum masters every few days
When your entire team feels they have a degree of comfort navigating the project, you can start looking at the Epics on the trello board. You are responsible for breaking the epic down into the required work on individual backlog tickets and then deciding which team members are going to complete the work.

## Ways of Working

- Every team stand-up happens at 9:30am each morning in your team voice channels and should last no longer than 15 minutes.
  - Each person should cover:
    - a) What they did yesterday
    - b) What they're doing today
    - c) Are there any known blockers/problems?
  - If your team needs guidance to keep it moving, the Scrum Master should take on this responsibility
- Use your own Elephant SQL databases and run everything in localhost.
- For a ticket you are assigned, you must come up with a detailed plan of your approach.
  - A teacher must review and approve your plan before you start working on it.
  - The features you build must match exactly what the customer wants you to build. How you build it is up to you; you will have to make decisions on how to reach that goal.
- We have a live app - you must build your changes and code with this in mind: we cannot lose any data on our live app; hence any database updates must be robust
  - **IMPORTANT: When adding a new column, make sure to support nullable or default value to avoid db crashes when migrated to production**
- Your effort is in writing routes that are ROBUST
  - provide proper validation
  - check each property and return errors if incorrect
  - be methodical in your database changes (especially when updating or adding to the model)

### API Spec

- API Spec changes must be documented in your issues before work can begin. This involves:
  - payload examples;
  - response example;
  - error response examples.

npm run lint
npx eslint
