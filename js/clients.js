// clients.js - Gestion de la page clients

document.addEventListener("DOMContentLoaded", function () {
  initializeClientsPage();
});

function initializeClientsPage() {
  // Initialisation des filtres
  const statusFilter = document.getElementById("statusFilter");
  const typeFilter = document.getElementById("typeFilter");

  if (statusFilter) {
    statusFilter.addEventListener("change", filterClients);
  }

  if (typeFilter) {
    typeFilter.addEventListener("change", filterClients);
  }

  // Ajout des écouteurs d'événements pour les boutons d'action
  setupActionButtons();
}

function filterClients() {
  const statusValue = document.getElementById("statusFilter").value;
  const typeValue = document.getElementById("typeFilter").value;
  const rows = document.querySelectorAll("#clientsTable tbody tr");

  rows.forEach((row) => {
    let showRow = true;

    // Filtre par statut
    if (statusValue) {
      const statusBadge = row.querySelector(".status-badge");
      const isActive = statusBadge.classList.contains("status-active");
      if (
        (statusValue === "actif" && !isActive) ||
        (statusValue === "inactif" && isActive)
      ) {
        showRow = false;
      }
    }

    // Filtre par type
    if (typeValue && showRow) {
      const typeBadge = row.querySelector(".badge");
      const clientType = getClientTypeFromBadge(typeBadge);
      if (clientType !== typeValue) {
        showRow = false;
      }
    }

    row.style.display = showRow ? "" : "none";
  });
}

function getClientTypeFromBadge(badge) {
  if (badge.classList.contains("badge-particulier")) return "particulier";
  if (badge.classList.contains("badge-pme")) return "pme";
  if (badge.classList.contains("badge-sarl")) return "sarl";
  if (badge.classList.contains("badge-sa")) return "sa";
  return "";
}

function setupActionButtons() {
  // Boutons voir
  document.querySelectorAll(".btn-view").forEach((btn) => {
    btn.addEventListener("click", function () {
      const clientName = this.closest("tr").querySelector(
        ".client-details strong"
      ).textContent;
      alert(`Voir les détails de: ${clientName}`);
      // Ici vous redirigerez vers la page détaillée du client
    });
  });

  // Boutons modifier
  document.querySelectorAll(".btn-edit").forEach((btn) => {
    btn.addEventListener("click", function () {
      const clientName = this.closest("tr").querySelector(
        ".client-details strong"
      ).textContent;
      openEditClientModal(clientName);
    });
  });

  // Boutons archiver
  document.querySelectorAll(".btn-delete").forEach((btn) => {
    btn.addEventListener("click", function () {
      const clientName = this.closest("tr").querySelector(
        ".client-details strong"
      ).textContent;
      if (
        confirm(`Voulez-vous vraiment archiver le client "${clientName}" ?`)
      ) {
        archiveClient(this.closest("tr"));
      }
    });
  });
}

function openClientModal() {
  document.getElementById("modalTitle").textContent = "Nouveau Client";
  document.getElementById("clientForm").reset();
  document.getElementById("clientModal").classList.add("show");
}

function openEditClientModal(clientName) {
  document.getElementById("modalTitle").textContent = `Modifier ${clientName}`;
  // Ici vous remplirez le formulaire avec les données existantes
  document.getElementById("clientModal").classList.add("show");
}

function closeClientModal() {
  document.getElementById("clientModal").classList.remove("show");
}

function saveClient() {
  const form = document.getElementById("clientForm");
  if (form.checkValidity()) {
    // Ici vous enverrez les données au backend
    const formData = new FormData(form);
    console.log("Données du client:", Object.fromEntries(formData));

    // Simulation de sauvegarde
    setTimeout(() => {
      alert("Client enregistré avec succès!");
      closeClientModal();
      // Recharger la liste des clients ou ajouter dynamiquement
    }, 1000);
  } else {
    form.reportValidity();
  }
}

function archiveClient(row) {
  // Simulation d'archivage
  row.style.opacity = "0.5";
  row.style.backgroundColor = "#f8fafc";

  const statusBadge = row.querySelector(".status-badge");
  statusBadge.textContent = "Archivé";
  statusBadge.className = "status-badge status-inactive";

  alert("Client archivé avec succès");
}

// Fermer le modal en cliquant à l'extérieur
document.addEventListener("click", function (event) {
  const modal = document.getElementById("clientModal");
  if (event.target === modal) {
    closeClientModal();
  }
});

// Fermer le modal avec la touche Échap
document.addEventListener("keydown", function (event) {
  if (event.key === "Escape") {
    closeClientModal();
  }
});

// Ajoutez ces fonctions au fichier clients.js existant

