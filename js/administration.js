// administration.js - Gestion de l'administration

let users = [];
let companySettings = {};
let currentEditingUser = null;

document.addEventListener("DOMContentLoaded", function () {
  initializeAdministration();
});

function initializeAdministration() {
  console.log("Initialisation du module d'administration...");

  loadUsers();
  loadCompanySettings();
  initializeEventListeners();
  updateOverview();
  initializeTabs();
}

function initializeEventListeners() {
  // Filtres
  const roleFilter = document.getElementById("roleFilter");
  const statusFilter = document.getElementById("statusFilter");

  if (roleFilter) {
    roleFilter.addEventListener("change", filterUsers);
  }

  if (statusFilter) {
    statusFilter.addEventListener("change", filterUsers);
  }
}

function initializeTabs() {
  const tabButtons = document.querySelectorAll(".tab-btn");

  tabButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const tabId = this.getAttribute("data-tab") + "Tab";

      // Désactiver tous les onglets
      document
        .querySelectorAll(".tab-btn")
        .forEach((btn) => btn.classList.remove("active"));
      document
        .querySelectorAll(".tab-content")
        .forEach((content) => content.classList.remove("active"));

      // Activer l'onglet courant
      this.classList.add("active");
      document.getElementById(tabId).classList.add("active");
    });
  });
}

function loadUsers() {
  // Utilisateurs de démonstration
  users = [
    {
      id: 1,
      nom: "Kaboré",
      prenom: "Marie",
      email: "marie@audacedigicom.bf",
      poste: "Gestionnaire de Projet",
      role: "gestionnaire",
      whatsapp: "+226 70 11 22 33",
      telephone: "+226 70 11 22 34",
      adresse: "Ouagadougou, Secteur 15",
      statut: "actif",
      dateCreation: "2024-01-15",
      permissions: [],
      notes: "Responsable des projets clients",
    },
    {
      id: 2,
      nom: "Traoré",
      prenom: "Jean",
      email: "jean@audacedigicom.bf",
      poste: "Graphiste Senior",
      role: "creatif",
      whatsapp: "+226 76 44 55 66",
      telephone: "+226 76 44 55 67",
      adresse: "Ouagadougou, Secteur 12",
      statut: "actif",
      dateCreation: "2024-02-20",
      permissions: [],
      notes: "Spécialiste création visuelle",
    },
    {
      id: 3,
      nom: "Sawadogo",
      prenom: "Pierre",
      email: "pierre@audacedigicom.bf",
      poste: "Comptable",
      role: "comptable",
      whatsapp: "+226 65 77 88 99",
      telephone: "+226 65 77 88 90",
      adresse: "Ouagadougou, Secteur 18",
      statut: "actif",
      dateCreation: "2024-03-10",
      permissions: [],
      notes: "Gestion financière et rapports",
    },
  ];

  updateUsersDisplay();
}

function loadCompanySettings() {
  // Paramètres de l'entreprise
  companySettings = {
    name: "Audace Digicom",
    sector: "Marketing et communication digitale",
    address: "Ouagadougou, Burkina Faso",
    phone: "+226 00 00 00 00",
    email: "contact@audacedigicom.bf",
    website: "www.audacedigicom.bf",
    ifu: "N/A",
    rccm: "N/A",
  };

  updateCompanyDisplay();
}

function updateOverview() {
  const totalUsers = users.filter((u) => u.statut === "actif").length;
  const adminCount = users.filter((u) => u.role === "super-admin").length;
  const inactiveCount = users.filter((u) => u.statut === "inactif").length;

  document.getElementById("totalUsers").textContent = totalUsers;
  document.getElementById("adminCount").textContent = adminCount;
  document.getElementById("inactiveCount").textContent = inactiveCount;
  document.getElementById("recentActivity").textContent = "3"; // Simulation
}

