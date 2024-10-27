import { join } from "node:path"
import AutoLoad from "@fastify/autoload"
import Fastify from "fastify"
import Ajv from "ajv"

const schemaCompilers = {
	body: new Ajv({
		removeAdditional: "all",
		useDefaults: true,
		coerceTypes: false,
		addUsedSchema: false,
		allErrors: false
	}),
	others: new Ajv({
		removeAdditional: "all",
		useDefaults: true,
		coerceTypes: "array",
		addUsedSchema: false,
		allErrors: false
	})
}

const main = async () => {
	const server = Fastify({ logger: true })

	server.setValidatorCompiler((req) => {
		if (!req.httpPart) {
			throw new Error("Missing httpPart")
		}
		const compiler =
			req.httpPart === "body" ? schemaCompilers["body"] : schemaCompilers["others"]

		if (!compiler) {
			throw new Error(`Missing compiler for ${req.httpPart}`)
		}

		return compiler.compile(req.schema)
	})

	await server.register(AutoLoad, { dir: join(__dirname, "api"), dirNameRoutePrefix: false })

	await server.ready()

	try {
		await server.listen({ port: 8000, host: "localhost" })
	} catch (error) {
		server.log.error(error)

		process.exit(1)
	}
}

main()
