// =========================================================================
// FINDER'S PARTNER — REAL-TIME GEMINI AI STREAMING CLIENT
// =========================================================================

let isSendingChat = false;

// Ambil ringkasan kegiatan dari localStorage agar Gemini tahu event apa saja yang ada di web
function getCampusEventsSummary() {
  const oprek = JSON.parse(localStorage.getItem('pathfinder_oprek_data')) || [];
  const academy = JSON.parse(localStorage.getItem('pathfinder_academy_data')) || [];
  const list1 = oprek.map(e => `- [Path 01: ${e.kategori}] ${e.judul} (${e.penyelenggara})`).join('\n');
  const list2 = academy.map(e => `- [Path 02: ${e.kategori}] ${e.judul} (${e.penyelenggara})`).join('\n');
  return [list1, list2].filter(Boolean).join('\n');
}

async function sendChatMessage() {
  if (isSendingChat) return;

  const input = document.getElementById('chatInput') || document.querySelector('#chatModal input[type="text"]');
  const chatBox = document.getElementById('chatMessages') || document.querySelector('#chatModal .overflow-y-auto');
  if (!input || !chatBox) return;

  const userText = input.value.trim();
  if (!userText) return;

  isSendingChat = true;
  input.value = '';

  // 1. Bubble chat user
  chatBox.innerHTML += `
    <div class="flex justify-end mb-3">
      <div class="bg-[#2D5B66] text-white text-xs px-4 py-2.5 rounded-2xl rounded-tr-none max-w-[80%] shadow-sm leading-relaxed">
        ${escapeChatHtml(userText)}
      </div>
    </div>
  `;

  // 2. Bubble balasan AI (langsung siap diisi aliran teks dari Gemini)
  const replyId = 'ai-reply-' + Date.now();
  chatBox.innerHTML += `
    <div class="flex justify-start mb-3">
      <div id="${replyId}" class="bg-[#CAEAFF] text-[#2D5B66] border border-[#32566D]/20 text-xs px-4 py-3 rounded-2xl rounded-tl-none max-w-[85%] leading-relaxed shadow-sm">
        <span class="italic opacity-75">🤖 Finder's Partner sedang berpikir...</span>
      </div>
    </div>
  `;
  chatBox.scrollTop = chatBox.scrollHeight;

  const replyBubble = document.getElementById(replyId);
  let accumulatedText = '';

  try {
    const response = await fetch('http://localhost:3000/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: userText,
        campusContext: getCampusEventsSummary()
      })
    });

    if (!response.body) throw new Error('Stream tidak didukung browser.');

    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      accumulatedText += chunk;

      if (accumulatedText.startsWith('__ERROR__:')) {
        const errMsg = accumulatedText.replace('__ERROR__:', '');
        replyBubble.className = 'bg-red-50 text-red-600 border border-red-200 text-xs px-4 py-3 rounded-2xl rounded-tl-none max-w-[85%] leading-relaxed';
        replyBubble.innerHTML = escapeChatHtml(errMsg);
      } else {
        replyBubble.innerHTML = formatChatMarkdown(accumulatedText);
      }

      chatBox.scrollTop = chatBox.scrollHeight;
    }
  } catch (err) {
    replyBubble.className = 'bg-red-50 text-red-600 border border-red-200 text-xs px-4 py-3 rounded-2xl rounded-tl-none max-w-[85%] leading-relaxed';
    replyBubble.innerHTML = 'Koneksi ke server terputus. Pastikan terminal VS Code menjalankan <b>node server.js</b> ya!';
  } finally {
    isSendingChat = false;
    chatBox.scrollTop = chatBox.scrollHeight;
  }
}

// Dukungan tombol Enter
document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('chatInput') || document.querySelector('#chatModal input[type="text"]');
  if (input) {
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        sendChatMessage();
      }
    });
  }
});

function escapeChatHtml(str) {
  return String(str).replace(/[&<>"']/g, m => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'
  }[m]));
}

function formatChatMarkdown(text) {
  return escapeChatHtml(text)
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\n/g, '<br>');
}