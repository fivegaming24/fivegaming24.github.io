export function redirectIfNotLoggedIn() {
    const username = localStorage.getItem('username');
    if (!username) {
      window.location.href = 'index1.html';
    }
  }
  
  export function getUsername() {
    return localStorage.getItem('username');
  }
  
