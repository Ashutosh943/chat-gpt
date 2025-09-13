// server.js
import express from "express";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { z } from "zod";

const app = express();
app.use(express.json());

// Create the MCP server
const server = new McpServer({
    name: "sales-mcp-http",
    version: "1.0.0",
});

// Tool 1: get sales for a date range
server.registerTool(
    "getSales",
    {
        title: "Get Sales",
        description: "Get sales for a given date range",
        inputSchema: {
            startDate: z.string(),
            endDate: z.string(),
        },
    },
    async ({ startDate, endDate }) => {
        // Hard-coded example data
        const sales = [
            { date: "2025-09-01", total: 1500 },
            { date: "2025-09-02", total: 2000 },
        ];
        return {
            content: [
                {
                    type: "json",
                    data: { startDate, endDate, sales },
                },
            ],
        };
    }
);

// Tool 2: get customer list
server.registerTool(
    "getCustomers",
    {
        title: "Get Customers",
        description: "Return a list of customers",
        inputSchema: {}, // no input
    },
    async () => {
        // Hard-coded example customer list
        const customers = [
            { id: 1, name: "Alice", email: "alice@example.com" },
            { id: 2, name: "Bob", email: "bob@example.com" },
        ];
        return {
            content: [
                {
                    type: "json",
                    data: customers,
                },
            ],
        };
    }
);

// Hook up Streamable HTTP transport at /mcp
const transport = new StreamableHTTPServerTransport(app, { path: "/mcp" });
await server.connect(transport);

// Start listening on port 3001
app.listen(3001, () => {
    console.log("✅ MCP HTTP server running at http://localhost:3001/mcp");
});