// taches.js - Gestion des tâches

let currentTasks = [];
let currentView = "table";
let currentEmployeeFilter = "";
let currentTaskId = null;

document.addEventListener("DOMContentLoaded", function () {
  initializeTasksPage();
});

function initializeTasksPage() {
  console.log("Initialisation de la page des tâches...");

  // Charger les tâches
  loadTasks();

  // Initialiser les filtres
  initializeFilters();

  // Initialiser les écouteurs d'événements
  initializeEventListeners();

  // Charger la liste des employés pour le filtre
  loadEmployees();
}

function loadTasks() {
  // Simulation de chargement des tâches depuis l'API
  const sampleTasks = [
    {
      id: 1,
      title: "Création affiche campagne Facebook",
      project: "Campagne Automne 2024",
      service: "Création Graphique",
      employee: "Marie Kaboré",
      dueDate: "2024-12-15",
      priority: "haute",
      status: "en-cours",
      delayed: false,
      description:
        "Création d'une affiche pour la campagne Facebook de promotion des nouveaux produits.",
      deliverables: [],
    },
    {
      id: 2,
      title: "Setup campagne TikTok",
      project: "Stratégie Jeunesse",
      service: "Diffusion Publicitaire",
      employee: "Jean Traoré",
      dueDate: "2024-12-10",
      priority: "urgente",
      status: "a-faire",
      delayed: true,
      description:
        "Configuration et lancement de la campagne TikTok pour cibler le public jeune.",
      diffusionData: {
        budget: 50000,
        duration: 30,
        startDate: "2024-12-01",
        platform: "tiktok",
      },
      deliverables: [],
    },
    {
      id: 3,
      title: "Refonte logo entreprise",
      project: "Image de Marque",
      service: "Design Logo",
      employee: "Sophie Ouédraogo",
      dueDate: "2024-12-20",
      priority: "moyenne",
      status: "terminee",
      delayed: false,
      description: "Refonte complète du logo avec nouvelle charte graphique.",
      deliverables: [
        { name: "logo-final.psd", type: "psd", size: "2.4 MB" },
        { name: "logo-preview.png", type: "png", size: "156 KB" },
      ],
    },
  ];

  currentTasks = sampleTasks;
  updateTasksDisplay();
  updateStats();
}

function initializeFilters() {
  const statusFilter = document.getElementById("statusFilter");
  const priorityFilter = document.getElementById("priorityFilter");
  const employeeFilter = document.getElementById("employeeFilter");

  if (statusFilter) {
    statusFilter.addEventListener("change", filterTasks);
  }

  if (priorityFilter) {
    priorityFilter.addEventListener("change", filterTasks);
  }

  if (employeeFilter) {
    employeeFilter.addEventListener("change", filterTasks);
  }
}

function initializeEventListeners() {
  // Boutons de changement de vue
  document.querySelectorAll(".view-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      switchView(this.getAttribute("data-view"));
    });
  });

  // Gestion du drag and drop pour Kanban
  initializeKanbanDragDrop();

  // Gestion de l'upload de fichiers
  initializeFileUpload();
}

function switchView(view) {
  currentView = view;

  // Mettre à jour les boutons actifs
  document.querySelectorAll(".view-btn").forEach((btn) => {
    btn.classList.remove("active");
  });
  document.querySelector(`[data-view="${view}"]`).classList.add("active");

  // Afficher la vue correspondante
  document.querySelectorAll(".view-content").forEach((content) => {
    content.classList.remove("active");
  });
  document.getElementById(`${view}View`).classList.add("active");

  // Mettre à jour l'affichage
  updateTasksDisplay();
}

function updateTasksDisplay() {
  const filteredTasks = getFilteredTasks();

  switch (currentView) {
    case "table":
      updateTableView(filteredTasks);
      break;
    case "kanban":
      updateKanbanView(filteredTasks);
      break;
    case "calendar":
      updateCalendarView(filteredTasks);
      break;
  }
}

function getFilteredTasks() {
  const statusFilter = document.getElementById("statusFilter").value;
  const priorityFilter = document.getElementById("priorityFilter").value;
  const employeeFilter = document.getElementById("employeeFilter").value;

  return currentTasks.filter((task) => {
    let include = true;

    if (statusFilter && task.status !== statusFilter) {
      include = false;
    }

    if (priorityFilter && task.priority !== priorityFilter) {
      include = false;
    }

    if (employeeFilter && task.employee !== employeeFilter) {
      include = false;
    }

    return include;
  });
}

