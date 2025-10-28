// communication.js - Gestion de la communication client

let messageTemplates = [];
let pendingNotifications = [];
let communicationHistory = [];
let currentEditingTemplate = null;

document.addEventListener("DOMContentLoaded", function () {
  initializeCommunicationPage();
});

function initializeCommunicationPage() {
  console.log("Initialisation du module de communication...");

  loadTemplates();
  loadNotifications();
  loadCommunicationHistory();
  initializeEventListeners();
}

function initializeEventListeners() {
  // Filtre des templates
  const templateFilter = document.getElementById("templateFilter");
  if (templateFilter) {
    templateFilter.addEventListener("change", filterTemplates);
  }
}

function loadTemplates() {
  // Templates par défaut selon le cahier des charges
  messageTemplates = [
    {
      id: 1,
      name: "Facture à régler",
      type: "facture",
      message:
        "Bonjour {client_nom},\n\nVotre facture pour le projet \"{projet_nom}\" d'un montant de {montant} FCFA est maintenant disponible.\n\nVous pouvez la consulter ici : {lien_facture}\n\nCordialement,\nL'équipe Audace Digicom",
      active: true,
      created: "2024-10-15",
    },
    {
      id: 2,
      name: "Début de campagne",
      type: "debut-campagne",
      message:
        "Bonjour {client_nom},\n\nNous avons le plaisir de vous informer que votre campagne publicitaire \"{projet_nom}\" a démarré aujourd'hui.\n\nNous vous tiendrons informé de l'avancement et des résultats.\n\nCordialement,\nL'équipe Audace Digicom",
      active: true,
      created: "2024-10-15",
    },
    {
      id: 3,
      name: "Fin de campagne",
      type: "fin-campagne",
      message:
        'Bonjour {client_nom},\n\nVotre campagne publicitaire "{projet_nom}" est maintenant terminée.\n\nLe rapport de performance final sera disponible dans les prochaines 24 heures.\n\nMerci pour votre confiance !\n\nCordialement,\nL\'équipe Audace Digicom',
      active: true,
      created: "2024-10-15",
    },
    {
      id: 4,
      name: "Rappel de paiement",
      type: "rappel",
      message:
        "Bonjour {client_nom},\n\nRappel concernant le règlement de votre facture pour le projet \"{projet_nom}\" d'un montant de {montant} FCFA.\n\nDate limite : {date_limite}\n\nMerci de procéder au règlement.\n\nCordialement,\nL'équipe Audace Digicom",
      active: true,
      created: "2024-10-15",
    },
    {
      id: 5,
      name: "Envoi de rapport",
      type: "rapport",
      message:
        'Bonjour {client_nom},\n\nLe rapport de performance de votre campagne "{projet_nom}" est maintenant disponible.\n\nNous restons à votre disposition pour en discuter.\n\nCordialement,\nL\'équipe Audace Digicom',
      active: true,
      created: "2024-10-15",
    },
  ];

  updateTemplatesDisplay();
  updateStats();
}

function loadNotifications() {
  // Simulation de notifications automatiques
  pendingNotifications = [
    {
      id: 1,
      type: "fin-campagne",
      title: "Campagne se termine demain",
      description:
        "La campagne Facebook de Bella Mode se termine le 30/10/2024",
      client: "Bella Mode SARL",
      clientPhone: "+226 70 12 34 56",
      project: "Campagne Facebook Automne 2024",
      date: "2024-10-29",
      templateId: 3,
    },
    {
      id: 2,
      type: "facture",
      title: "Facture à envoyer",
      description: "Facture pour la création graphique de Tech Solutions",
      client: "Tech Solutions BF",
      clientPhone: "+226 76 54 32 10",
      project: "Refonte Site Web",
      date: "2024-10-28",
      templateId: 1,
      amount: "75,000 FCFA",
    },
  ];

  updateNotificationsDisplay();
  updateStats();
}

function loadCommunicationHistory() {
  // Historique des communications
  communicationHistory = [
    {
      id: 1,
      date: "2024-10-25 14:30",
      client: "Bella Mode SARL",
      type: "debut-campagne",
      status: "sent",
      message: "Notification de début de campagne envoyée",
    },
    {
      id: 2,
      date: "2024-10-20 10:15",
      client: "Tech Solutions BF",
      type: "facture",
      status: "sent",
      message: "Facture envoyée pour création graphique",
    },
    {
      id: 3,
      date: "2024-10-18 16:45",
      client: "Abdoul Martin",
      type: "rappel",
      status: "pending",
      message: "Rappel de paiement programmé",
    },
  ];

  updateHistoryDisplay();
}

function updateStats() {
  document.getElementById("sentMessages").textContent =
    communicationHistory.filter((c) => c.status === "sent").length;
  document.getElementById("pendingNotifications").textContent =
    pendingNotifications.length;
  document.getElementById("activeTemplates").textContent =
    messageTemplates.filter((t) => t.active).length;
}

