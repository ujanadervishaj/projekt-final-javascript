document.getElementById('signupForm').addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (password !== confirmPassword) {
        showNotification('Passwords do not match!', 'error');
        return;
    }

    if (password.length < 4) {
        showNotification('Password must be at least 4 characters long!', 'error');
        return;
    }

    const result = userManager.register(email, password, name);

    if (result.success) {
        showNotification('Account created successfully! Redirecting to login...', 'success');
        setTimeout(() => {
            window.location.href = '../htmls/login.html';
        }, 1500);
    } else {
        showNotification(result.message, 'error');
    }
});

function showNotification(message, type) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.className = `notification show ${type}`;
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}