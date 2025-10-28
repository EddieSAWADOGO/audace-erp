// facture-view.js - Gestion de l'affichage des factures

document.addEventListener("DOMContentLoaded", function () {
  initializeFactureView();
});

function initializeFactureView() {
  console.log("Initialisation de la vue facture...");
  loadDocumentData();
}

function loadDocumentData() {
  const urlParams = new URLSearchParams(window.location.search);
  const documentId = urlParams.get("id");
  const documentType = urlParams.get("type") || "facture";

  console.log(`Chargement du document: ${documentId}, type: ${documentType}`);

  const documentData = getDocumentData(documentId, documentType);
  updateDocumentUI(documentData);
}

function getDocumentData(documentId, documentType) {
  return {
    id: documentId || "AD-FACT-2024-001",
    type: documentType.toUpperCase(),
    reference: documentId || "AD-FACT-2024-001",
    date: "15 Octobre 2024",
    status: "unpaid",
    client: {
      name: "BELLA MODE SARL",
      contact: "Sophie Kaboré",
      phone: "+226 70 12 34 56",
      email: "contact@bellamode.bf",
    },
    project: {
      reference: "AD-PROJ-2024-015",
      period: "15 Oct - 30 Oct 2024",
    },
    services: [
      {
        description: "Gestion de Campagnes Publicitaires",
        quantity: 1,
        unitPrice: 150000,
        total: 150000,
      },
      {
        description: "Création Graphique - Affiches promotionnelles",
        quantity: 1,
        unitPrice: 75000,
        total: 75000,
      },
    ],
    payment: {
      method: "Mobile Money",
    },
  };
}

function updateDocumentUI(data) {
  document.getElementById("documentType").textContent = data.type;
  document.getElementById("documentRef").textContent = data.reference;
  document.getElementById("documentDate").textContent = data.date;

  const statusElement = document.getElementById("documentStatus");
  statusElement.textContent = getStatusText(data.status);
  statusElement.className = `document-status status-${data.status}`;

  document.getElementById("clientName").textContent = data.client.name;
  document.getElementById("clientContact").textContent = data.client.contact;
  document.getElementById("clientPhone").textContent = data.client.phone;
  document.getElementById("clientEmail").textContent = data.client.email;

  document.getElementById("projectRef").textContent = data.project.reference;
  document.getElementById("projectPeriod").textContent = data.project.period;

  renderServicesTable(data.services);
  updateTotals(data.services);

  document.getElementById("paymentMethod").textContent = data.payment.method;
}

function getStatusText(status) {
  const statusMap = {
    paid: "Payé",
    unpaid: "En attente de paiement",
    partial: "Partiellement payé",
  };
  return statusMap[status] || "Inconnu";
}

function renderServicesTable(services) {
  const tbody = document.getElementById("servicesList");
  let html = "";

  services.forEach((service) => {
    html += `
            <tr>
                <td class="service-desc">${service.description}</td>
                <td class="service-qty text-center">${service.quantity}</td>
                <td class="service-price text-right">${formatMoney(
                  service.unitPrice
                )}</td>
                <td class="service-total text-right">${formatMoney(
                  service.total
                )}</td>
            </tr>
        `;
  });

  tbody.innerHTML = html;
}

function updateTotals(services) {
  const subtotal = services.reduce((sum, service) => sum + service.total, 0);

  document.getElementById("subtotal").textContent = formatMoney(subtotal);
  document.getElementById("tva").textContent = formatMoney(0);
  document.getElementById("total").textContent = formatMoney(subtotal);
}

function formatMoney(amount) {
  return (
    new Intl.NumberFormat("fr-FR", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount) + " FCFA"
  );
}

function downloadPDF() {
  alert("Fonctionnalité PDF à implémenter avec le backend Django");
}

function closeDocument() {
  if (window.history.length > 1) {
    window.history.back();
  } else {
    window.close();
  }
}

window.downloadPDF = downloadPDF;
window.closeDocument = closeDocument;
