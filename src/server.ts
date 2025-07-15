import { Hono } from 'hono'

const app = new Hono() // これの下に記述

// 適当なテストデータ追加
const users = [
  {id: 1, name: 'tarou', age: 15},
  {id: 2, name: 'hanako', age: 20},
]

// API追加
app.post('/api/users', async (c) => {
  const user = await c.req.json()

  users.push({id: users.length + 1, ...user})
  return c.json(user)
}).get('/', (c) => {
  return c.text('Hello Hono!')
})


export type AppType = typeof app

export default app