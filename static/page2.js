var darkModeToggle = document.getElementById("dark-mode-toggle");
darkModeToggle.addEventListener("click", function() {
  document.body.classList.toggle("dark-mode");
});


var darkModeToggle = document.getElementById("dark-mode-toggle");
darkModeToggle.addEventListener("click", function() {
  if (document.documentElement.getAttribute("data-bs-theme") === "dark") {
    document.documentElement.setAttribute("data-bs-theme", "light");
  } else {
    document.documentElement.setAttribute("data-bs-theme", "dark");
  }
});


function handleClick() {
  const name = document.getElementById('nameInput').value;
  const email = document.getElementById('emailInput').value;
  const password = document.getElementById('passwordInput').value;

  const userRequestBody = {
    name: name,
    email: email
  };

  const passwordRequestBody = {
    user: null,
    password: password
  };

  fetch('/api/user', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(userRequestBody)
  })
  .then(response => response.json())
  .then(data => {
    console.log(data);
    if (data.error) {
      if (data.error.includes('Username and email are already taken.')) {
        alert('Error: Username and email are already taken.');
      } else if (data.error.includes('Username is already taken.')) {
        alert('Error: Username is already taken.');
      } else if (data.error.includes('Email is already taken.')) {
        alert('Error: Email is already taken.');
      }
    } else {
      passwordRequestBody.user = data.id; // Set the user ID for the password request
      return fetch('/api/password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(passwordRequestBody)
      });
    }
  })
  .then(response => response.json())
  .then(data => {
    console.log(data);
    alert(`User ${name} created.`);
    alert('You have made a log');
  })
}

const button = document.getElementById('mySub');
button.addEventListener('click', () => {
  handleClick();
});





