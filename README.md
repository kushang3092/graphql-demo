# GraphQL Demo — Users from MongoDB

A minimal full-stack demo showing users fetched from an existing MongoDB
Atlas `users` collection via GraphQL, displayed in a table.

```
graphql-demo/
├── backend/          Express + Apollo Server + Mongoose
│   ├── models/User.js
│   ├── schema/typeDefs.js
│   ├── schema/resolvers.js
│   ├── server.js
│   ├── .env            <- already filled in with your connection string
│   └── .env.example
└── frontend/         React + Vite + Apollo Client
    ├── src/components/UserTable.jsx
    ├── src/graphql/queries.js
    ├── src/apolloClient.js
    ├── src/App.jsx
    └── src/main.jsx
```

## Data shape

The models match your existing `test` database collections:

```
users:    _id, name, email, provider, avatar, createdAt, __v
expenses: _id, userId, amount, category, description, date, receiptUrl, createdAt, __v
```

`Expense.user` is resolved on the fly from `userId`, so you can query the
related user inline: `expenses { amount user { name email } }`.

## 1. Backend setup

```bash
cd backend
npm install
npm run dev      # starts server at http://localhost:4000/graphql (needs nodemon)
# or: npm start
```

`.env` is already set with your Atlas connection string (`MONGO_URI`) and
`DB_NAME=test`. The model is explicitly bound to the `users` collection.

Open `http://localhost:4000/graphql` for the Apollo sandbox and try:

```graphql
query {
  users {
    id
    name
    email
    provider
    avatar
    createdAt
  }
  expenses {
    id
    amount
    category
    description
    date
    user {
      name
    }
  }
}
```

## 2. Frontend setup

```bash
cd frontend
npm install
npm run dev      # starts Vite dev server at http://localhost:5173
```

Open `http://localhost:5173` — it queries the backend's `/graphql` endpoint
and renders your data in a table, with tabs to switch between Users and
Expenses.

## Deployment / CI-CD

See [`DEPLOYMENT.md`](./DEPLOYMENT.md) — GitHub Actions deploys the backend
to Render and the frontend to Vercel automatically on push to `main`.

## Notes

- `apolloClient.js` points at `http://localhost:4000/graphql` — change this
  if you run the backend on a different port/host.
- This is read-only (only `users`/`user` queries) since it's pointed at your
  real data — no mutations are wired up. Ask if you want create/update/delete
  added back in.
- CORS is enabled on the backend so the Vite dev server can call it directly.
- Keep `backend/.env` out of version control (it contains your DB credentials).
