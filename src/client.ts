import { hc } from "hono/client"
import type { AppType } from "./server"


async function main() {
  const client = hc<AppType>('http://localhost:3000')
  const res = await client.api.users.$post({
    json: {
      name: 'tarou',
      age: 15,
    },
  })
  
  if (res.ok) {
    const user = await res.json()
    console.log(res.status, user)
  } else {
    console.log(res.status, 'error')
  }
}

main()