function updateTemplatesDisplay() {
  const templatesGrid = document.getElementById("templatesGrid");
  const activeTemplates = messageTemplates.filter((t) => t.active);

  document.getElementById("templatesCount").textContent =
    activeTemplates.length;

  if (activeTemplates.length === 0) {
    templatesGrid.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-file-alt"></i>
                <h4>Aucun template actif</h4>
                <p>Créez votre premier template de message</p>
            </div>
        `;
    return;
  }

  templatesGrid.innerHTML = activeTemplates
    .map(
      (template) => `
        <div class="template-card" onclick="useTemplate(${template.id})">
            <div class="template-header">
                <div>
                    <div class="template-title">${template.name}</div>
                    <span class="template-type ${
                      template.type
                    }">${getTemplateTypeLabel(template.type)}</span>
                </div>
                <div class="template-actions">
                    <button class="btn-icon btn-edit" onclick="event.stopPropagation(); editTemplate(${
                      template.id
                    })" title="Modifier">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-icon btn-delete" onclick="event.stopPropagation(); deleteTemplate(${
                      template.id
                    })" title="Supprimer">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            <div class="template-message">${template.message}</div>
            <div class="template-footer">
                <span class="template-status">Créé le ${formatDate(
                  template.created
                )}</span>
                <button class="btn btn-outline btn-sm" onclick="event.stopPropagation(); previewTemplate(${
                  template.id
                })">
                    <i class="fas fa-eye"></i> Prévisualiser
                </button>
            </div>
        </div>
    `
    )
    .join("");
}

function updateNotificationsDisplay() {
  const notificationsContainer = document.getElementById(
    "notificationsContainer"
  );

  document.getElementById("notificationsCount").textContent =
    pendingNotifications.length;

  if (pendingNotifications.length === 0) {
    notificationsContainer.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-bell-slash"></i>
                <h4>Aucune notification en attente</h4>
                <p>Les notifications apparaîtront ici automatiquement</p>
            </div>
        `;
    return;
  }

  notificationsContainer.innerHTML = pendingNotifications
    .map(
      (notification) => `
        <div class="notification-item">
            <div class="notification-icon ${notification.type}">
                <i class="fas ${getNotificationIcon(notification.type)}"></i>
            </div>
            <div class="notification-content">
                <div class="notification-title">${notification.title}</div>
                <div class="notification-description">${
                  notification.description
                }</div>
                <div class="notification-meta">
                    <span class="notification-client">
                        <i class="fas fa-user"></i> ${notification.client}
                    </span>
                    <span class="notification-project">
                        <i class="fas fa-project-diagram"></i> ${
                          notification.project
                        }
                    </span>
                    <span class="notification-date">
                        <i class="fas fa-calendar"></i> ${formatDate(
                          notification.date
                        )}
                    </span>
                </div>
            </div>
            <div class="notification-actions">
                <button class="btn btn-primary btn-sm" onclick="sendNotification(${
                  notification.id
                })">
                    <i class="fab fa-whatsapp"></i> Envoyer
                </button>
                <button class="btn btn-outline btn-sm" onclick="dismissNotification(${
                  notification.id
                })">
                    <i class="fas fa-times"></i> Ignorer
                </button>
            </div>
        </div>
    `
    )
    .join("");
}

function updateHistoryDisplay() {
  const historyTable = document.querySelector("#communicationHistory tbody");

  historyTable.innerHTML = communicationHistory
    .map(
      (comm) => `
        <tr>
            <td>${formatDateTime(comm.date)}</td>
            <td>${comm.client}</td>
            <td>${getTemplateTypeLabel(comm.type)}</td>
            <td><span class="history-status ${comm.status}">${getStatusText(
        comm.status
      )}</span></td>
            <td>
                <div class="action-buttons">
                    <button class="btn-icon btn-view" onclick="viewCommunication(${
                      comm.id
                    })" title="Voir">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn-icon btn-delete" onclick="deleteCommunication(${
                      comm.id
                    })" title="Supprimer">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `
    )
    .join("");
}

// Fonctions pour les templates
function openTemplateModal() {
  currentEditingTemplate = null;
  document.getElementById("templateModalTitle").textContent =
    "Nouveau Template";
  document.getElementById("templateForm").reset();
  document.getElementById("templateModal").classList.add("show");
}

function closeTemplateModal() {
  document.getElementById("templateModal").classList.remove("show");
  currentEditingTemplate = null;
}

function insertVariable(variable) {
  const messageField = document.getElementById("templateMessage");
  const startPos = messageField.selectionStart;
  const endPos = messageField.selectionEnd;

  messageField.value =
    messageField.value.substring(0, startPos) +
    variable +
    messageField.value.substring(endPos);
  messageField.focus();
  messageField.setSelectionRange(
    startPos + variable.length,
    startPos + variable.length
  );
}

