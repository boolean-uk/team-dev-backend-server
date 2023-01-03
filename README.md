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

<details>
<summary><strong>POST /users</strong>
</summary>

<strong>Example Request</strong>

```sh
curl -X POST  http://localhost:4000/users \
-H 'Content-Type: application/json' \
-d {
  "first_name":"Nathan",
  "last_name":"King",
  "email":"ngk5@gmail.com",
  "password":"mysecurepassword",
  "biography":"Hello world",
  "github_url":"https://github.com/vherus"
}
```

<strong>Example body</strong>

```sh
{
  "first_name": "Nathan",
  "last_name": "King",
  "email": "ngk5@gmail.com",
  "password": "mysecurepassword",
  "biography": "Hello world",
  "github_url": "https://github.com/vherus"
}
```

<strong>Example response</strong>

```sh
{
  "status": "success",
  "data": {
    "user": {
      "id": 8,
      "cohort_id": null,
      "role": "STUDENT",
      "first_name": "Nathan",
      "last_name": "King",
      "email": "ngk5@gmail.com",
      "biography": "Hello world",
      "github_url": "https://github.com/vherus"
    }
  }
}
```

</details>

<details>
<summary><strong>POST /login</strong>
</summary>
<strong>Example body</strong>

```sh
{
  "email": "ngk5@gmail.com",
  "password": "mysecurepassword"
}
```

<strong>Example response</strong>

```sh
{
  "status": "success",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsImlhdCI6MTY0OTQxMzk0OSwiZXhwIjoxNjQ5NTAwMzQ5fQ.b37lSRtpFWJ9kqUYAc6PUIP28JXjAYtBN_GpU5TcEuc",
    "user": {
      "id": 5,
      "cohort_id": null,
      "role": "STUDENT",
      "first_name": "Nathan",
      "last_name": "King",
      "email": "ngk2@gmail.com",
      "biography": "Hello world",
      "github_url": "https://github.com/vherus"
    }
  }
}
```

</details>

<details>
<summary><strong>POST /posts</strong>
 </summary>
<strong>Headers</strong>

```sh
Authorization: Bearer &lt;token&gt;
```

<strong>Example body</strong>

```sh
{
  "content": "Hello world!"
}
```

<strong>Example response</strong>

```sh
{
  "status": "success",
  "data": {
    "post": {
      "id": 1,
      "content": "Hello world!"
    }
  }
}
```

</details>

<details>
<summary><strong>PUT /posts/:postId</strong>
 </summary>
 This endpoint allows a user to update a post by sending a PUT request with the post's ID and the updated content.

<strong>Headers</strong>

```sh
Authorization: Bearer &lt;token&gt;
```

<strong>Example body</strong>

```sh
{
  "content": "This is my first post"
}
```

<strong>Example response</strong>

```sh
{
  "status": "success",
  "data": {
    "post": {
      "id": 1,
      "content": "This is my first post"
    }
  }
}
```

</details>

<details>
<summary><strong>DELETE /posts/:postId</strong>
</summary>
 This endpoint allows a user to delete a post by sending a DELETE request with the post's ID.

<strong>Headers</strong>

```sh
Authorization: Bearer &lt;token&gt;
```

No body required

<strong>Example response</strong>

```sh
{
  "status": "success",
  "data": {
    "post": {
      "id": 1,
      "content": "This is my first post"
    }
  }
}
```

</details>

<details>
<summary><strong>POST /cohorts</strong>
</summary>
<em>Only auth tokens for users with the TEACHER role can use this route</em>

<strong>Headers</strong>

```sh
Authorization: Bearer &lt;token&gt;
```

No body required

<strong>Example response</strong>

```sh
{
  "status": "success",
  "data": {
    "cohort": {
      "id": 3
    }
  }
}
```

</details>

<details>
<summary><strong>POST /logs</strong></summary>
<em>Only auth tokens for users with the TEACHER role can use this route</em>

<strong>Headers</strong>

```sh
Authorization: Bearer &lt;token&gt;
```

<strong>Example body</strong>

```sh
{
  "date": "2022-05-05",
  "cohort_id": 3,
  "lines": [
    {
      "content": "Caught up with James"
    },
    {
      "content": "Punished Joel"
    }
  ]
}
```

<strong>Example response</strong>

```sh
{
  "status": "success",
  "data": {
    "log": {
      "id": 1,
      "cohort_id": 3,
      "date": "2022-05-05",
      "author": {
        "id": 5,
        "first_name": "Nathan",
        "last_name": "King"
      },
      "lines": [
        {
          "id": 1,
          "content": "Caught up with James"
        },
        {
          "id": 2,
          "content": "Punished Joel"
        }
      ]
    }
  }
}
```

