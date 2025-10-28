// services.js - Gestion de la page des services

let currentServices = [];
let editingServiceId = null;

document.addEventListener("DOMContentLoaded", function () {
  initializeServicesPage();
});

function initializeServicesPage() {
  // Initialisation de la recherche
  const searchInput = document.getElementById("serviceSearch");
  if (searchInput) {
    searchInput.addEventListener("input", filterServices);
  }

  // Initialisation du filtre par type
  const typeFilter = document.getElementById("typeFilter");
  if (typeFilter) {
    typeFilter.addEventListener("change", filterServices);
  }

  // Chargement initial des services
  loadServices();
}

function loadServices() {
  // Services de démonstration
  currentServices = [
    {
      id: 1,
      nom: "Gestion de Campagnes Publicitaires",
      description:
        "Création et gestion complète de campagnes sur les réseaux sociaux avec optimisation et reporting.",
      prix: 150000,
      duree: 30,
      type: "diffusion",
      formulaire: "1"
    },
    {
      id: 2,
      nom: "Création Graphique",
      description:
        "Conception d'affiches, bannières et visuels pour vos campagnes marketing et réseaux sociaux.",
      prix: 75000,
      duree: 7,
      type: "graphique",
      formulaire: "2"
    },
    {
      id: 3,
      nom: "Production Vidéo",
      description:
        "Création de contenu vidéo pour TikTok, Instagram Reels et YouTube Shorts.",
      prix: 200000,
      duree: 15,
      type: "video",
      formulaire: "3"
    },
  ];

  updateServicesDisplay();
}

function filterServices() {
  const searchTerm = document
    .getElementById("serviceSearch")
    .value.toLowerCase();
  const typeFilter = document.getElementById("typeFilter").value;

  const serviceCards = document.querySelectorAll(
    ".service-card:not(.add-service-card)"
  );

  serviceCards.forEach((card) => {
    const title = card
      .querySelector(".service-title")
      .textContent.toLowerCase();
    const description = card
      .querySelector(".service-description")
      .textContent.toLowerCase();
    const serviceType = card.getAttribute("data-type");

    const matchesSearch =
      title.includes(searchTerm) || description.includes(searchTerm);
    const matchesType = !typeFilter || serviceType === typeFilter;

    if (matchesSearch && matchesType) {
      card.style.display = "block";
      setTimeout(() => {
        card.style.opacity = "1";
        card.style.transform = "translateY(0)";
      }, 50);
    } else {
      card.style.opacity = "0";
      card.style.transform = "translateY(20px)";
      setTimeout(() => {
        card.style.display = "none";
      }, 300);
    }
  });
}

function toggleSpecialFields() {
  const serviceType = document.getElementById("serviceType").value;

  // Masquer tous les champs spéciaux
  document.querySelectorAll(".special-fields").forEach((field) => {
    field.style.display = "none";
  });

  // Afficher les champs spécifiques au type sélectionné
  if (serviceType === "diffusion") {
    document.getElementById("diffusionFields").style.display = "block";
  } else if (serviceType === "graphique") {
    document.getElementById("graphiqueFields").style.display = "block";
  } else if (serviceType === "video") {
    document.getElementById("videoFields").style.display = "block";
  }
}

function openServiceModal() {
  editingServiceId = null;
  document.getElementById("serviceModalTitle").textContent = "Nouveau Service";
  document.getElementById("serviceForm").reset();
  toggleSpecialFields(); // Initialiser l'affichage des champs spéciaux
  document.getElementById("serviceModal").classList.add("show");
}

function openEditServiceModal(serviceId) {
  const service = currentServices.find((s) => s.id === serviceId);
  if (!service) return;

  editingServiceId = serviceId;
  document.getElementById(
    "serviceModalTitle"
  ).textContent = `Modifier ${service.nom}`;

  // Remplir le formulaire avec les données existantes
  document.getElementById("serviceNom").value = service.nom;
  document.getElementById("serviceType").value = service.type;
  document.getElementById("servicePrix").value = service.prix;
  document.getElementById("serviceDuree").value = service.duree;
  document.getElementById("serviceFormulaire").value = service.formulaire || "";
  document.getElementById("serviceDescription").value = service.description;

  toggleSpecialFields(); // Afficher les champs spéciaux selon le type
  document.getElementById("serviceModal").classList.add("show");
}

function closeServiceModal() {
  document.getElementById("serviceModal").classList.remove("show");
  editingServiceId = null;
}

function saveService() {
  const form = document.getElementById("serviceForm");
  if (form.checkValidity()) {
    const serviceData = {
      nom: document.getElementById("serviceNom").value,
      type: document.getElementById("serviceType").value,
      prix: parseInt(document.getElementById("servicePrix").value),
      duree: parseInt(document.getElementById("serviceDuree").value),
      description: document.getElementById("serviceDescription").value,
      formulaire: document.getElementById("serviceFormulaire").value
    };

    if (editingServiceId) {
      // Modification
      updateService(editingServiceId, serviceData);
    } else {
      // Nouveau service
      createService(serviceData);
    }
  } else {
    form.reportValidity();
  }
}



function createService(serviceData) {
  const newService = {
    id: Date.now(), // ID temporaire
    ...serviceData,
  };

  currentServices.push(newService);

  // Simulation de sauvegarde
  setTimeout(() => {
    alert("Service créé avec succès!");
    closeServiceModal();
    addServiceToGrid(newService);
  }, 1000);
}

function updateService(serviceId, serviceData) {
  const serviceIndex = currentServices.findIndex((s) => s.id === serviceId);
  if (serviceIndex !== -1) {
    currentServices[serviceIndex] = {
      ...currentServices[serviceIndex],
      ...serviceData,
    };

    // Simulation de sauvegarde
    setTimeout(() => {
      alert("Service modifié avec succès!");
      closeServiceModal();
      updateServiceInGrid(serviceId, currentServices[serviceIndex]);
    }, 1000);
  }
}

