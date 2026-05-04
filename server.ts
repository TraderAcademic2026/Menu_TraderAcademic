import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_FILE = path.join(process.cwd(), "data.json");

// Configuração inicial padrão
const DEFAULT_CONFIG = {
  name: "Menu Trader",
  description: "Links Oficiais",
  profileImage: "", 
  coverImage: "",
  hours: "Disponível 24h",
  links: [
    {
      id: "1",
      title: "WhatsApp",
      subtitle: "Fale conosco",
      url: "https://wa.me/5500000000000",
      icon: "MessageCircle",
      color: "bg-green-600"
    }
  ]
};

// Funções para lidar com o arquivo de dados
function readData() {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      fs.writeFileSync(DATA_FILE, JSON.stringify(DEFAULT_CONFIG, null, 2));
      return DEFAULT_CONFIG;
    }
    const content = fs.readFileSync(DATA_FILE, "utf-8");
    return JSON.parse(content);
  } catch (error) {
    console.error("Erro ao ler dados:", error);
    return DEFAULT_CONFIG;
  }
}

function saveData(data: any) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Erro ao salvar dados:", error);
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "15mb" })); 

  // API Routes
  app.get("/api/config", (req, res) => {
    const data = readData();
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(data));
  });

  app.post("/api/config", (req, res) => {
    saveData(req.body);
    res.json({ success: true });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