function saveTemplate() {
  const form = document.getElementById("templateForm");
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  const templateData = {
    name: document.getElementById("templateName").value,
    type: document.getElementById("templateType").value,
    message: document.getElementById("templateMessage").value,
    active: document.getElementById("templateActive").checked,
    created: new Date().toISOString().split("T")[0],
  };

  if (currentEditingTemplate) {
    // Modification
    const index = messageTemplates.findIndex(
      (t) => t.id === currentEditingTemplate
    );
    if (index !== -1) {
      messageTemplates[index] = { ...messageTemplates[index], ...templateData };
    }
  } else {
    // Nouveau template
    const newTemplate = {
      id: Date.now(),
      ...templateData,
    };
    messageTemplates.push(newTemplate);
  }

  updateTemplatesDisplay();
  closeTemplateModal();
  alert("Template sauvegardé avec succès!");
}

function editTemplate(templateId) {
  const template = messageTemplates.find((t) => t.id === templateId);
  if (!template) return;

  currentEditingTemplate = templateId;
  document.getElementById("templateModalTitle").textContent =
    "Modifier le Template";

  document.getElementById("templateName").value = template.name;
  document.getElementById("templateType").value = template.type;
  document.getElementById("templateMessage").value = template.message;
  document.getElementById("templateActive").checked = template.active;

  document.getElementById("templateModal").classList.add("show");
}

function deleteTemplate(templateId) {
  const template = messageTemplates.find((t) => t.id === templateId);
  if (!template) return;

  if (
    confirm(`Voulez-vous vraiment supprimer le template "${template.name}" ?`)
  ) {
    messageTemplates = messageTemplates.filter((t) => t.id !== templateId);
    updateTemplatesDisplay();
    alert("Template supprimé avec succès!");
  }
}

function useTemplate(templateId) {
  const template = messageTemplates.find((t) => t.id === templateId);
  if (!template) return;

  // Simuler l'utilisation d'un template
  alert(
    `Template "${template.name}" sélectionné. Redirection vers l'envoi de message...`
  );
  // Ici, vous redirigeriez vers une page d'envoi ou ouvririez un modal
}

function previewTemplate(templateId) {
  const template = messageTemplates.find((t) => t.id === templateId);
  if (!template) return;

  // Prévisualisation simple
  const preview = template.message
    .replace(/{client_nom}/g, "Nom du Client")
    .replace(/{client_entreprise}/g, "Entreprise du Client")
    .replace(/{projet_nom}/g, "Nom du Projet")
    .replace(/{service_nom}/g, "Nom du Service")
    .replace(/{montant}/g, "0 FCFA")
    .replace(/{date_livraison}/g, "JJ/MM/AAAA")
    .replace(/{lien_facture}/g, "https://...");

  alert(`Prévisualisation - ${template.name}:\n\n${preview}`);
}

// Fonctions pour les notifications
function sendNotification(notificationId) {
  const notification = pendingNotifications.find(
    (n) => n.id === notificationId
  );
  if (!notification) return;

  const template = messageTemplates.find(
    (t) => t.id === notification.templateId
  );
  if (!template) return;

  // Préparer le message avec les variables
  let message = template.message
    .replace(/{client_nom}/g, notification.client.split(" ")[0]) // Premier nom seulement
    .replace(/{client_entreprise}/g, notification.client)
    .replace(/{projet_nom}/g, notification.project)
    .replace(/{montant}/g, notification.amount || "0 FCFA")
    .replace(/{date_livraison}/g, formatDate(notification.date))
    .replace(
      /{lien_facture}/g,
      "https://audacedigicom.bf/factures/" + notification.id
    );

  // Ouvrir le modal d'envoi
  openSendMessageModal(notification, message);
}

function dismissNotification(notificationId) {
  if (confirm("Ignorer cette notification ?")) {
    pendingNotifications = pendingNotifications.filter(
      (n) => n.id !== notificationId
    );
    updateNotificationsDisplay();
    updateStats();
  }
}

function openSendMessageModal(notification, message) {
  document.getElementById("previewClientAvatar").textContent = getInitials(
    notification.client
  );
  document.getElementById("previewClientName").textContent =
    notification.client;
  document.getElementById("previewClientPhone").textContent =
    notification.clientPhone;
  document.getElementById("previewMessageType").textContent =
    getTemplateTypeLabel(notification.type);
  document.getElementById("previewMessageText").textContent = message;
  document.getElementById("previewMessageTime").textContent = "Maintenant";

  document.getElementById("sendMessageModal").classList.add("show");
}

function closeSendMessageModal() {
  document.getElementById("sendMessageModal").classList.remove("show");
}

