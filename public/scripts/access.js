const accessFormHandler = async (event) => {
    event.preventDefault();
  
    // Collect values from the login form
    const username = document.querySelector('#username').value.trim();
    const password = document.querySelector('#password').value.trim();
    
    const accessForm = document.location.href;
    if (username && password) {
      // Send a POST request to the API endpoint
      const response = await fetch(accessForm, {
        method: 'POST',
        body: JSON.stringify({ username, password }),
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        document.location.replace('/api/dashboard'); 
      } else if(response.status === 403){
        alert("Sorry, the chosen username is already taken. Please try another one.");
      } else if(response.status === 422){
        alert("Password length is too short. It must have at least 8 characters.")
      } else{
        alert("Invalid username or password. Either try again or sign-up if you are new.");

      };
    } else {
      alert('You must enter both a username and a password to access.');
    }
  };

  document.querySelector('.login-form').addEventListener('submit', accessFormHandler);
  