import { createServer } from "node:http";

const PORT = 3000;

const server = createServer((req, res) => {
    res.setHeader("Content-Type", "application/json");

    if (req.url === "/" && req.method === "GET") {
        res.writeHead(200);

        res.end(JSON.stringify({
            application: "OpexAnalyser",
            message: "Backend API is running"
        }));

        return;
    }

    if (req.url === "/health" && req.method === "GET") {
        res.writeHead(200);

        res.end(JSON.stringify({
            status: "Healthy",
            timestamp: new Date().toISOString()
        }));

        return;
    }

    res.writeHead(404);

    res.end(JSON.stringify({
        message: "Route not found"
    }));
});

server.listen(PORT, () => {
    console.log(`OpexAnalyser API running at http://localhost:${PORT}`);
});