function sendWhatsAppMessage() {
  const clientPhone = document.getElementById("previewClientPhone").textContent;
  const messageText = document.getElementById("previewMessageText").textContent;

  // Formater le numéro pour WhatsApp (supprimer les espaces et le +)
  const formattedPhone = clientPhone.replace(/[\s+]/g, "");
  const encodedMessage = encodeURIComponent(messageText);

  // Ouvrir WhatsApp avec le message pré-rempli
  const whatsappUrl = `https://wa.me/${formattedPhone}?text=${encodedMessage}`;
  window.open(whatsappUrl, "_blank");

  // Enregistrer dans l'historique
  const newCommunication = {
    id: Date.now(),
    date: new Date().toISOString(),
    client: document.getElementById("previewClientName").textContent,
    type: document
      .getElementById("previewMessageType")
      .textContent.toLowerCase(),
    status: "sent",
    message: "Message envoyé via WhatsApp",
  };

  communicationHistory.unshift(newCommunication);
  updateHistoryDisplay();
  updateStats();

  // Retirer la notification
  const clientName = document.getElementById("previewClientName").textContent;
  pendingNotifications = pendingNotifications.filter(
    (n) => n.client !== clientName
  );
  updateNotificationsDisplay();

  closeSendMessageModal();
  alert("WhatsApp ouvert avec le message pré-rempli!");
}

function copyMessageToClipboard() {
  const messageText = document.getElementById("previewMessageText").textContent;

  navigator.clipboard
    .writeText(messageText)
    .then(() => {
      alert("Message copié dans le presse-papier!");
    })
    .catch((err) => {
      console.error("Erreur lors de la copie:", err);
      alert("Erreur lors de la copie du message");
    });
}

// Fonctions utilitaires
function getTemplateTypeLabel(type) {
  const labels = {
    facture: "Facture",
    "debut-campagne": "Début campagne",
    "fin-campagne": "Fin campagne",
    rapport: "Rapport",
    rappel: "Rappel",
  };
  return labels[type] || type;
}

function getNotificationIcon(type) {
  const icons = {
    facture: "fa-file-invoice",
    "debut-campagne": "fa-play-circle",
    "fin-campagne": "fa-flag-checkered",
    rapport: "fa-chart-bar",
    rappel: "fa-bell",
  };
  return icons[type] || "fa-bell";
}

function getStatusText(status) {
  const statusMap = {
    sent: "Envoyé",
    pending: "En attente",
    failed: "Échec",
  };
  return statusMap[status] || status;
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("fr-FR");
}

function formatDateTime(dateTimeString) {
  const date = new Date(dateTimeString);
  return date.toLocaleString("fr-FR");
}

function getInitials(name) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

function filterTemplates() {
  const filterValue = document.getElementById("templateFilter").value;
  // Implémentation simple du filtrage
  console.log("Filtrage des templates par:", filterValue);
}

function viewCommunication(commId) {
  const comm = communicationHistory.find((c) => c.id === commId);
  if (comm) {
    alert(
      `Détails de la communication:\n\nClient: ${
        comm.client
      }\nType: ${getTemplateTypeLabel(comm.type)}\nDate: ${formatDateTime(
        comm.date
      )}\nStatut: ${getStatusText(comm.status)}\nMessage: ${comm.message}`
    );
  }
}

function deleteCommunication(commId) {
  if (confirm("Supprimer cette entrée de l'historique ?")) {
    communicationHistory = communicationHistory.filter((c) => c.id !== commId);
    updateHistoryDisplay();
    updateStats();
  }
}

function clearHistory() {
  if (
    confirm(
      "Voulez-vous vraiment effacer tout l'historique des communications ?"
    )
  ) {
    communicationHistory = [];
    updateHistoryDisplay();
    updateStats();
    alert("Historique effacé!");
  }
}

// Simulation de notifications automatiques
function simulateNewNotification() {
  const newNotification = {
    id: Date.now(),
    type: "fin-campagne",
    title: "Nouvelle notification de test",
    description: "Ceci est une notification simulée",
    client: "Client Test",
    clientPhone: "+226 00 00 00 00",
    project: "Projet Test",
    date: new Date().toISOString().split("T")[0],
    templateId: 3,
  };

  pendingNotifications.push(newNotification);
  updateNotificationsDisplay();
  updateStats();

  // Jouer un son de notification (optionnel)
  const audio = new Audio(
    "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+Dyvm0iBzF/zfDZijgKG2Gv6O2sWBYISJfd8sV1LQUkdcfw3ZBAChRetOnrqFUU"
  );
  audio.play().catch(() => {});
}

// Charger les notifications périodiquement
setInterval(loadNotifications, 30000); // Toutes les 30 secondes

// Fermer les modaux
document.addEventListener("click", function (event) {
  const modals = ["templateModal", "sendMessageModal"];
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
