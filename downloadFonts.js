import fs from "fs";
import path from "path";
import https from "https";

const fonts = [
  { name: "Inter", url: "https://github.com/google/fonts/raw/main/ofl/inter/Inter-Bold.ttf" },
  { name: "Poppins", url: "https://github.com/google/fonts/raw/main/ofl/poppins/Poppins-Bold.ttf" },
  { name: "Orbitron", url: "https://github.com/google/fonts/raw/main/ofl/orbitron/Orbitron-Bold.ttf" },
  { name: "Montserrat", url: "https://github.com/google/fonts/raw/main/ofl/montserrat/Montserrat-Bold.ttf" },
  { name: "Raleway", url: "https://github.com/google/fonts/raw/main/ofl/raleway/Raleway-Bold.ttf" },
  { name: "Nunito", url: "https://github.com/google/fonts/raw/main/ofl/nunito/Nunito-Bold.ttf" },
  { name: "Exo2", url: "https://github.com/google/fonts/raw/main/ofl/exo2/Exo2-Bold.ttf" },
  { name: "Outfit", url: "https://github.com/google/fonts/raw/main/ofl/outfit/Outfit-Bold.ttf" },
  { name: "Syne", url: "https://github.com/google/fonts/raw/main/ofl/syne/Syne-Bold.ttf" },
  { name: "Prompt", url: "https://github.com/google/fonts/raw/main/ofl/prompt/Prompt-Bold.ttf" }
];

const folder = "./fonts";
if (!fs.existsSync(folder)) fs.mkdirSync(folder);

function downloadFont(font) {
  const filePath = path.join(folder, font.name + ".ttf");
  const file = fs.createWriteStream(filePath);

  https.get(font.url, res => {
    res.pipe(file);
    file.on("finish", () => {
      file.close();
      console.log(`✅ ${font.name} téléchargée`);
    });
  }).on("error", err => {
    console.log(`❌ Erreur pour ${font.name}`, err);
  });
}

console.log("🚀 Téléchargement des polices...");
fonts.forEach(downloadFont);