function updateTableView(tasks) {
  const tbody = document.querySelector("#tasksTable tbody");
  tbody.innerHTML = "";

  tasks.forEach((task) => {
    const row = document.createElement("tr");
    row.className = "task-row";

    const priorityClass = `priority-${task.priority}`;
    const statusClass = `status-${task.status}`;

    row.innerHTML = `
            <td>
                <div class="task-info">
                    <div class="task-avatar">${getInitials(task.employee)}</div>
                    <div class="task-details">
                        <div class="task-title">${task.title}</div>
                        <div class="task-meta">Créé le ${formatDate(
                          new Date()
                        )}</div>
                    </div>
                </div>
            </td>
            <td>${task.project}</td>
            <td>${task.service}</td>
            <td>${task.employee}</td>
            <td>${formatDate(task.dueDate)}</td>
            <td><span class="priority-badge ${priorityClass}">${capitalizeFirst(
      task.priority
    )}</span></td>
            <td><span class="status-badge ${statusClass}">${getStatusText(
      task.status
    )}</span></td>
            <td>${
              task.delayed ? '<span class="retard-badge">En retard</span>' : "-"
            }</td>
            <td>
                <div class="action-buttons">
                    <button class="btn-icon btn-view" onclick="viewTaskDetail(${
                      task.id
                    })" title="Voir">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn-icon btn-edit" onclick="editTask(${
                      task.id
                    })" title="Modifier">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-icon btn-delete" onclick="deleteTask(${
                      task.id
                    })" title="Supprimer">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        `;

    tbody.appendChild(row);
  });
}

function updateKanbanView(tasks) {
  const columns = {
    "a-faire": document.getElementById("todoColumn"),
    "en-cours": document.getElementById("inProgressColumn"),
    terminee: document.getElementById("doneColumn"),
  };

  // Réinitialiser les colonnes
  Object.values(columns).forEach((column) => {
    column.innerHTML = "";
  });

  // Compter les tâches par statut
  const counts = {
    "a-faire": 0,
    "en-cours": 0,
    terminee: 0,
  };

  tasks.forEach((task) => {
    counts[task.status]++;

    const taskElement = createKanbanTaskElement(task);
    if (columns[task.status]) {
      columns[task.status].appendChild(taskElement);
    }
  });

  // Mettre à jour les compteurs
  document.getElementById("todoCount").textContent = counts["a-faire"];
  document.getElementById("inProgressCount").textContent = counts["en-cours"];
  document.getElementById("doneCount").textContent = counts["terminee"];
}

function createKanbanTaskElement(task) {
  const taskElement = document.createElement("div");
  taskElement.className = `kanban-task ${task.priority}`;
  taskElement.setAttribute("data-task-id", task.id);
  taskElement.draggable = true;

  taskElement.innerHTML = `
        <div class="task-header">
            <div>
                <div class="task-title">${task.title}</div>
                <div class="task-project">${task.project}</div>
            </div>
            <span class="task-priority priority-badge priority-${
              task.priority
            }">
                ${task.priority.charAt(0).toUpperCase()}
            </span>
        </div>
        <div class="task-assignee">${task.employee}</div>
        <div class="task-due-date">${formatDate(task.dueDate)}</div>
    `;

  taskElement.addEventListener("dragstart", handleKanbanDragStart);
  taskElement.addEventListener("click", () => viewTaskDetail(task.id));

  return taskElement;
}

function updateCalendarView(tasks) {
  // Implémentation basique du calendrier
  const calendar = document.getElementById("taskCalendar");
  calendar.innerHTML = "<p>Vue calendrier - À implémenter</p>";
}

function updateStats() {
  const totalTasks = currentTasks.length;
  const urgentTasks = currentTasks.filter(
    (task) => task.priority === "urgente"
  ).length;
  const completedTasks = currentTasks.filter(
    (task) => task.status === "terminee"
  ).length;
  const delayedTasks = currentTasks.filter((task) => task.delayed).length;

  document.getElementById("totalTasks").textContent = totalTasks;
  document.getElementById("urgentTasks").textContent = urgentTasks;
  document.getElementById("completedTasks").textContent = completedTasks;
  document.getElementById("delayedTasks").textContent = delayedTasks;
}

function filterTasks() {
  updateTasksDisplay();
}

// Fonctions modales
function openTaskModal() {
  document.getElementById("modalTaskTitle").textContent = "Nouvelle Tâche";
  document.getElementById("taskForm").reset();
  loadProjectsForModal();
  loadEmployeesForModal();
  document.getElementById("taskModal").classList.add("show");
}

function closeTaskModal() {
  document.getElementById("taskModal").classList.remove("show");
}

