// projets.js - Gestion des demandes clients

let selectedServices = new Set();

document.addEventListener("DOMContentLoaded", function () {
  initializeProjetsPage();
});

function initializeProjetsPage() {
  console.log("Initialisation de la page demandes clients...");

  // Initialisation des filtres
  const statusFilter = document.getElementById("statusFilter");
  const clientFilter = document.getElementById("clientFilter");

  if (statusFilter) {
    statusFilter.addEventListener("change", filterDemandes);
  }

  if (clientFilter) {
    clientFilter.addEventListener("change", filterDemandes);
  }

  console.log("Page demandes initialisée");
}

function filterDemandes() {
  const statusValue = document.getElementById("statusFilter").value;
  const clientValue = document.getElementById("clientFilter").value;
  const cards = document.querySelectorAll(
    ".demande-card:not(.new-demande-card)"
  );

  cards.forEach((card) => {
    let showCard = true;

    // Filtre par statut
    if (statusValue) {
      const statusBadge = card.querySelector(".status-badge");
      const statusClass = statusBadge.classList[1]; // status-en-cours, status-attente, etc.
      const statusMap = {
        brouillon: "status-brouillon",
        "attente-formulaire": "status-attente",
        "en-cours": "status-en-cours",
        termine: "status-termine",
        livre: "status-livre",
      };

      if (statusClass !== statusMap[statusValue]) {
        showCard = false;
      }
    }

    // Filtre par client
    if (clientValue && showCard) {
      const clientName = card.querySelector(".client-info strong").textContent;
      // Logique de filtrage par client à implémenter
    }

    card.style.display = showCard ? "block" : "none";
  });
}

function openNewDemandeModal() {
  console.log("Ouverture du modal nouvelle demande");
  selectedServices.clear();
  document.getElementById("newDemandeForm").reset();
  document.getElementById("newDemandeModal").classList.add("show");

  // Réinitialiser la sélection des services
  document.querySelectorAll(".service-option").forEach((option) => {
    option.classList.remove("selected");
  });
}

function closeNewDemandeModal() {
  console.log("Fermeture du modal nouvelle demande");
  document.getElementById("newDemandeModal").classList.remove("show");
}

function loadClientInfo() {
  const clientId = document.getElementById("demandeClient").value;
  if (clientId === "new") {
    // Ouvrir le modal de création de client
    alert("Création d'un nouveau client - À implémenter");
  }
}

function toggleService(optionElement, serviceId) {
  optionElement.classList.toggle("selected");

  if (optionElement.classList.contains("selected")) {
    selectedServices.add(serviceId);
  } else {
    selectedServices.delete(serviceId);
  }

  console.log("Services sélectionnés:", Array.from(selectedServices));
}

function createNewDemande() {
  const form = document.getElementById("newDemandeForm");
  if (form.checkValidity()) {
    if (selectedServices.size === 0) {
      alert("Veuillez sélectionner au moins un service.");
      return;
    }

    const demandeData = {
      client: document.getElementById("demandeClient").value,
      titre: document.getElementById("demandeTitre").value,
      description: document.getElementById("demandeDescription").value,
      services: Array.from(selectedServices),
      echeance: document.getElementById("demandeEcheance").value,
      priorite: document.getElementById("demandePriorite").value,
    };

    console.log("Nouvelle demande:", demandeData);

    // Simulation de création
    setTimeout(() => {
      alert("Demande créée avec succès! Envoi du formulaire au client...");
      closeNewDemandeModal();
      addDemandeToGrid(demandeData);

      // Envoyer les liens de formulaire
      sendFormLinks(demandeData);
    }, 1000);
  } else {
    form.reportValidity();
  }
}

function sendFormLinks(demandeData) {
  console.log("Envoi des liens de formulaire pour:", demandeData);

  // Pour chaque service sélectionné, envoyer le formulaire correspondant
  demandeData.services.forEach((serviceId) => {
    const formLink = generateFormLink(serviceId, demandeData.client);
    console.log(`Lien formulaire ${serviceId}: ${formLink}`);

    // Ici, vous enverriez le lien par WhatsApp/email
    // sendWhatsAppMessage(demandeData.client, formLink);
  });

  alert("Liens de formulaire envoyés au client!");
}

function generateFormLink(serviceId, clientId) {
  // Générer un lien unique pour le formulaire
  const baseUrl = window.location.origin;
  return `${baseUrl}/form-client.html?service=${serviceId}&client=${clientId}&demande=${Date.now()}`;
}

function addDemandeToGrid(demandeData) {
  console.log("Ajout de la demande à la grille:", demandeData);
  // Implémentation de l'ajout dynamique d'une carte demande
  // Similaire à l'exemple dans le HTML
}

// Fonctions d'action
function viewDemandeDetails(demandeId) {
  console.log(`Voir détails de la demande: ${demandeId}`);
  window.location.href = `projet-detail.html?id=${demandeId}`;
}

function sendFormLink(demandeId) {
  console.log(`Renvoyer formulaire pour demande: ${demandeId}`);

  // Récupérer les services de la demande
  const services = getDemandeServices(demandeId);

  services.forEach((service) => {
    const formLink = generateFormLink(service.id, demandeId);
    console.log(`Renvoi lien ${service.id}: ${formLink}`);
  });

  alert("Lien(s) de formulaire renvoyé(s) au client!");
}

function getDemandeServices(demandeId) {
  // Simulation - en réalité, vous récupéreriez depuis l'API
  return [
    { id: "campagnes", name: "Gestion de Campagnes" },
    { id: "graphique", name: "Crédation Graphique" },
  ];
}

function generateInvoice(demandeId) {
  console.log(`Génération facture pour demande: ${demandeId}`);
  alert(`Génération de facture pour la demande ${demandeId} - À implémenter`);
}

// Fermer le modal en cliquant à l'extérieur
document.addEventListener("click", function (event) {
  const modal = document.getElementById("newDemandeModal");
  if (event.target === modal) {
    closeNewDemandeModal();
  }
});

// Fermer le modal avec la touche Échap
document.addEventListener("keydown", function (event) {
  if (event.key === "Escape") {
    closeNewDemandeModal();
  }
});
