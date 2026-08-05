import { FastMCP } from "@prefecthq/fastmcp-ts/server";
import { db } from "../../database/src/db";

const server = new FastMCP({
    name: "buchverwaltungs-mcp",
    version: "1.0.0",
});


server.tool(
    {name :"get_books",
    description:"Holt eine Liste aller Bücher"},
    async () => {
        const result = await db.query.books.findMany();
        return JSON.stringify(result, null, 2);
    }
);

server.run().catch(console.error);
