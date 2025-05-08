<script>
    // Firebase configuration
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

    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);

    const database = firebase.database();

    // Mengirim pesan ke Firebase
    function sendMessage() {
        const message = document.getElementById('messageInput').value;
        if (message.trim() !== "") {
            const newMessageRef = database.ref('messages').push();
            newMessageRef.set({
                user: 'User1', // Ganti dengan nama pengguna sesuai aplikasi Anda
                message: message,
                timestamp: Date.now()
            });
            document.getElementById('messageInput').value = ''; // Clear input
        }
    }

    // Menampilkan pesan dari Firebase
    function getMessages() {
        const messagesRef = database.ref('messages');
        messagesRef.on('child_added', function(snapshot) {
            const data = snapshot.val();
            displayMessage(data.user, data.message, data.timestamp);
        });
    }

    // Menampilkan pesan di layar
    function displayMessage(user, message, timestamp) {
        const chatBody = document.getElementById('chatBody');
        const messageElement = document.createElement('div');
        messageElement.classList.add('messenger');
        messageElement.innerHTML = `
            <div class="user">${user}</div>
            <div class="time">${new Date(timestamp).toLocaleTimeString()}</div>
            <div class="text">${message}</div>
        `;
        chatBody.appendChild(messageElement);
        chatBody.scrollTop = chatBody.scrollHeight; // Scroll ke bawah
    }

    // Memanggil fungsi getMessages saat halaman dimuat
    window.onload = getMessages;

    // Fungsi untuk menampilkan dan menyembunyikan sidebar
    function toggleSidebar() {
        const sidebar = document.getElementById('sidebar');
        if (sidebar.style.right === '0px') {
            sidebar.style.right = '-200px';
        } else {
            sidebar.style.right = '0px';
        }
    }

    // Menutup sidebar
    function closeSidebar() {
        document.getElementById('sidebar').style.right = '-200px';
    }

    // Reset chat (hapus semua pesan)
    function resetChat() {
        const messagesRef = database.ref('messages');
        messagesRef.remove(); // Hapus semua pesan
        document.getElementById('chatBody').innerHTML = ''; // Bersihkan chat di halaman
    }
</script>