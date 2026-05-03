import express from "express";
import path from "path";
import { GoogleGenAI } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  // Middleware for parsing JSON requests
  app.use(express.json({ limit: "50mb" })); // Increase limit for images

  // AI API Route
  app.post("/api/gemini", async (req, res) => {
    try {
      const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;
      if (!apiKey) {
        return res.status(500).json({ error: "API key is missing on the server" });
      }

      const { model, contents, config } = req.body;
      const ai = new GoogleGenAI({ apiKey });

      const response = await ai.models.generateContent({
        model: model || "gemini-3-flash-preview",
        contents: contents,
        config: config
      });

      res.json({ text: response.text });
    } catch (error) {
      console.error("Gemini proxy error:", error);
      res.status(500).json({ error: error instanceof Error ? error.message : "Generate format error" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    // SPA fallback
    app.get("*all", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
