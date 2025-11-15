(function() {
  // Get the token from localStorage
  const token = localStorage.getItem('token');

  // Get the current page path
  const currentPage = window.location.pathname.split('/').pop();

  // If there is NO token, and the user is NOT already on the login or signup page...
  if (!token && currentPage !== 'login.html' && currentPage !== 'signup.html' && currentPage !== 'index.html') {
    // Store the current page as the return URL
    localStorage.setItem('returnUrl', window.location.pathname);
    // Redirect them to the login page
    window.location.href = 'login.html';
  }
})();
