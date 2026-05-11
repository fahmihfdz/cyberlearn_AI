import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

const API_KEY = process.env.GEMINI_API_KEY;
const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`;

async function checkModels() {
  try {
    const res = await fetch(url);
    const data = await res.json();
    if (data.models) {
      console.log("\n✅ API KEY BERHASIL TERHUBUNG!");
      console.log("Berikut adalah daftar model yang didukung oleh API Key Anda:\n");
      const validModels = data.models
        .filter(m => m.supportedGenerationMethods.includes('generateContent'))
        .map(m => m.name.replace('models/', ''));
      
      validModels.forEach(m => console.log(`- ${m}`));
      
      console.log("\n=================================");
      console.log("Silakan balas pesan ini dengan mencantumkan nama-nama model di atas!");
      console.log("=================================\n");
    } else {
      console.log("❌ GAGAL MENDAPATKAN MODEL:", data);
    }
  } catch (error) {
    console.log("❌ ERROR KONEKSI:", error.message);
  }
}

checkModels();
