const express = require('express');
const cors = require('cors');
const { GoogleGenAI } = require('@google/genai');

const app = express();
app.use(cors());
app.use(express.json());

const ai = new GoogleGenAI({
  apiKey: "AQ.Ab8RN6KHXfwejXfFNr8PJ7VIrwURw97jqrIai92-8aXMrjqVZg"
});

// Simpan memori percakapan agar Gemini ingat konteks obrolan sebelumnya
let chatHistory = [];
let activeModels = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-3.8-flash'];

// Otomatis cek model Gemini apa saja yang tersedia & aktif untuk API Key ini saat server menyala
async function detectAvailableModels() {
  try {
    const pager = await ai.models.list();
    const valid = [];
    for await (const model of pager) {
      const name = model.name.replace('models/', '');
      if (
        name.includes('gemini') &&
        name.includes('flash') &&
        !name.includes('image') &&
        !name.includes('audio') &&
        !name.includes('tts')
      ) {
        valid.push(name);
      }
    }
    if (valid.length > 0) {
      // Prioritaskan versi terbaru di urutan paling depan
      activeModels = valid.reverse();
      console.log('✅ Model Gemini aktif ditemukan:', activeModels);
    }
  } catch (err) {
    console.log('ℹ️ Menggunakan daftar model default:', activeModels);
  }
}

app.post('/api/chat', async (req, res) => {
  const { message, campusContext } = req.body;
  if (!message) return res.status(400).json({ error: "Pesan tidak boleh kosong." });

  // Tambahkan pesan user ke riwayat (simpan 10 pesan terakhir agar nyambung & ringan)
  chatHistory.push({ role: 'user', parts: [{ text: message }] });
  if (chatHistory.length > 10) chatHistory = chatHistory.slice(-10);

  // Set header untuk Real-Time Streaming (kata demi kata langsung muncul di browser)
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('Transfer-Encoding', 'chunked');

  const systemPrompt = `Kamu adalah "Finder's Partner", konselor AI resmi di platform PathFinder IPB University.
Tugasmu mendampingi mahasiswa IPB curhat soal kebingungan memilih organisasi, kepanitiaan, volunteer, lomba, riset, maupun beasiswa.
Gaya bicaramu hangat, suportif, cerdas, natural seperti kakak tingkat/konselor kampus yang asik, dan selalu memberikan saran langkah konkret yang relevan dengan kondisi mahasiswa tersebut.
${campusContext ? `\nInfo kegiatan yang sedang buka di PathFinder IPB saat ini:\n${campusContext}` : ''}`;

  let success = false;
  let fullReply = '';

  for (const modelName of activeModels) {
    try {
      const responseStream = await ai.models.generateContentStream({
        model: modelName,
        contents: chatHistory,
        config: {
          systemInstruction: systemPrompt,
          temperature: 0.8,
          maxOutputTokens: 700
        }
      });

      for await (const chunk of responseStream) {
        if (chunk.text) {
          fullReply += chunk.text;
          res.write(chunk.text); // Kirim langsung ke browser detik itu juga
        }
      }

      if (fullReply.trim().length > 0) {
        chatHistory.push({ role: 'model', parts: [{ text: fullReply }] });
        success = true;
        break;
      }
    } catch (err) {
      console.warn(`⚠️ Model ${modelName} sibuk (${err.status || err.message}), pindah ke model berikutnya...`);
    }
  }

  if (!success) {
    chatHistory.pop();
    res.status(503).write("__ERROR__:Server Google AI sedang padat sesaat. Coba kirim ulang pesanmu ya!");
  }

  res.end();
});

// Endpoint opsional untuk reset memori obrolan jika chat ditutup/di-refresh
app.post('/api/reset', (req, res) => {
  chatHistory = [];
  res.json({ status: 'ok' });
});

app.listen(3000, async () => {
  console.log('🚀 Server Pure Gemini AI aktif di http://localhost:3000');
  await detectAvailableModels();
});