function addSocialPage() {
    const container = document.querySelector('.social-pages-container');
    const newInput = document.createElement('div');
    newInput.className = 'social-page-input';
    newInput.innerHTML = `
        <select class="social-platform">
            <option value="">Plateforme</option>
            <option value="facebook">Facebook</option>
            <option value="tiktok">TikTok</option>
            <option value="instagram">Instagram</option>
            <option value="linkedin">LinkedIn</option>
            <option value="youtube">YouTube</option>
        </select>
        <input type="url" class="social-url" placeholder="URL de la page">
        <button type="button" class="btn-icon btn-remove-social" onclick="removeSocialPage(this)">
            <i class="fas fa-times"></i>
        </button>
    `;
    container.appendChild(newInput);
}

function removeSocialPage(button) {
    const container = document.querySelector('.social-pages-container');
    if (container.children.length > 1) {
        button.parentElement.remove();
    } else {
        // Réinitialiser le premier champ au lieu de le supprimer
        const firstInput = container.firstElementChild;
        firstInput.querySelector('.social-platform').value = '';
        firstInput.querySelector('.social-url').value = '';
    }
}

function getSocialPagesData() {
    const pages = [];
    document.querySelectorAll('.social-page-input').forEach(input => {
        const platform = input.querySelector('.social-platform').value;
        const url = input.querySelector('.social-url').value;
        if (platform && url) {
            pages.push({ platform, url });
        }
    });
    return pages;
}

function setSocialPagesData(pages) {
    const container = document.querySelector('.social-pages-container');
    container.innerHTML = '';
    
    if (pages.length === 0) {
        addSocialPage(); // Ajouter un champ vide
    } else {
        pages.forEach(page => {
            addSocialPage();
            const lastInput = container.lastElementChild;
            lastInput.querySelector('.social-platform').value = page.platform;
            lastInput.querySelector('.social-url').value = page.url;
        });
    }
}

// Mettez à jour la fonction saveClient pour inclure tous les champs
function saveClient() {
    const form = document.getElementById('clientForm');
    if (form.checkValidity()) {
        const clientData = {
            nom: document.getElementById('clientNom').value,
            prenom: document.getElementById('clientPrenom').value,
            entreprise: document.getElementById('clientEntreprise').value,
            whatsapp: document.getElementById('clientWhatsApp').value,
            telephone2: document.getElementById('clientTelephone').value,
            email: document.getElementById('clientEmail').value,
            adresse: document.getElementById('clientAdresse').value,
            secteur: document.getElementById('clientSecteur').value,
            type: document.getElementById('clientType').value,
            rccm: document.getElementById('clientRCCM').value,
            ifu: document.getElementById('clientIFU').value,
            statut: document.getElementById('clientStatut').value,
            pagesSociales: getSocialPagesData(),
            notes: document.getElementById('clientNotes').value,
            dateInscription: new Date().toISOString().split('T')[0]
        };

        console.log('Données complètes du client:', clientData);
        
        // Simulation de sauvegarde
        setTimeout(() => {
            alert('Client enregistré avec succès!');
            closeClientModal();
            // Ajouter le client à la liste ou recharger
            addClientToTable(clientData);
        }, 1000);
    } else {
        form.reportValidity();
    }
}

// Fonction pour ajouter dynamiquement un client au tableau
function addClientToTable(clientData) {
    const tbody = document.querySelector('#clientsTable tbody');
    const newRow = document.createElement('tr');
    
    const avatarText = (clientData.nom.charAt(0) + clientData.prenom.charAt(0)).toUpperCase();
    const badgeClass = `badge-${clientData.type}`;
    const statusClass = clientData.statut === 'actif' ? 'status-active' : 'status-inactive';
    const statusText = clientData.statut === 'actif' ? 'Actif' : 'Inactif';
    
    newRow.innerHTML = `
        <td>
            <div class="client-info">
                <div class="client-avatar">${avatarText}</div>
                <div class="client-details">
                    <strong>${clientData.entreprise || clientData.nom + ' ' + clientData.prenom}</strong>
                    <span>${clientData.prenom} ${clientData.nom}</span>
                </div>
            </div>
        </td>
        <td>${clientData.entreprise || '-'}</td>
        <td>${clientData.whatsapp}</td>
        <td>${clientData.email || '-'}</td>
        <td><span class="badge ${badgeClass}">${clientData.type.toUpperCase()}</span></td>
        <td>0</td>
        <td><span class="status-badge ${statusClass}">${statusText}</span></td>
        <td>
            <div class="action-buttons">
                <button class="btn-icon btn-view" title="Voir">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="btn-icon btn-edit" title="Modifier">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn-icon btn-delete" title="Archiver">
                    <i class="fas fa-archive"></i>
                </button>
            </div>
        </td>
    `;
    
    tbody.insertBefore(newRow, tbody.firstChild);
    setupActionButtons(); // Réinitialiser les écouteurs d'événements
}
