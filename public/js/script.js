const chatBox = document.getElementById("chat-box");

// Pesan sambutan dari chatbot
function greetingMessage() {
  const greeting = "Halo 🌸 Jangan sedih, ada banyak hal baik yang menunggu di depan sana. Apa yang bisa aku bantu hari ini?";
  displayBotMessage(greeting);
}

greetingMessage();

// Tampilkan balon chat dari user
function displayUserMessage(message) {
  const messageRow = document.createElement("div");
  messageRow.classList.add("message-row", "user");

  const messageBubble = document.createElement("div");
  messageBubble.classList.add("user-message");
  messageBubble.innerText = message;

  messageRow.appendChild(messageBubble);
  chatBox.appendChild(messageRow);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// Tampilkan balon chat dari bot
function displayBotMessage(message) {
  const messageRow = document.createElement("div");
  messageRow.classList.add("message-row", "bot");

  const messageBubble = document.createElement("div");
  messageBubble.classList.add("bot-message");
  messageBubble.innerText = message;

  // Hapus elemen avatar
  // const avatar = document.createElement("img");
  // avatar.src = "avatar.jpg";
  // avatar.alt = "Bot Avatar";
  // avatar.classList.add("avatar");
  // messageRow.appendChild(avatar);

  messageRow.appendChild(messageBubble);
  chatBox.appendChild(messageRow);
  chatBox.scrollTop = chatBox.scrollHeight;
}


// Fungsi kirim pesan
async function sendMessage() {
  const input = document.getElementById("user-input");
  const message = input.value.trim();
  if (!message) return;

  displayUserMessage(message); // Tampilkan pesan user
  input.value = ""; // Kosongkan input

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": "Bearer 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",
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:5500",
        "X-Title": "Curhat Anonim Chatbot"
      },
      body: JSON.stringify({
        model: "openai/gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "Kamu adalah chatbot ramah bernama Hada, yang mendengarkan pengguna dan merespons dengan kalimat singkat, lembut, dan menenangkan serta sedikit emoticon."
          },
          { role: "user", content: message }
        ]
      })
    });

    const data = await response.json();

    if (data.choices && data.choices.length > 0) {
      const reply = data.choices[0].message.content;
      displayBotMessage(reply);
    } else {
      displayBotMessage("Maaf, terjadi kesalahan. Coba lagi ya.");
    }

  } catch (error) {
    displayBotMessage("Wah, sepertinya koneksi sedang bermasalah. Coba lagi nanti ya 🙏");
  }
}

// Kirim dengan Enter
document.getElementById("user-input").addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    sendMessage();
  }
});