</details>

<details>
<summary><strong>GET /posts</strong>
</summary>
<strong>Headers</strong>

```sh
Authorization: Bearer &lt;token&gt;
```

<strong>Example response</strong>

```sh
{
  "status": "success",
  "data": {
    "posts": [
      {
        "id": 1,
        "content": "Hello world!",
        "author": {
          "id": 5,
          "cohortId": null,
          "firstName": "Nathan",
          "lastName": "King",
          "email": "ngk2@gmail.com",
          "bio": "Hello world",
          "githubUrl": "https://github.com/vherus",
          "role": "STUDENT"
        }
      },
      {
        "id": 2,
        "content": "Hello from the void!",
        "author": {
          "id": 5,
          "cohortId": null,
          "firstName": "Nathan",
          "lastName": "King",
          "email": "ngk2@gmail.com",
          "bio": "Hello world",
          "githubUrl": "https://github.com/vherus",
          "role": "STUDENT"
        }
      }
    ]
  }
}
```

</details>

<details>
<summary><strong>GET /cohorts</strong>
</summary>
 <em>Only auth tokens for users with the TEACHER role can use this route</em>
<strong>Headers</strong>

```sh
Authorization: Bearer &lt;token&gt;
```

<strong>Example response</strong>

```sh
{
 "status": "success",
 "data": {
  "cohorts": [
   {
    "id": 1,
    "users": [
     {
      "id": 2,
      "email": "email1@l.com",
      "role": "STUDENT",
      "cohortId": 1,
      "profile": {
       "firstName": "Patrik",
       "lastName": "test"
      }
     },
     {
      "id": 1,
      "email": "email1s@l.com",
      "role": "TEACHER",
      "cohortId": 1,
      "profile": {
       "firstName": "Patrik",
       "lastName": "test"
      }
     }
    ]
   },
   {
    "id": 2,
    "users": []
   }
  ]
 }
}
```

</details>

<details>
<strong>DELETE /cohort/:id</strong>
<em>Only auth tokens for users with the TEACHER role can use this route</em>
```sh
Authorization: Bearer &lt;token&gt;
```
```sh
{
 "status": "success",
 "data": {
  "cohort": [
   {
    "id": 1,
    "users": [
     {
      "id": 2,
      "email": "ngk52@gmail.com",
      "role": "STUDENT",
      "cohortId": 1,
      "profile": {
       "firstName": "TestName",
       "lastName": "TestLastName"
      }
     }
    ]
   }
  ]
 }
}
```
</details>

<details>
<summary><strong>GET /cohorts/:id</strong>
</summary>
 <em>Only auth tokens for users with the TEACHER role can use this route</em>
<strong>Headers</strong>

```sh
Authorization: Bearer &lt;token&gt;
```

<strong>Example response</strong>

```sh
{
  "status": "success",
  "data": {
    "cohort": {
      "id": 1,
      "users": [
        {
          "id": 2,
          "email": "ngk52@gmail.com",
          "role": "STUDENT",
          "cohortId": 1,
          "profile": {
            "firstName": "Nathan2",
            "lastName": "King2"
          }
        },
        {
          "id": 1,
          "email": "ngk5@gmail.com",
          "role": "TEACHER",
          "cohortId": 1,
          "profile": {
            "firstName": "Nathan",
            "lastName": "King"
          }
        }
      ]
    }
  }
}
```

</details>

<summary><strong>PATCH /users/:id/cohort</strong>
</summary>

<strong>Headers</strong>

```sh
Authorization: Bearer &lt;token&gt;
```

<strong>Example body</strong>

```sh
{
  "cohortId": 1
}
```

<strong>Example response</strong>

```sh
{
  "status": "success",
  "data": {
    "user": {
      "id": 1,
      "cohortId": 1,
      "role": "STUDENT" OR "TEACHER"
      "firstName": "My First Name",
      "lastName": "My Last Name",
      "email": myemail@email.com,
      "biography": "My biography",
      "githubUrl": "https://github.com/MyGitHubUserName"
    }
  }
}
```

</details>

<details>
<summary><strong>GET /users/:id</strong>
</summary>
<strong>Headers</strong>

```sh
Authorization: Bearer &lt;token&gt;
```

<strong>Example response</strong>