function updateUsersDisplay() {
  const tableBody = document.querySelector("#usersTable tbody");
  const activeUsers = users.filter((u) => u.statut === "actif");

  document.getElementById(
    "usersCount"
  ).textContent = `${activeUsers.length} utilisateurs`;

  let html = "";

  users.forEach((user) => {
    const initials = (user.prenom.charAt(0) + user.nom.charAt(0)).toUpperCase();
    const fullName = `${user.prenom} ${user.nom}`;

    html += `
            <tr>
                <td>
                    <div class="user-info">
                        <div class="user-avatar">${initials}</div>
                        <div class="user-details">
                            <div class="user-name">${fullName}</div>
                            <div class="user-email">${user.email}</div>
                        </div>
                    </div>
                </td>
                <td>
                    <span class="role-badge role-${user.role}">${getRoleLabel(
      user.role
    )}</span>
                </td>
                <td>${user.poste}</td>
                <td>
                    <div class="contact-info">
                        <div>${user.whatsapp}</div>
                        <div class="text-muted">${user.email}</div>
                    </div>
                </td>
                <td>${formatDate(user.dateCreation)}</td>
                <td>
                    <span class="status-badge status-${user.statut}">
                        ${user.statut === "actif" ? "Actif" : "Inactif"}
                    </span>
                </td>
                <td>
                    <div class="action-buttons">
                        <button class="btn-icon btn-view" onclick="viewUser(${
                          user.id
                        })" title="Voir">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn-icon btn-edit" onclick="editUser(${
                          user.id
                        })" title="Modifier">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-icon btn-delete" onclick="toggleUserStatus(${
                          user.id
                        })" title="${
      user.statut === "actif" ? "Désactiver" : "Activer"
    }">
                            <i class="fas ${
                              user.statut === "actif"
                                ? "fa-user-slash"
                                : "fa-user-check"
                            }"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
  });

  tableBody.innerHTML = html;
}

function updateCompanyDisplay() {
  document.getElementById("companyName").textContent = companySettings.name;
  document.getElementById("companySector").textContent = companySettings.sector;
  document.getElementById("companyAddress").textContent =
    companySettings.address;
  document.getElementById("companyPhone").textContent = companySettings.phone;
  document.getElementById("companyEmail").textContent = companySettings.email;
  document.getElementById("companyIFU").textContent = companySettings.ifu;
  document.getElementById("companyRCCM").textContent = companySettings.rccm;
  document.getElementById("companyWebsite").textContent =
    companySettings.website;
}

// Fonctions modales
function openUserModal() {
  currentEditingUser = null;
  document.getElementById("userModalTitle").textContent = "Nouvel Utilisateur";
  document.getElementById("userForm").reset();
  loadPermissionsGrid();
  resetTabs();
  document.getElementById("userModal").classList.add("show");
}

function closeUserModal() {
  document.getElementById("userModal").classList.remove("show");
  currentEditingUser = null;
}

function resetTabs() {
  document.querySelectorAll(".tab-btn").forEach((btn, index) => {
    btn.classList.toggle("active", index === 0);
  });
  document.querySelectorAll(".tab-content").forEach((content, index) => {
    content.classList.toggle("active", index === 0);
  });
}

function loadPermissionsGrid() {
  const permissionsGrid = document.getElementById("permissionsGrid");
  const permissions = [
    { id: "clients_crud", label: "CRUD Clients complet" },
    { id: "projets_crud", label: "CRUD Projets complet" },
    { id: "services_crud", label: "CRUD Services complet" },
    { id: "taches_assignation", label: "Assignation des tâches" },
    { id: "rapports_financiers", label: "Accès rapports financiers" },
    { id: "parametres_systeme", label: "Modification paramètres système" },
  ];

  permissionsGrid.innerHTML = permissions
    .map(
      (perm) => `
        <div class="permission-item">
            <input type="checkbox" id="perm_${perm.id}" name="permissions" value="${perm.id}">
            <label for="perm_${perm.id}" class="permission-label">${perm.label}</label>
        </div>
    `
    )
    .join("");
}

function onRoleChange() {
  const role = document.getElementById("userRole").value;
  const permissionsGrid = document.getElementById("permissionsGrid");

  // Réinitialiser toutes les permissions
  permissionsGrid
    .querySelectorAll('input[type="checkbox"]')
    .forEach((checkbox) => {
      checkbox.checked = false;
    });

  // Appliquer les permissions par défaut selon le rôle
  const defaultPermissions = getDefaultPermissions(role);
  defaultPermissions.forEach((permId) => {
    const checkbox = document.getElementById(`perm_${permId}`);
    if (checkbox) {
      checkbox.checked = true;
      checkbox.disabled = true; // Empêcher la modification des permissions de base
    }
  });
}

function getDefaultPermissions(role) {
  const permissionsMap = {
    "super-admin": [
      "clients_crud",
      "projets_crud",
      "services_crud",
      "taches_assignation",
      "rapports_financiers",
      "parametres_systeme",
    ],
    gestionnaire: [
      "clients_crud",
      "projets_crud",
      "services_crud",
      "taches_assignation",
    ],
    creatif: [],
    comptable: ["rapports_financiers"],
    employe: [],
  };

  return permissionsMap[role] || [];
}

function saveUser() {
  const form = document.getElementById("userForm");
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  const userData = {
    nom: document.getElementById("userNom").value,
    prenom: document.getElementById("userPrenom").value,
    email: document.getElementById("userEmail").value,
    poste: document.getElementById("userPoste").value,
    role: document.getElementById("userRole").value,
    whatsapp: document.getElementById("userWhatsApp").value,
    telephone: document.getElementById("userTelephone").value,
    adresse: document.getElementById("userAdresse").value,
    statut: document.getElementById("userStatut").value,
    notes: document.getElementById("userNotes").value,
    cnib: document.getElementById("userCNIB").value,
    cnibDateDelivrance: document.getElementById("userCNIBDateDelivrance").value,
    cnibDateExpiration: document.getElementById("userCNIBDateExpiration").value,
    permissions: Array.from(
      document.querySelectorAll('input[name="permissions"]:checked')
    ).map((cb) => cb.value),
  };

  if (currentEditingUser) {
    // Modification
    const index = users.findIndex((u) => u.id === currentEditingUser);
    if (index !== -1) {
      users[index] = { ...users[index], ...userData };
    }
  } else {
    // Nouvel utilisateur
    const newUser = {
      id: Date.now(),
      dateCreation: new Date().toISOString().split("T")[0],
      ...userData,
    };
    users.push(newUser);
  }

  updateUsersDisplay();
  updateOverview();
  closeUserModal();

  alert("Utilisateur enregistré avec succès!");
}

function editUser(userId) {
  const user = users.find((u) => u.id === userId);
  if (!user) return;

  currentEditingUser = userId;
  document.getElementById(
    "userModalTitle"
  ).textContent = `Modifier ${user.prenom} ${user.nom}`;

  // Remplir le formulaire
  document.getElementById("userNom").value = user.nom;
  document.getElementById("userPrenom").value = user.prenom;
  document.getElementById("userEmail").value = user.email;
  document.getElementById("userPoste").value = user.poste;
  document.getElementById("userRole").value = user.role;
  document.getElementById("userWhatsApp").value = user.whatsapp;
  document.getElementById("userTelephone").value = user.telephone || "";
  document.getElementById("userAdresse").value = user.adresse || "";
  document.getElementById("userStatut").value = user.statut;
  document.getElementById("userNotes").value = user.notes || "";
  document.getElementById("userCNIB").value = user.cnib || "";
  document.getElementById("userCNIBDateDelivrance").value =
    user.cnibDateDelivrance || "";
  document.getElementById("userCNIBDateExpiration").value =
    user.cnibDateExpiration || "";

  // Charger les permissions
  onRoleChange();

  // Appliquer les permissions existantes
  user.permissions.forEach((permId) => {
    const checkbox = document.getElementById(`perm_${permId}`);
    if (checkbox) {
      checkbox.checked = true;
    }
  });

  document.getElementById("userModal").classList.add("show");
}

function viewUser(userId) {
  const user = users.find((u) => u.id === userId);
  if (user) {
    alert(
      `Détails de l'utilisateur:\n\nNom: ${user.prenom} ${user.nom}\nEmail: ${
        user.email
      }\nPoste: ${user.poste}\nRôle: ${getRoleLabel(user.role)}\nStatut: ${
        user.statut === "actif" ? "Actif" : "Inactif"
      }\nDate de création: ${formatDate(user.dateCreation)}`
    );
  }
}

function toggleUserStatus(userId) {
  const user = users.find((u) => u.id === userId);
  if (!user) return;

  const newStatus = user.statut === "actif" ? "inactif" : "actif";
  const action = newStatus === "actif" ? "activé" : "désactivé";

  if (
    confirm(
      `Voulez-vous vraiment ${
        newStatus === "actif" ? "activer" : "désactiver"
      } le compte de ${user.prenom} ${user.nom} ?`
    )
  ) {
    user.statut = newStatus;
    updateUsersDisplay();
    updateOverview();
    alert(`Utilisateur ${action} avec succès!`);
  }
}

// Paramètres de l'entreprise
function openSettingsModal() {
  document.getElementById("settingsName").value = companySettings.name;
  document.getElementById("settingsSector").value = companySettings.sector;
  document.getElementById("settingsAddress").value = companySettings.address;
  document.getElementById("settingsPhone").value = companySettings.phone;
  document.getElementById("settingsEmail").value = companySettings.email;
  document.getElementById("settingsWebsite").value = companySettings.website;
  document.getElementById("settingsIFU").value = companySettings.ifu;
  document.getElementById("settingsRCCM").value = companySettings.rccm;

  document.getElementById("settingsModal").classList.add("show");
}

function closeSettingsModal() {
  document.getElementById("settingsModal").classList.remove("show");
}

function saveSettings() {
  const form = document.getElementById("settingsForm");
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  companySettings = {
    name: document.getElementById("settingsName").value,
    sector: document.getElementById("settingsSector").value,
    address: document.getElementById("settingsAddress").value,
    phone: document.getElementById("settingsPhone").value,
    email: document.getElementById("settingsEmail").value,
    website: document.getElementById("settingsWebsite").value,
    ifu: document.getElementById("settingsIFU").value,
    rccm: document.getElementById("settingsRCCM").value,
  };

  updateCompanyDisplay();
  closeSettingsModal();

  alert("Paramètres enregistrés avec succès!");
}

function changeLogo() {
  alert("Fonctionnalité de changement de logo - À implémenter");
}

// Fonctions utilitaires
function getRoleLabel(role) {
  const labels = {
    "super-admin": "Super Admin",
    gestionnaire: "Gestionnaire",
    creatif: "Créatif",
    comptable: "Comptable",
    employe: "Employé",
  };
  return labels[role] || role;
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("fr-FR");
}

function filterUsers() {
  const roleFilter = document.getElementById("roleFilter").value;
  const statusFilter = document.getElementById("statusFilter").value;

  console.log(
    `Filtrage des utilisateurs - Rôle: ${roleFilter}, Statut: ${statusFilter}`
  );
  // Implémentation du filtrage
}

function showPermissionsGuide() {
  alert(
    "Guide des permissions:\n\n• CRUD: Create, Read, Update, Delete\n• CR: Create, Read\n• RU: Read, Update\n• R: Read seulement\n\nLes permissions supplémentaires permettent des ajustements granulaires au-delà du rôle de base."
  );
}

function exportActivityLog() {
  alert("Export du journal d'activité - À implémenter");
}

// Gestion de la fermeture des modaux
document.addEventListener("click", function (event) {
  const modals = ["userModal", "settingsModal"];
  modals.forEach((modalId) => {
    const modal = document.getElementById(modalId);
    if (event.target === modal) {
      modal.classList.remove("show");
    }
  });
});

document.addEventListener("keydown", function (event) {
  if (event.key === "Escape") {
    document.querySelectorAll(".modal").forEach((modal) => {
      modal.classList.remove("show");
    });
  }
});