function addServiceToGrid(service) {
  const servicesGrid = document.querySelector(".services-grid");
  const addServiceCard = document.querySelector(".add-service-card");

  const newServiceCard = createServiceCard(service);
  servicesGrid.insertBefore(newServiceCard, addServiceCard);
}

function updateServiceInGrid(serviceId, service) {
  const existingCard = document.querySelector(
    `.service-card[data-service-id="${serviceId}"]`
  );
  if (existingCard) {
    existingCard.remove();
  }

  const servicesGrid = document.querySelector(".services-grid");
  const addServiceCard = document.querySelector(".add-service-card");
  const newServiceCard = createServiceCard(service);

  servicesGrid.insertBefore(newServiceCard, addServiceCard);
}

function createServiceCard(service) {
  const serviceCard = document.createElement("div");
  serviceCard.className = "service-card";
  serviceCard.setAttribute("data-type", service.type);
  serviceCard.setAttribute("data-service-id", service.id);

  const badgeClass = `badge-${service.type}`;
  const iconClass = service.type;

  serviceCard.innerHTML = `
    <div class="service-header">
      <div class="service-icon ${iconClass}">
        <i class="fas ${getServiceIcon(service.type)}"></i>
      </div>
      <div class="service-actions">
        <button class="btn-icon btn-edit" onclick="openEditServiceModal(${
          service.id
        })">
          <i class="fas fa-edit"></i>
        </button>
        <button class="btn-icon btn-delete" onclick="deleteService(${
          service.id
        })">
          <i class="fas fa-trash"></i>
        </button>
      </div>
    </div>
    <div class="service-badge ${badgeClass}">${getServiceTypeLabel(
    service.type
  )}</div>
    <h3 class="service-title">${service.nom}</h3>
    <p class="service-description">${service.description}</p>
    <div class="service-details">
      <div class="service-detail">
        <span class="detail-label">Prix:</span>
        <span class="detail-value">${service.prix.toLocaleString()} FCFA</span>
      </div>
      <div class="service-detail">
        <span class="detail-label">Durée:</span>
        <span class="detail-value">${service.duree} jours</span>
      </div>
      <div class="service-detail">
        <span class="detail-label">Type:</span>
        <span class="detail-value">${getServiceTypeLabel(service.type)}</span>
      </div>
    </div>
    
    <div class="service-footer">
      <button class="btn btn-outline" onclick="viewServiceForm(${service.id})">
        <i class="fas fa-eye"></i>
        Voir Formulaire
      </button>
      <button class="btn btn-primary" onclick="assignService(${service.id})">
        <i class="fas fa-project-diagram"></i>
        Utiliser
      </button>
    </div>
  `;

  return serviceCard;
}

function getServiceIcon(serviceType) {
  const icons = {
    diffusion: "fa-bullhorn",
    graphique: "fa-palette",
    video: "fa-video",
    standard: "fa-concierge-bell",
    gestion: "fa-cogs",
  };
  return icons[serviceType] || icons.standard;
}

function getServiceTypeLabel(serviceType) {
  const labels = {
    diffusion: "Diffusion",
    graphique: "Graphique",
    video: "Vidéo",
    standard: "Standard",
    gestion: "Gestion de page",
  };
  return labels[serviceType] || serviceType;
}

function deleteService(serviceId) {
  const service = currentServices.find((s) => s.id === serviceId);
  if (!service) return;

  if (confirm(`Voulez-vous vraiment supprimer le service "${service.nom}" ?`)) {
    const serviceCard = document.querySelector(
      `.service-card[data-service-id="${serviceId}"]`
    );
    if (serviceCard) {
      serviceCard.style.opacity = "0";
      serviceCard.style.transform = "translateY(20px)";
      setTimeout(() => {
        serviceCard.remove();
        currentServices = currentServices.filter((s) => s.id !== serviceId);
        alert("Service supprimé avec succès");
      }, 300);
    }
  }
}

function viewServiceForm(serviceId) {
  const service = currentServices.find((s) => s.id === serviceId);
  if (service) {
    alert(`Voir le formulaire pour: ${service.nom}`);
    // Redirection vers la page de gestion des formulaires
    // window.location.href = `form-builder.html?service=${encodeURIComponent(service.nom)}`;
  }
}

function assignService(serviceId) {
  const service = currentServices.find((s) => s.id === serviceId);
  if (service) {
    alert(
      `Utiliser le service: ${service.nom}\nRedirection vers la création de projet...`
    );
    // window.location.href = `projets.html?service=${encodeURIComponent(service.nom)}`;
  }
}

function updateServicesDisplay() {
  const servicesGrid = document.querySelector(".services-grid");
  const addServiceCard = document.querySelector(".add-service-card");

  // Supprimer toutes les cartes de service existantes (sauf la carte d'ajout)
  document
    .querySelectorAll(".service-card:not(.add-service-card)")
    .forEach((card) => card.remove());

  // Ajouter les services
  currentServices.forEach((service) => {
    const serviceCard = createServiceCard(service);
    servicesGrid.insertBefore(serviceCard, addServiceCard);
  });
}

// Fermer le modal en cliquant à l'extérieur
document.addEventListener("click", function (event) {
  const modal = document.getElementById("serviceModal");
  if (event.target === modal) {
    closeServiceModal();
  }
});

// Fermer le modal avec la touche Échap
document.addEventListener("keydown", function (event) {
  if (event.key === "Escape") {
    closeServiceModal();
  }
});
