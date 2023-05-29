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
  
  const requestBody = {
    name: name,
    email: email,
    password: password
  };

  let url = '';
  if (name !== '') {
    url = '/api/email';
  } else {
    url = '/api/user';
  }

  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(requestBody)
  })
    .then(response => response.json())
    .then(data => {
      console.log(data);
    })
    .catch(error => {
      console.error('Error:', error);
    });
}

const button = document.getElementById('mySub');
button.addEventListener('click', () => {
  alert('You have made a log');
  handleClick();
});