function saveTask() {
  const form = document.getElementById("taskForm");
  if (form.checkValidity()) {
    // Ici, enregistrement dans la base de données
    alert("Tâche enregistrée avec succès!");
    closeTaskModal();
    loadTasks(); // Recharger les tâches
  } else {
    form.reportValidity();
  }
}

// Modifiez la fonction viewTaskDetail
function viewTaskDetail(taskId) {
    const task = currentTasks.find(t => t.id === taskId);
    if (!task) return;
    
    currentTaskId = taskId;
    
    document.getElementById('detailTaskTitle').textContent = task.title;
    document.getElementById('detailProject').textContent = task.project;
    document.getElementById('detailService').textContent = task.service;
    document.getElementById('detailEmployee').textContent = task.employee;
    document.getElementById('detailPriority').textContent = capitalizeFirst(task.priority);
    document.getElementById('detailDueDate').textContent = formatDate(task.dueDate);
    document.getElementById('detailStatus').textContent = getStatusText(task.status);
    document.getElementById('detailDescription').textContent = task.description;
    
    // Afficher les livrables
    updateDeliverablesDisplay(task.deliverables);
    
    // Gérer la section diffusion selon le type de service
    setupDiffusionSection(task);
    
    document.getElementById('taskDetailModal').classList.add('show');
}

// Nouvelle fonction pour gérer la section diffusion
function setupDiffusionSection(task) {
    const diffusionSection = document.getElementById('diffusionSection');
    const diffusionForm = document.getElementById('diffusionForm');
    
    // Vérifier si c'est un service de diffusion (simplifié pour la démo)
    const isDiffusionService = task.service.includes('Diffusion') || task.service.includes('Campagne');
    
    if (isDiffusionService) {
        diffusionSection.style.display = 'block';
        
        diffusionForm.innerHTML = `
            <div class="form-grid">
                <div class="form-group">
                    <label for="diffusionBudget">Budget quotidien (FCFA) *</label>
                    <input type="number" id="diffusionBudget" 
                           value="${task.diffusionData?.budget || ''}" 
                           placeholder="50000" required>
                </div>
                <div class="form-group">
                    <label for="diffusionDuration">Durée prévue (jours) *</label>
                    <input type="number" id="diffusionDuration" 
                           value="${task.diffusionData?.duration || ''}" 
                           placeholder="30" required>
                </div>
                <div class="form-group">
                    <label for="diffusionStartDate">Date de début effective *</label>
                    <input type="date" id="diffusionStartDate" 
                           value="${task.diffusionData?.startDate || ''}" required>
                </div>
                <div class="form-group">
                    <label for="diffusionEndDate">Date de fin effective</label>
                    <input type="date" id="diffusionEndDate" 
                           value="${task.diffusionData?.endDate || ''}">
                </div>
                <div class="form-group">
                    <label for="diffusionPlatform">Plateforme cible *</label>
                    <select id="diffusionPlatform" required>
                        <option value="">Sélectionnez...</option>
                        <option value="facebook" ${task.diffusionData?.platform === 'facebook' ? 'selected' : ''}>Facebook</option>
                        <option value="tiktok" ${task.diffusionData?.platform === 'tiktok' ? 'selected' : ''}>TikTok</option>
                        <option value="instagram" ${task.diffusionData?.platform === 'instagram' ? 'selected' : ''}>Instagram</option>
                        <option value="linkedin" ${task.diffusionData?.platform === 'linkedin' ? 'selected' : ''}>LinkedIn</option>
                    </select>
                </div>
                <div class="form-group full-width">
                    <label for="diffusionLink">Lien vers la campagne</label>
                    <input type="url" id="diffusionLink" 
                           value="${task.diffusionData?.link || ''}" 
                           placeholder="https://business.facebook.com/ads/manager/campaigns...">
                </div>
            </div>
            <div class="diffusion-actions">
                <button type="button" class="btn btn-primary" onclick="saveDiffusionData(${task.id})">
                    <i class="fas fa-save"></i>
                    Sauvegarder les informations
                </button>
                <button type="button" class="btn btn-secondary" onclick="calculateCampaignProgress()">
                    <i class="fas fa-chart-line"></i>
                    Voir la progression
                </button>
            </div>
        `;
    } else {
        diffusionSection.style.display = 'none';
    }
}

