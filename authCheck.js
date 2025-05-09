export function redirectIfNotLoggedIn() {
    const username = localStorage.getItem('username');
    if (!username) {
      window.location.href = 'index2.html';
    }
  }
  
  export function getUsername() {
    return localStorage.getItem('username');
  }
  
