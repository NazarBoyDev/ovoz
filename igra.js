const display = document.getElementById("display");
const statusEl = document.getElementById("status");
const startBtn = document.getElementById("startBtn");
const clearBtn = document.getElementById("clearBtn");

// Brauzerda SpeechRecognition mavjudligini tekshirish
window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if (!window.SpeechRecognition) {
  alert("Sizning brauzeringiz ovozli tanib olishni qo‘llab-quvvatlamaydi 😔");
} else {
  const recognition = new SpeechRecognition();
  recognition.lang = "uz-UZ"; // O'zbek tili
  recognition.interimResults = false;

  startBtn.addEventListener("click", () => {
    recognition.start();
    statusEl.textContent = "🎧 Eshitilmoqda...";
  });

  recognition.addEventListener("result", (event) => {
    const transcript = event.results[0][0].transcript.toLowerCase();
    statusEl.textContent = `Siz dedingiz: "${transcript}"`;

    // So'zlarni matematik ifodaga aylantirish
    let expression = transcript
      .replace(/plus/g, "+")
      .replace(/qo'sh/g, "+")
      .replace(/minus/g, "-")
      .replace(/ayir/g, "-")
      .replace(/ko'paytir/g, "*")
      .replace(/kopaytir/g, "*")
      .replace(/bo'lib/g, "/")
      .replace(/bolib/g, "/")
      .replace(/bo‘l/g, "/")
      .replace(/bo'ling/g, "/");

    // Son so'zlarini raqamlarga almashtirish (asosiylari)
    const numbers = {
      'nol': 0, 'bir': 1, 'ikki': 2, 'uch': 3, 'to‘rt': 4, 'tort': 4,
      'besh': 5, 'olti': 6, 'yetti': 7, 'sakkiz': 8, 'to‘qqiz': 9, 'toqqiz': 9,
      'o‘n': 10, 'on': 10
    };
    for (let [word, num] of Object.entries(numbers)) {
      expression = expression.replace(new RegExp(word, 'g'), num);
    }

    try {
      const result = eval(expression);
      display.value = `${expression} = ${result}`;
    } catch {
      display.value = "Xatolik!";
    }
  });

  recognition.addEventListener("end", () => {
    statusEl.textContent = "🎙️ Yana gapiring...";
  });
}

clearBtn.addEventListener("click", () => {
  display.value = "";
});
