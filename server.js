const express = require("express")
const { createClient } = require("redis")

const app = express()
const client = createClient()

const getAllProducts = async () => {
  const time = Math.random() * 5000
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(['Produto 1', 'Produto 2'])
    }, time)
  })
}

app.get("/", async (req, res) => {
  const productsFromCache = await client.get('getAllProducts')
  if (productsFromCache) {
    return res.send(JSON.parse(productsFromCache))
  }

  const products = await getAllProducts()
  // await client.set('getAllProducts', JSON.stringify(products), { EX: 10 })
  await client.set('getAllProducts', JSON.stringify(products))
  res.send(products)
})

app.get("/saved", async (req, res) => {
  await client.del('getAllProducts')
  res.send({ ok: true })
})

const startup = async () => {
  await client.connect();
  app.listen(3000, () => {
    console.log("server running... 3000")
  })
}

startup();
