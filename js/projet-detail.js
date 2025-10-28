// projet-detail.js - Gestion de la page détail de la demande client

let currentProject = null;
let currentServices = [];
let currentTasks = [];
let editingServiceId = null;

document.addEventListener("DOMContentLoaded", function () {
  initializeProjectDetail();
});

function initializeProjectDetail() {
  console.log("Initialisation de la page détail de la demande client...");

  // Chargement des données du projet
  loadProjectData();

  // Initialisation des interactions
  initializeInteractions();
}

function loadProjectData() {
  // Simulation du chargement des données
  currentProject = {
    id: 1,
    title: "Campagne Facebook Automne 2024",
    client: "Bella Mode SARL",
    clientContact: "Sophie Kaboré",
    reference: "AD-2024-001",
    createdDate: "2024-10-15",
    status: "en-cours",
    priority: "haute",
    clientNeeds: {
      objectif:
        "Augmenter la visibilité de la nouvelle collection Automne-Hiver",
      publicCible: "Femmes 25-45 ans, intéressées par la mode",
      budget: "200,000 FCFA",
      delai: "4 semaines",
      specifications: "Création de visuels pour Facebook et Instagram",
    },
    documents: [{ name: "charte-graphique.pdf", size: "2.1 MB", type: "pdf" }],
    financial: {
      total: 0,
      paid: 0,
      remaining: 0,
      status: "non-paye",
    },
  };

  // Services initiaux
  currentServices = [
    {
      id: 1,
      serviceId: 1,
      name: "Gestion de Campagnes Publicitaires",
      price: 150000,
      duration: 30,
      assignee: "Marie Kaboré",
      notes: "Campagne Facebook et Instagram",
      originalPrice: 150000,
    },
  ];

  updateProjectDisplay();
  updateServicesDisplay();
  updateFinancialSummary();
  generateTasks();
}

function initializeInteractions() {
  // Gestion des cases à cocher des tâches
  document.addEventListener("change", function (e) {
    if (e.target.matches('.task-checkbox input[type="checkbox"]')) {
      updateTaskStatus(e.target);
    }
  });

  console.log("Interactions initialisées");
}

function updateProjectDisplay() {
  if (!currentProject) return;

  // Mettre à jour l'en-tête
  document.getElementById(
    "projectTitle"
  ).textContent = `Demande Client - ${currentProject.client}`;
  document.getElementById("clientName").textContent = currentProject.client;
  document.getElementById("projectDate").textContent = `Créé le ${formatDate(
    currentProject.createdDate
  )}`;
  document.getElementById("projectRef").textContent = currentProject.reference;

  // Statut et priorité
  document.getElementById("projectStatus").textContent = getStatusText(
    currentProject.status
  );
  document.getElementById(
    "projectStatus"
  ).className = `status-badge status-${currentProject.status}`;
  document.getElementById("projectPriority").textContent = getPriorityText(
    currentProject.priority
  );
  document.getElementById(
    "projectPriority"
  ).className = `priority-badge priority-${currentProject.priority}`;

  // Afficher les besoins du client
  displayClientNeeds();
}

function displayClientNeeds() {
  const needsContainer = document.getElementById("clientNeedsDisplay");
  if (!currentProject.clientNeeds) return;

  let html = "";
  for (const [key, value] of Object.entries(currentProject.clientNeeds)) {
    const label = getNeedLabel(key);
    html += `
      <div class="form-data-item">
        <label>${label}:</label>
        <span>${value}</span>
      </div>
    `;
  }
  needsContainer.innerHTML = html;
}

function getNeedLabel(key) {
  const labels = {
    objectif: "Objectif",
    publicCible: "Public cible",
    budget: "Budget estimé",
    delai: "Délai souhaité",
    specifications: "Spécifications",
  };
  return labels[key] || key;
}

function updateServicesDisplay() {
  const servicesList = document.getElementById("servicesList");
  servicesList.innerHTML = "";

  currentServices.forEach((service) => {
    const serviceElement = createServiceElement(service);
    servicesList.appendChild(serviceElement);
  });

  updateFinancialSummary();
}

