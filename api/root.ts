import { FastifyInstance } from "fastify"

export default async function root(fastify: FastifyInstance) {
	fastify.get("/", () => ({ message: "OK" }))
}
