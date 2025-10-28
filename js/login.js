// js/login.js - VERSION MAQUETTE SIMPLE
document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.getElementById("employeeLoginForm");

  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const email = document.getElementById("employeeEmail").value;
    const password = document.getElementById("employeePassword").value;

    // Validation basique uniquement pour l'UI
    if (!email || !password) {
      showError("Veuillez remplir tous les champs");
      return;
    }

    // Afficher le loading
    const submitBtn = loginForm.querySelector(".btn-login");
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Connexion...';
    submitBtn.disabled = true;

    // Redirection directe après un petit délai pour l'effet visuel
    setTimeout(() => {
      window.location.href = "index.html";
    }, 800);
  });

  function showError(message) {
    // Supprimer les anciennes erreurs
    const existingError = document.querySelector(".error-message");
    if (existingError) {
      existingError.remove();
    }

    // Afficher la nouvelle erreur
    const errorDiv = document.createElement("div");
    errorDiv.className = "error-message";
    errorDiv.innerHTML = `
            <i class="fas fa-exclamation-circle"></i>
            <span>${message}</span>
        `;
    errorDiv.style.cssText = `
            background: #fee2e2;
            border: 1px solid #fecaca;
            color: #dc2626;
            padding: 12px;
            border-radius: 8px;
            margin-bottom: 20px;
            display: flex;
            align-items: center;
            gap: 8px;
        `;

    loginForm.insertBefore(errorDiv, loginForm.firstChild);

    // Supprimer l'erreur après 5 secondes
    setTimeout(() => {
      errorDiv.remove();
    }, 5000);
  }
});
