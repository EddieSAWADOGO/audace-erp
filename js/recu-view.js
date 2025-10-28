// recu-view.js - Gestion des reçus finale

document.addEventListener("DOMContentLoaded", function () {
  initializeRecuView();
});

function initializeRecuView() {
  loadRecuData();
}

function loadRecuData() {
  const urlParams = new URLSearchParams(window.location.search);
  const recuId = urlParams.get("id");

  const recuData = getRecuData(recuId);
  updateRecuUI(recuData);
}

function getRecuData(recuId) {
  return {
    reference: recuId || "AD-RECU-2024-001",
    client: "Bella Mode SARL",
    amount: 112500,
    paymentMethod: "Mobile Money",
    date: "15 Oct 2024",

    services: [
      { name: "Gestion de Campagnes Publicitaires", amount: 75000 },
      { name: "Création Graphique - Affiches", amount: 37500 },
    ],
  };
}

function updateRecuUI(data) {
  document.getElementById("reference").textContent = data.reference;
  document.getElementById("clientName").textContent = data.client;
  document.getElementById("amount").textContent = formatMoney(data.amount);
  document.getElementById("paymentMethod").textContent = data.paymentMethod;
  document.getElementById("paymentDate").textContent = data.date;

  renderServicesList(data.services);
}

function renderServicesList(services) {
  const container = document.getElementById("servicesList");
  let html = "";

  services.forEach((service) => {
    html += `
            <div class="service-item">
                <span class="service-name">${service.name}</span>
                <span class="service-amount">${formatMoney(
                  service.amount
                )}</span>
            </div>
        `;
  });

  container.innerHTML = html;
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