// Fonction pour sauvegarder les données de diffusion
function saveDiffusionData(taskId) {
    const diffusionData = {
        budget: document.getElementById('diffusionBudget').value,
        duration: document.getElementById('diffusionDuration').value,
        startDate: document.getElementById('diffusionStartDate').value,
        endDate: document.getElementById('diffusionEndDate').value,
        platform: document.getElementById('diffusionPlatform').value,
        link: document.getElementById('diffusionLink').value
    };
    
    // Validation
    if (!diffusionData.budget || !diffusionData.duration || !diffusionData.startDate || !diffusionData.platform) {
        alert('Veuillez remplir tous les champs obligatoires.');
        return;
    }
    
    // Sauvegarder dans la tâche
    const task = currentTasks.find(t => t.id === taskId);
    if (task) {
        task.diffusionData = diffusionData;
        console.log('Données de diffusion sauvegardées:', diffusionData);
        alert('Informations de diffusion sauvegardées avec succès!');
        
        // Mettre à jour l'affichage si nécessaire
        updateTaskInDisplay(task);
    }
}

// Fonction pour calculer la progression de la campagne
function calculateCampaignProgress() {
    const startDate = document.getElementById('diffusionStartDate').value;
    const duration = document.getElementById('diffusionDuration').value;
    
    if (!startDate || !duration) {
        alert('Veuillez d\'abord saisir la date de début et la durée.');
        return;
    }
    
    const start = new Date(startDate);
    const end = new Date(start);
    end.setDate(start.getDate() + parseInt(duration));
    const today = new Date();
    
    const totalDays = (end - start) / (1000 * 60 * 60 * 24);
    const daysPassed = (today - start) / (1000 * 60 * 60 * 24);
    
    let progress = Math.min(100, Math.max(0, (daysPassed / totalDays) * 100));
    let status = 'En cours';
    
    if (today < start) {
        status = 'Pas encore démarrée';
        progress = 0;
    } else if (today > end) {
        status = 'Terminée';
        progress = 100;
    }
    
    alert(`Progression de la campagne : ${progress.toFixed(1)}%\nStatut : ${status}\nJours écoulés : ${Math.floor(daysPassed)}/${totalDays}`);
}

// Fonction pour mettre à jour l'affichage d'une tâche
function updateTaskInDisplay(task) {
    // Implémentation pour mettre à jour l'affichage de la tâche modifiée
    console.log('Mise à jour de la tâche:', task);
}

// Fonctions utilitaires
function getInitials(name) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("fr-FR");
}

