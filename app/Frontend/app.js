const sign_in_btn = document.querySelector("#sign-in-btn");
const sign_up_btn = document.querySelector("#sign-up-btn");
const container = document.querySelector(".container");

sign_up_btn.addEventListener("click", () => {
  container.classList.add("sign-up-mode");
});

sign_in_btn.addEventListener("click", () => {
  container.classList.remove("sign-up-mode");
});

const API_URL = "http://localhost:5000/api";

// ✅ Signup
document.getElementById("signupForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const username = document.getElementById("signupUsername").value;
  const email = document.getElementById("signupEmail").value;
  const password = document.getElementById("signupPassword").value;
  const confirmPassword = document.getElementById("signupConfirmPassword").value;

  if (password !== confirmPassword) {
    alert("❌ Passwords do not match");
    return;
  }

  try {
    const res = await fetch(`${API_URL}/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    });
    const data = await res.json();
    if (res.ok) {
      alert("✅ Signup successful! Please login.");
      container.classList.remove("sign-up-mode");
    } else {
      alert("❌ " + (data.error || "Signup failed"));
    }
  } catch (err) {
    console.error(err);
    alert("Error signing up");
  }
});

// ✅ Login
document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  try {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();

    if (data.token) {
      localStorage.setItem("token", data.token);
      alert("✅ Login successful!");
      window.location.href = "dashboard.html";
    } else {
      alert("❌ " + (data.error || "Invalid credentials"));
    }
  } catch (err) {
    console.error(err);
    alert("Error logging in");
  }
});


// ===== Password Toggle =====
document.querySelectorAll(".toggle-password").forEach(icon => {
  icon.addEventListener("click", () => {
    const input = document.getElementById(icon.dataset.target);
    if (input.type === "password") {
      input.type = "text";
      icon.classList.remove("fa-eye");
      icon.classList.add("fa-eye-slash");
    } else {
      input.type = "password";
      icon.classList.remove("fa-eye-slash");
      icon.classList.add("fa-eye");
    }
  });
});

// ===== Forgot Password Modal =====
const forgotLink = document.getElementById("forgotPasswordLink");
const modal = document.getElementById("forgotPasswordModal");
const closeBtn = modal.querySelector(".close");

forgotLink.addEventListener("click", () => modal.style.display = "block");
closeBtn.addEventListener("click", () => modal.style.display = "none");
window.addEventListener("click", (e) => {
  if (e.target === modal) modal.style.display = "none";
});

document.getElementById("forgotPasswordForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("resetEmail").value;

  try {
    const res = await fetch(`${API_URL}/auth/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email })
    });
    const data = await res.json();
    if (res.ok) {
      alert("✅ Reset link sent to your email!");
      modal.style.display = "none";
    } else {
      alert("❌ " + (data.error || "Failed to send reset link"));
    }
  } catch (err) {
    console.error(err);
    alert("Error sending reset link");
  }
});
