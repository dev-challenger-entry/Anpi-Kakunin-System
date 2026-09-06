import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

// Railwayが割り当てるポートを使用。ローカルでは3000番にフォールバック。
const PORT = process.env.PORT || 3000;

const distPath = path.join(__dirname, "dist");

// ビルド済みの静的ファイル(dist)を配信
app.use(express.static(distPath));

// SPAのため、どのルートにアクセスされてもindex.htmlを返す
app.get("*", (req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});