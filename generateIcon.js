import { createCanvas } from "canvas";
import fs from "fs";
import { exec } from "child_process";

const size = 1024;
//const radius = 220; // arrondi type icône iOS

// Polices système (pas besoin de télécharger)
const fonts = ["Helvetica"];

fonts.forEach(font => {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext("2d");

  // --- Coins arrondis ---
  {/*ctx.beginPath();
  ctx.moveTo(radius, 0);
  ctx.lineTo(size - radius, 0);
  ctx.quadraticCurveTo(size, 0, size, radius);
  ctx.lineTo(size, size - radius);
  ctx.quadraticCurveTo(size, size, size - radius, size);
  ctx.lineTo(radius, size);
  ctx.quadraticCurveTo(0, size, 0, size - radius);
  ctx.lineTo(0, radius);
  ctx.quadraticCurveTo(0, 0, radius, 0);
  ctx.closePath();
  ctx.clip(); */}

  // --- Dégradé de fond ---
  const gradient = ctx.createLinearGradient(0, 0, size, size);
  gradient.addColorStop(0, "#43e97b");
  gradient.addColorStop(0.33, "#38f9d7");
  gradient.addColorStop(0.66, "#1e88e5");
  gradient.addColorStop(0.93, "#f53844");

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);

  // --- Ombre sous EV ---
  ctx.shadowColor = "rgba(0, 0, 0, 0.6)";
  ctx.shadowBlur = 50;
  ctx.shadowOffsetY = 20;

  // --- Texte EV ---
  ctx.fillStyle = "white";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = `bold 550px "${font}"`;
  ctx.fillText("EV", size / 2, size / 2 + 10);

  // --- Sauvegarde ---
  const filename = `./icon.png`;
  fs.writeFileSync(filename, canvas.toBuffer("image/png"));
  console.log(`✅ ${filename} créé`);
});

// --- Ouvre automatiquement les 3 images (Windows) ---
fonts.forEach((font, i) => {
  const filename = `icon.png`;
  setTimeout(() => exec(`start ${filename}`), 300 * i);
});