function createServiceElement(service) {
  const serviceElement = document.createElement("div");
  serviceElement.className = "service-item-detailed";
  serviceElement.setAttribute("data-service-id", service.id);

  const priceChanged = service.price !== service.originalPrice;
  const priceClass = priceChanged ? "price-changed" : "";

  serviceElement.innerHTML = `
    <div class="service-info">
      <div class="service-icon">
        <i class="fas ${getServiceIcon(service.name)}"></i>
      </div>
      <div class="service-details">
        <h4>${service.name}</h4>
        <p>${service.notes || "Aucune note"}</p>
        <div class="service-meta">
          <span class="service-price ${priceClass}">
            ${service.price.toLocaleString()} FCFA
            ${
              priceChanged
                ? `<small>(original: ${service.originalPrice.toLocaleString()} FCFA)</small>`
                : ""
            }
          </span>
          <span class="service-duration">${service.duration} jours</span>
          <span class="service-assigned">
            <i class="fas fa-user"></i>
            ${service.assignee}
          </span>
        </div>
      </div>
    </div>
    <div class="service-actions">
      <button class="btn-icon btn-edit" onclick="openEditServiceModal(${
        service.id
      })" title="Modifier">
        <i class="fas fa-edit"></i>
      </button>
      <button class="btn-icon btn-delete" onclick="removeService(${
        service.id
      })" title="Supprimer">
        <i class="fas fa-trash"></i>
      </button>
    </div>
  `;

  return serviceElement;
}

function getServiceIcon(serviceName) {
  const icons = {
    "Gestion de Campagnes Publicitaires": "fa-bullhorn",
    "Création Graphique": "fa-palette",
    "Production Vidéo": "fa-video",
  };
  return icons[serviceName] || "fa-concierge-bell";
}

function updateFinancialSummary() {
  const totalHT = currentServices.reduce(
    (sum, service) => sum + service.price,
    0
  );
  const totalTVA = totalHT * 0.18; // 18% de TVA
  const totalTTC = totalHT + totalTVA;

  document.getElementById(
    "totalHT"
  ).textContent = `${totalHT.toLocaleString()} FCFA`;
  document.getElementById("totalTVA").textContent = `${Math.round(
    totalTVA
  ).toLocaleString()} FCFA`;
  document.getElementById("totalTTC").textContent = `${Math.round(
    totalTTC
  ).toLocaleString()} FCFA`;

  // Mettre à jour les informations financières principales
  document.getElementById("financialTotal").textContent = `${Math.round(
    totalTTC
  ).toLocaleString()} FCFA`;
  document.getElementById("financialRemaining").textContent = `${Math.round(
    totalTTC - currentProject.financial.paid
  ).toLocaleString()} FCFA`;

  // Mettre à jour le projet
  currentProject.financial.total = totalTTC;
  currentProject.financial.remaining = totalTTC - currentProject.financial.paid;
}

function generateTasks() {
  currentTasks = [];

  currentServices.forEach((service) => {
    const task = {
      id: Date.now() + Math.random(),
      title: service.name,
      serviceId: service.id,
      assignee: service.assignee,
      dueDate: new Date(Date.now() + service.duration * 24 * 60 * 60 * 1000),
      status: "a-faire",
      description: service.notes || `Tâche pour le service: ${service.name}`,
    };
    currentTasks.push(task);
  });

  updateTasksDisplay();
}

function updateTasksDisplay() {
  const tasksList = document.getElementById("tasksList");
  const completedTasks = currentTasks.filter(
    (task) => task.status === "terminee"
  ).length;
  const totalTasks = currentTasks.length;

  document.getElementById("completedTasks").textContent = completedTasks;
  document.getElementById("totalTasks").textContent = totalTasks;

  tasksList.innerHTML = "";

  currentTasks.forEach((task) => {
    const taskElement = createTaskElement(task);
    tasksList.appendChild(taskElement);
  });
}

function createTaskElement(task) {
  const taskElement = document.createElement("div");
  taskElement.className = "task-item";
  taskElement.setAttribute("data-task-id", task.id);

  const isCompleted = task.status === "terminee";

  taskElement.innerHTML = `
    <div class="task-checkbox">
      <input type="checkbox" id="task-${task.id}" ${
    isCompleted ? "checked" : ""
  }>
      <label for="task-${task.id}"></label>
    </div>
    <div class="task-content">
      <h4 class="task-title">${task.title}</h4>
      <p class="task-description">${task.description}</p>
      <div class="task-meta">
        <span class="task-assignee">
          <i class="fas fa-user"></i>
          ${task.assignee}
        </span>
        <span class="task-deadline">
          <i class="fas fa-clock"></i>
          Échéance: ${formatDate(task.dueDate)}
        </span>
        <span class="task-status ${task.status}">${getTaskStatusText(
    task.status
  )}</span>
      </div>
    </div>
  `;

  return taskElement;
}

function updateTaskStatus(checkbox) {
  const taskId = checkbox.closest(".task-item").getAttribute("data-task-id");
  const task = currentTasks.find((t) => t.id == taskId);

  if (task) {
    task.status = checkbox.checked ? "terminee" : "a-faire";
    updateTasksDisplay();
  }
}

// Fonctions modales
function openAddServiceModal() {
  document.getElementById("addServiceForm").reset();
  document.getElementById("addServiceModal").classList.add("show");
}