```sh
{
  "status": "success",
  "data": {
    "user": {
      "id": 1,
      "cohort_id": null,
      "role": "STUDENT",
      "first_name": "Nathan",
      "last_name": "King",
      "email": "ngk6@gmail.com",
      "biography": "Hello world",
      "github_url": "https://github.com/vherus"
    }
  }
}
```

</details>

<details>
<summary><strong>GET /users?first_name=Name</strong>
</summary>
The <em>first_name</em> query parameter is optional and case sensitive

<strong>Headers</strong>

```sh
Authorization: Bearer &lt;token&gt;
```

<strong>Example response</strong>

```sh
{
  "status": "success",
  "data": {
    "users": [
      {
        "id": 1,
        "cohort_id": null,
        "role": "STUDENT",
        "first_name": "Nathan",
        "last_name": "King",
        "email": "nk3@gmail.com",
        "biography": "Hello world",
        "github_url": "https://github.com/vherus"
      },
      {
        "id": 3,
        "cohort_id": null,
        "role": "STUDENT",
        "first_name": "Nathan",
        "last_name": "Queen",
        "email": "nk2@gmail.com",
        "biography": "Hello world",
        "github_url": "https://github.com/vherus"
      }
    ]
  }
}
```

</details>

<details>

<summary><strong>PATCH /users/:id/profile</strong>
</summary>

<strong>Headers</strong>

```sh
Authorization: Bearer &lt;token&gt;
```

<strong>Example body</strong>

```sh
{
 "cohortId": 1,
 "firstName": "Patrik",
 "lastName": "test",
 "username": "testUsername",
 "bio": "bio here",
 "githubUrl": "github.com",
 "email": "email5@l.com",
 "mobile": 123,
 "password": "secretPassword"
}
```

<strong>Example response</strong>

```sh
{
 "status": "success",
 "data": {
  "id": 1,
  "email": "email1s@l.com",
  "role": "TEACHER",
  "cohortId": 1,
  "profile": {
   "id": 1,
   "userId": 1,
   "firstName": "Patrik",
   "lastName": "test",
   "bio": "bio here",
   "githubUrl": "github.com",
   "mobile": 123
  }
 }
}
```

</details>

<details><summary><strong>GET /comment/:id</strong>
</summary>
<strong>Headers</strong>

```sh
Authorization: Bearer &lt;token&gt;
```

<strong>Example response</strong>

```sh
{
 "status": "success",
 "data": {
  "content": "Students first comment!",
  "user": {
   "profile": {
    "id": 2,
    "userId": 2,
    "firstName": "Nathan",
    "lastName": "King",
    "bio": "Hello world",
    "githubUrl": "https://github.com/vherus"
   }
  },
  "like": 3
 }
}
```

</details>

<details><summary><strong>POST posts/:postId/comments</strong>
</summary>
<strong>Headers</strong>

```sh
Authorization: Bearer &lt;token&gt;
```

<strong>Example request</strong>

```sh
{
  "content": "test comment a comment"
}
```

<strong>Example response</strong>

```sh
{
 "status": "success",
 "data": {
  "content": "test post N2",
  "userId": 3,
  "postId": 2
 }
}
```

</details>

<details><summary><strong>POST posts/:postId/comments/:commentId</strong>
</summary>
<strong>Headers</strong>

```sh
Authorization: Bearer &lt;token&gt;
```

<strong>Example request</strong>

```sh
{
  "content": "test comment a comment"
}
```

<strong>Example response</strong>

```sh
{
 "status": "success",
 "data": {
  "content": "test post N2",
  "userId": 3,
  "postId": 2
 }
}
```

</details>

<details><summary><strong>POST posts/:postId/like</strong>
</summary>
<strong>Headers</strong>

```sh
Authorization: Bearer &lt;token&gt;
```

<strong>Example response</strong>

```sh
{
 "likedPost": {
  "id": 13,
  "userId": 3,
  "postId": 1,
 }
}
```

<strong>If post is liked already</strong>
<strong>Example response</strong>

```sh
{
 "unlikedPost": {
  "id": 13,
  "userId": 3,
  "postId": 1,
 }
}
```

</details>

<details><summary><strong>POST posts/:postId/comments/:commentId/like</strong>
</summary>
<strong>Headers</strong>

```sh
Authorization: Bearer &lt;token&gt;
```

<strong>Example response</strong>

```sh
{
 "likedComment": {
  "id": 13,
  "userId": 3,
  "postId": 1,
 }
}
```

<strong>If comment is liked already</strong>
<strong>Example response</strong>

```sh
{
 "unlikedComment": {
  "id": 13,
  "userId": 3,
  "postId": 1,
 }
}
```

</details>
