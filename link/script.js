  import { redirectIfNotLoggedIn, getUsername } from './authCheck.js';
  redirectIfNotLoggedIn();

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase, ref, push, set, onChildAdded } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";


const firebaseConfig = {
  apiKey: "AIzaSyDcTf6anqbIPdNaFXjEaqqSxNhdYki4ZFM",
  authDomain: "appchat-9bfeb.firebaseapp.com",
  databaseURL: "https://appchat-9bfeb-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "appchat-9bfeb",
  storageBucket: "appchat-9bfeb.appspot.com",
  messagingSenderId: "1012809974964",
  appId: "1:1012809974964:web:ff967f83e2095e887883e1",
  measurementId: "G-NYW7VX043F"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

window.sendMessage = function () {
  const messageInput = document.getElementById('messageInput');
  const message = messageInput.value.trim();

  if (message !== "") {
    const newMessageRef = push(ref(database, 'messages'));
    set(newMessageRef, {
      user: getUsername(),
      message,
      timestamp: Date.now()
    }).then(() => {
      messageInput.value = '';
    }).catch((error) => {
      console.error("Terjadi kesalahan saat mengirim pesan: ", error);
    });
  }
};

function getMessages() {
  const messagesRef = ref(database, 'messages');
  onChildAdded(messagesRef, (snapshot) => {
    const data = snapshot.val();
    displayMessage(data.user, data.message, data.timestamp);
  });
}

window.displayMessage = function (user, message, timestamp) {
  const chatBody = document.getElementById('chatBody');
  const messageElement = document.createElement('div');
  messageElement.classList.add('messenger');
  messageElement.innerHTML = `
    <div class="user">${user} <span class="time">${new Date(timestamp).toLocaleTimeString()}</span></div>
    <div class="text">${message}</div>
  `;
  chatBody.appendChild(messageElement);
  chatBody.scrollTop = chatBody.scrollHeight;
};

window.onload = function () {
  getMessages();
};
window.toggleSidebar = function () {
  const sidebar = document.getElementById('sidebar');
  if (sidebar) {
    const isVisible = sidebar.style.right === '0px';
    sidebar.style.right = isVisible ? '-220px' : '0px';
  }
};
window.closeSidebar = function () {
  const sidebar = document.getElementById('sidebar');
  if (sidebar) sidebar.style.right = '-220px';
};
// Mengecek apakah user admin
function isAdmin() {
  return getUsername() === 'admin';
}

// Tampilkan tombol reset jika admin
window.onload = function () {
  getMessages();
  if (isAdmin()) {
    document.getElementById('resetPasswordBtn').style.display = 'block';
  }
};

// Fungsi reset password oleh admin
window.resetPassword = async function () {
  const usernameToReset = prompt("Masukkan username yang ingin di-reset:");
  const newPassword = prompt("Masukkan password baru:");

  if (usernameToReset && newPassword) {
    try {
      const dbRef = ref(database, `users/${usernameToReset}`);
      await set(dbRef, { password: newPassword });
      alert(`Password untuk ${usernameToReset} berhasil direset.`);
    } catch (error) {
      alert("Gagal mereset password: " + error.message);
    }
  } else {
    alert("Username dan password baru harus diisi.");
  }
};

//reset
window.resetChat = function () {
  const username = getUsername();
  if (username !== 'admin') {
    alert("Hanya admin yang dapat mereset chat.");
    return;
  }

  const confirmation = confirm("Yakin ingin mereset semua pesan?");
  if (!confirmation) return;

  const db = getDatabase();
  const messagesRef = ref(db, 'messages');
  set(messagesRef, null)
    .then(() => {
      alert("Semua pesan berhasil dihapus.");
      location.reload();
    })
    .catch((error) => {
      console.error("Gagal mereset pesan:", error);
      alert("Gagal mereset pesan.");
    });
};
