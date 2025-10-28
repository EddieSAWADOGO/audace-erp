document.addEventListener("DOMContentLoaded", () => {
  /**
   * Charge les composants HTML (sidebar et header) dans la page.
   */
  const loadComponents = async () => {
    const sidebarContainer = document.getElementById("sidebar-container");
    const headerContainer = document.getElementById("header-container");

    try {
      // Charge le menu latéral
      let response = await fetch("components/sidebar.html");
      sidebarContainer.innerHTML = await response.text();

      // Charge l'en-tête
      response = await fetch("components/header.html");
      headerContainer.innerHTML = await response.text();
    } catch (error) {
      console.error("Erreur lors du chargement des composants :", error);
    }
  };

  /**
   * Initialise les fonctionnalités après le chargement des composants.
   */
  const initializeApp = () => {
    // --- 1. Gestion de la responsivité du menu mobile ---
    const mobileMenuBtn = document.getElementById("mobileMenuBtn");
    const sidebar = document.getElementById("sidebar");
    const mainContent = document.querySelector(".main-content");

    if (mobileMenuBtn && sidebar) {
      mobileMenuBtn.addEventListener("click", (e) => {
        e.stopPropagation(); // Empêche la fermeture immédiate
        sidebar.classList.toggle("mobile-open");
      });
    }

    // Ferme le menu si on clique sur le contenu principal
    if (mainContent && sidebar) {
      mainContent.addEventListener("click", () => {
        if (sidebar.classList.contains("mobile-open")) {
          sidebar.classList.remove("mobile-open");
        }
      });
    }

    // --- 2. Mise en surbrillance du lien de menu actif ---
    const currentPage =
      window.location.pathname.split("/").pop() || "index.html";
    const menuLink = document.querySelector(
      `.sidebar-menu a[href="${currentPage}"]`
    );
    if (menuLink) {
      menuLink.classList.add("active");
    }

    // --- 3. Mise à jour dynamique du titre de la page ---
    const pageTitleElement = document.getElementById("pageTitle");

    if (pageTitleElement) {
        // Titres personnalisés pour les pages sans menu
        const customTitles = {
          'form-builder.html': 'Formulaires',
          'projet-detail.html': 'Détail du Projet',
          'facture-view.html': 'Visualisation Facture',
          'profil.html': 'Mon Profil'
          // Ajoutez d'autres pages ici au besoin
        };

      const activeMenuLink = document.querySelector(".menu-item.active span");

      if (activeMenuLink) {
        // titre depuis le menu
        pageTitleElement.textContent = activeMenuLink.textContent;
      } else if (customTitles[currentPage]) {
        //titre personnalise pour les pages hors menu
        pageTitleElement.textContent = customTitles[currentPage];
      } else {
        // Titre par defaut base sur le nom du fichier
        const defaultTitle = currentPage.replace('.html', '').replace(/-/g, ' ');
        pageTitleElement.textContent =
          defaultTitle.charAt(0).toUpperCase() + defaultTitle.slice(1);
      }
    }
  };

  // Exécution : charger les composants, PUIS initialiser l'application.
  loadComponents().then(initializeApp);
});