function capitalizeFirst(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function getStatusText(status) {
  const statusMap = {
    "a-faire": "À faire",
    "en-cours": "En cours",
    terminee: "Terminée",
    annulee: "Annulée",
  };
  return statusMap[status] || status;
}

function loadEmployees() {
  // Simulation du chargement des employés
  const employees = [
    "Marie Kaboré",
    "Jean Traoré",
    "Sophie Ouédraogo",
    "Paul Zongo",
  ];
  const select = document.getElementById("employeeFilter");

  employees.forEach((employee) => {
    const option = document.createElement("option");
    option.value = employee;
    option.textContent = employee;
    select.appendChild(option);
  });
}

function loadProjectsForModal() {
  // Simulation du chargement des projets
  const projects = [
    "Campagne Automne 2024",
    "Stratégie Jeunesse",
    "Image de Marque",
  ];
  const select = document.getElementById("taskProject");
  select.innerHTML = '<option value="">Sélectionnez un projet</option>';

  projects.forEach((project) => {
    const option = document.createElement("option");
    option.value = project;
    option.textContent = project;
    select.appendChild(option);
  });
}

function loadEmployeesForModal() {
  // Simulation du chargement des employés pour le modal
  const employees = [
    "Marie Kaboré",
    "Jean Traoré",
    "Sophie Ouédraogo",
    "Paul Zongo",
  ];
  const select = document.getElementById("taskEmployee");
  select.innerHTML = '<option value="">Sélectionnez un employé</option>';

  employees.forEach((employee) => {
    const option = document.createElement("option");
    option.value = employee;
    option.textContent = employee;
    select.appendChild(option);
  });
}

function initializeKanbanDragDrop() {
  const columns = document.querySelectorAll(".column-content");

  columns.forEach((column) => {
    column.addEventListener("dragover", handleDragOver);
    column.addEventListener("drop", handleDrop);
  });
}

function handleKanbanDragStart(e) {
  e.dataTransfer.setData("text/plain", e.target.getAttribute("data-task-id"));
}

function handleDragOver(e) {
  e.preventDefault();
}

function handleDrop(e) {
  e.preventDefault();
  const taskId = e.dataTransfer.getData("text/plain");
  const newStatus = getStatusFromColumn(e.target);

  if (newStatus) {
    updateTaskStatusInBackend(taskId, newStatus);
  }
}

function getStatusFromColumn(element) {
  const column = element.closest(".kanban-column");
  if (!column) return null;

  const header = column.querySelector(".column-header h3").textContent;
  const statusMap = {
    "À faire": "a-faire",
    "En cours": "en-cours",
    Terminée: "terminee",
  };

  return statusMap[header] || null;
}

function updateTaskStatusInBackend(taskId, newStatus) {
  // Simulation de mise à jour en backend
  const task = currentTasks.find((t) => t.id == taskId);
  if (task) {
    task.status = newStatus;
    updateTasksDisplay();
  }
}

function initializeFileUpload() {
  const uploadArea = document.getElementById("uploadArea");
  const fileInput = document.getElementById("deliverableInput");

  if (uploadArea && fileInput) {
    uploadArea.addEventListener("click", () => fileInput.click());
    uploadArea.addEventListener("dragover", (e) => {
      e.preventDefault();
      uploadArea.style.borderColor = "#2563eb";
      uploadArea.style.background = "#f0f4ff";
    });
    uploadArea.addEventListener("dragleave", () => {
      uploadArea.style.borderColor = "#d1d5db";
      uploadArea.style.background = "transparent";
    });
    uploadArea.addEventListener("drop", (e) => {
      e.preventDefault();
      uploadArea.style.borderColor = "#d1d5db";
      uploadArea.style.background = "transparent";
      handleFileUpload(e.dataTransfer.files);
    });

    fileInput.addEventListener("change", (e) => {
      handleFileUpload(e.target.files);
    });
  }
}

function handleFileUpload(files) {
  // Simulation de l'upload de fichiers
  Array.from(files).forEach((file) => {
    console.log("Fichier uploadé:", file.name);
    // Ici, vous enverriez le fichier au backend
  });
}

function updateDeliverablesDisplay(deliverables) {
  const container = document.getElementById("detailUploadedFiles");
  container.innerHTML = "";

  deliverables.forEach((file) => {
    const fileElement = document.createElement("div");
    fileElement.className = "file-item";
    fileElement.innerHTML = `
            <div class="file-info">
                <i class="fas fa-file ${file.type} file-icon"></i>
                <div>
                    <div class="file-name">${file.name}</div>
                    <div class="file-size">${file.size}</div>
                </div>
            </div>
            <div class="file-actions">
                <button class="btn-icon" onclick="downloadFile('${file.name}')">
                    <i class="fas fa-download"></i>
                </button>
                <button class="btn-icon" onclick="deleteFile('${file.name}')">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
    container.appendChild(fileElement);
  });
}

function updateDiffusionForm(diffusionData) {
  const form = document.getElementById("diffusionForm");
  form.innerHTML = `
        <div class="diffusion-grid">
            <div class="diffusion-item">
                <label>Budget quotidien:</label>
                <span>${diffusionData.budget} FCFA</span>
            </div>
            <div class="diffusion-item">
                <label>Durée prévue:</label>
                <span>${diffusionData.duration} jours</span>
            </div>
            <div class="diffusion-item">
                <label>Date de début:</label>
                <span>${formatDate(diffusionData.startDate)}</span>
            </div>
            <div class="diffusion-item">
                <label>Plateforme:</label>
                <span>${capitalizeFirst(diffusionData.platform)}</span>
            </div>
        </div>
    `;
}

function refreshTasks() {
  loadTasks();
  alert("Liste des tâches actualisée!");
}

function editTask(taskId) {
  const task = currentTasks.find((t) => t.id === taskId);
  if (task) {
    document.getElementById("modalTaskTitle").textContent = "Modifier la Tâche";
    document.getElementById("taskTitle").value = task.title;
    // Remplir les autres champs...
    document.getElementById("taskModal").classList.add("show");
  }
}

function deleteTask(taskId) {
  if (confirm("Voulez-vous vraiment supprimer cette tâche ?")) {
    currentTasks = currentTasks.filter((t) => t.id !== taskId);
    updateTasksDisplay();
    updateStats();
    alert("Tâche supprimée avec succès!");
  }
}

// Gestion de la fermeture des modals
document.addEventListener("click", function (event) {
  const modals = ["taskModal", "taskDetailModal"];
  modals.forEach((modalId) => {
    const modal = document.getElementById(modalId);
    if (event.target === modal) {
      modal.classList.remove("show");
    }
  });
});

document.addEventListener("keydown", function (event) {
  if (event.key === "Escape") {
    document.querySelectorAll(".modal.show").forEach((modal) => {
      modal.classList.remove("show");
    });
  }
});
