import { createRoute, OpenAPIHono, z } from '@hono/zod-openapi'
import { swaggerUI } from '@hono/swagger-ui'

const app = new OpenAPIHono()

// 適当なテストデータ追加
const users = [
  {id: 1, name: 'tarou', age: 15},
  {id: 2, name: 'hanako', age: 20},
]
const reqCreateUserSchema = z
.object({
  name: z
  .string()
  .min(1)
  .openapi({
    description: 'ユーザーの名前', // API仕様書に表示される説明を追加
    example: 'tarou',  // API仕様書に表示される例を追加
  }),
  age: z
  .number()
  .openapi({
    description: 'ユーザーの年齢',
    example: 15,
  }),
}).openapi('reqCreateUserSchema', {
  type: 'object',
  description: 'ユーザー情報',
})

/**
 * エラーを返すスキーマ
 */
const resErrorSchema = z
.object({
  code: z.number().openapi({
    description: 'エラーコード',
    example: 400,
  }),
  message: z.string().openapi({
    description: 'エラーメッセージ',
    example: 'Bad Request',
  }),
}).openapi('resErrorSchema', {
  type: 'object',
  description: 'エラー情報',
});

/**
 * ユーザー情報を返すスキーマ
 */
const resUserSchema = z.object({
  id: z.number().openapi({
    description: 'ユーザーID',
    example: 1,
  }),
  name: z.string().openapi({
    description: 'ユーザーの名前',
    example: 'tarou',
  }),
  age: z.number().openapi({
    description: 'ユーザーの年齢',
    example: 15,
  }),
}).openapi('resUserSchema', {
  type: 'object',
  description: 'ユーザー情報',
})

// API追加
const route = app.openapi(
createRoute({
	method: "post",
	path: "/api/users",
	request: {
		body: {
			content: {
				"application/json": {
					schema: reqCreateUserSchema,
				},
			},
		},
	},
	responses: {
		200: {
			description: "ユーザー情報を返す",
			content: {
				"application/json": {
					schema: resUserSchema,
				},
			},
		},
		400: {
			description: "エラーを返す",
			content: {
				"application/json": {
					schema: resErrorSchema,
				},
			},
		},
	},
}), async (c) => {
  const {name, age} = c.req.valid('json')

  const user = {id: users.length + 1, name, age}
  users.push(user)
  return c.json(user, 200)
});

// GETルートは別に定義
app.get('/', (c) => {
  return c.text('Hello Hono!')
})


app.doc("/doc", {
  openapi: "3.1.0",
  info: {
    version: "1.0.0",
    title: "Sample API Document",
  },
});

// /docにGETリクエストすることでJSON形式でドキュメントを確認できる
// /uiだと整形されたAPIドキュメントがブラウザで確認できる
app.get("/ui", swaggerUI({ url: "/doc" }));

export type AppType = typeof route

export default app