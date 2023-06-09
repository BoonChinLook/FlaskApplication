var darkModeToggle = document.getElementById("dark-mode-toggle");
darkModeToggle.addEventListener("click", function() {
  document.body.classList.toggle("dark-mode");
  document.body.classList.toggle("dark-theme");
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

   // Checks if any of the inputs are empty and alerts/stops user from continuing if they are
   if (!name || !email || !password) {
    alert('Error: Please fill in all fields to submit');
    return;
  }

  //password analysis
  const passwordPattern = /^(?=.*[A-Z])(?=.*[!@#$%^&*;])[a-zA-Z0-9!@#$%^&*;]{8,}$/;

  if (!passwordPattern.test(password)) {
    alert('Error: Password must have a minimum of 8 characters, including a capital letter and a special character (!@#$%^&*).');
    return;
  }

  const userRequestBody = {
    name: name,
    email: email
  };

  const passwordRequestBody = {
    user: null,
    password: password
  };
// email validation
  const emailRegex = /^[^@]+@[^@]+\.[^@]+$/;
  if (!emailRegex.test(email)) {
    alert('Error: Invalid email format.');
    return;
  }

//error messages
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

document.getElementById("calculateButton").addEventListener("click", function() {
  var firstInput = parseFloat(document.getElementById("firstInput").value);
  var secondInput = parseFloat(document.getElementById("secondInput").value);
  var operation = document.getElementById("operationInput").value;
  var result;

  if (isNaN(firstInput) || isNaN(secondInput)) {
    result = "Invalid input";
  } else {
    switch (operation) {
      case "+":
        result = firstInput + secondInput;
        break;
      case "-":
        result = firstInput - secondInput;
        break;
      case "*":
        result = firstInput * secondInput;
        break;
      case "/":
        if (secondInput === 0) {
          result = "Division by zero";
        } else {
          result = firstInput / secondInput;
        }
        break;
      default:
        result = "Invalid operation";
        break;
    }
  }

  alert("Result: " + result);
});

$(document).ready(function() {
  $('#passwordToggle').click(function() {
    var passwordInput = $('#passwordInput');
    var fieldType = passwordInput.attr('type');
    var icon = $('#passwordToggle i');
    
    if (fieldType === 'password') {
      passwordInput.attr('type', 'text');
      icon.removeClass('bi-eye-fill').addClass('bi-eye-slash-fill text-dark');
    } else {
      passwordInput.attr('type', 'password');
      icon.removeClass('bi-eye-slash-fill text-dark').addClass('bi-eye-fill');
    }
  });
});

