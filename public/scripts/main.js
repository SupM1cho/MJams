document.addEventListener('DOMContentLoaded', () => {
  const socket = io(); // Connect to the Socket.IO server

  // Check if the user is logged in (i.e., token and nickname exist in query parameters)
  const { token, nickname } = getQueryParams();
  if (token && nickname) {
    // Store token and nickname in localStorage
    localStorage.setItem('token', token);
    localStorage.setItem('nickname', nickname);

    // Display nickname
    displayNickname(nickname);
  } else {
    // User is not logged in, display login button
    displayLoginButton();
  }

  // DOM elements
  const messageForm = document.getElementById('message-form');
  const messageInput = document.getElementById('message-input');
  const chatMessages = document.getElementById('chat-messages');

  // Event listener for chat form submission
  messageForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = messageInput.value;

    // Emit the chat message to the server
    socket.emit('chat message', message);

    // Clear the message input field
    messageInput.value = '';
  });

  // Event listener for receiving chat messages from the server
  socket.on('chat message', (msg) => {
    const messageItem = document.createElement('li');
    messageItem.textContent = msg;
    chatMessages.appendChild(messageItem);
  });

  // Add the following code to handle successful login
  socket.on('login', (data) => {
    const { token, nickname } = data;

    // Store token and nickname in localStorage
    localStorage.setItem('token', token);
    localStorage.setItem('nickname', nickname);

    // Display nickname
    displayNickname(nickname);
  });

   // Add more event listeners or logic as needed for your project
});

function displayNickname(nickname) {
  const nicknameDisplay = document.getElementById('nickname-display');
  nicknameDisplay.innerHTML = `<p>Welcome, ${nickname}! <button onclick="logout()">Logout</button></p>`;
}

function displayLoginButton() {
  const nicknameDisplay = document.getElementById('nickname-display');
  nicknameDisplay.innerHTML = '<button onclick="redirectToLogin()">Login</button>';
}

// Event listener for login button click
function redirectToLogin() {
  window.location.href = '/login';
}

// Event listener for logout button click
function logout() {
  // Clear user data from localStorage
  localStorage.removeItem('token');
  localStorage.removeItem('nickname');

  // Redirect to login page
  redirectToLogin();
}

// Function to parse query parameters
function getQueryParams() {
  const params = new URLSearchParams(window.location.search);
  const token = params.get('token');
  const nickname = params.get('nickname');
  return { token, nickname };
}