function closeAddServiceModal() {
  document.getElementById("addServiceModal").classList.remove("show");
}

function onServiceChange() {
  const serviceSelect = document.getElementById("serviceSelect");
  const selectedOption = serviceSelect.options[serviceSelect.selectedIndex];

  if (selectedOption.value) {
    document.getElementById("servicePrice").value =
      selectedOption.getAttribute("data-price");
    document.getElementById("serviceDuration").value =
      selectedOption.getAttribute("data-duration");
  }
}

function addServiceToProject() {
  const form = document.getElementById("addServiceForm");
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  const serviceSelect = document.getElementById("serviceSelect");
  const selectedOption = serviceSelect.options[serviceSelect.selectedIndex];

  const newService = {
    id: Date.now(),
    serviceId: serviceSelect.value,
    name: selectedOption.text,
    price: parseInt(document.getElementById("servicePrice").value),
    duration: parseInt(document.getElementById("serviceDuration").value),
    assignee: document.getElementById("serviceAssignee").value,
    notes: document.getElementById("serviceNotes").value,
    originalPrice: parseInt(selectedOption.getAttribute("data-price")),
  };

  currentServices.push(newService);

  updateServicesDisplay();
  generateTasks();
  closeAddServiceModal();

  alert("Service ajouté avec succès!");
}

function openEditServiceModal(serviceId) {
  const service = currentServices.find((s) => s.id === serviceId);
  if (!service) return;

  editingServiceId = serviceId;

  document.getElementById("editServiceId").value = service.id;
  document.getElementById("editServicePrice").value = service.price;
  document.getElementById("editServiceDuration").value = service.duration;
  document.getElementById("editServiceAssignee").value = service.assignee;
  document.getElementById("editServiceNotes").value = service.notes || "";

  document.getElementById("editServiceModal").classList.add("show");
}

function closeEditServiceModal() {
  document.getElementById("editServiceModal").classList.remove("show");
  editingServiceId = null;
}

function updateService() {
  const serviceId = document.getElementById("editServiceId").value;
  const service = currentServices.find((s) => s.id == serviceId);

  if (service) {
    service.price = parseInt(document.getElementById("editServicePrice").value);
    service.duration = parseInt(
      document.getElementById("editServiceDuration").value
    );
    service.assignee = document.getElementById("editServiceAssignee").value;
    service.notes = document.getElementById("editServiceNotes").value;

    updateServicesDisplay();
    updateTasksForService(service);
    closeEditServiceModal();

    alert("Service modifié avec succès!");
  }
}

function updateTasksForService(service) {
  currentTasks.forEach((task) => {
    if (task.serviceId === service.id) {
      task.assignee = service.assignee;
      task.dueDate = new Date(
        Date.now() + service.duration * 24 * 60 * 60 * 1000
      );
    }
  });
  updateTasksDisplay();
}

function removeService(serviceId) {
  const service = currentServices.find((s) => s.id === serviceId);
  if (!service) return;

  if (
    confirm(`Voulez-vous vraiment supprimer le service "${service.name}" ?`)
  ) {
    currentServices = currentServices.filter((s) => s.id !== serviceId);
    currentTasks = currentTasks.filter((t) => t.serviceId !== serviceId);

    updateServicesDisplay();
    updateTasksDisplay();

    alert("Service supprimé avec succès!");
  }
}

// Fonctions utilitaires
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("fr-FR");
}

function getStatusText(status) {
  const statusMap = {
    brouillon: "Brouillon",
    "en-attente": "En Attente",
    "en-cours": "En Cours",
    termine: "Terminé",
    annule: "Annulé",
  };
  return statusMap[status] || status;
}

function getPriorityText(priority) {
  const priorityMap = {
    basse: "Basse Priorité",
    moyenne: "Moyenne Priorité",
    haute: "Haute Priorité",
    urgente: "Urgent",
  };
  return priorityMap[priority] || priority;
}

function getTaskStatusText(status) {
  const statusMap = {
    "a-faire": "À faire",
    "en-cours": "En cours",
    terminee: "Terminée",
  };
  return statusMap[status] || status;
}

// Fonctions d'action
function editProject() {
  alert("Modification du projet - À implémenter");
}

function sendMessage() {
  alert("Envoi de message au client - À implémenter");
}

function editClientNeeds() {
  alert("Modification des besoins client - À implémenter");
}

function recordPayment() {
  alert("Enregistrement de paiement - À implémenter");
}

function generateInvoice() {
  alert("Génération de facture - À implémenter");
}

function downloadDocument(filename) {
  alert(`Téléchargement de ${filename} - À implémenter`);
}

// Gestion de la fermeture des modaux
document.addEventListener("click", function (event) {
  const modals = document.querySelectorAll(".modal");
  modals.forEach((modal) => {
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
