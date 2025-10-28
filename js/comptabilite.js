// comptabilite.js - Gestion de la comptabilité

let transactions = [];
let financialData = {};
let charts = {};

document.addEventListener("DOMContentLoaded", function () {
  initializeComptabilite();
});

function initializeComptabilite() {
  console.log("Initialisation du module de comptabilité...");

  loadFinancialData();
  initializeCharts();
  initializeEventListeners();
  updateFinancialDashboard();
}

function initializeEventListeners() {
  // Filtre de période
  const periodFilter = document.getElementById("periodFilter");
  if (periodFilter) {
    periodFilter.addEventListener("change", function () {
      if (this.value === "personnalise") {
        document.getElementById("dateRange").style.display = "flex";
      } else {
        document.getElementById("dateRange").style.display = "none";
        updateFinancialDashboard();
      }
    });
  }

  // Dates personnalisées
  const dateInputs = document.querySelectorAll(".date-input");
  dateInputs.forEach((input) => {
    input.addEventListener("change", updateFinancialDashboard);
  });

  // Période du graphique
  const chartPeriod = document.getElementById("chartPeriod");
  if (chartPeriod) {
    chartPeriod.addEventListener("change", updateCharts);
  }
}

function loadFinancialData() {
  // Données financières de démonstration
  transactions = [
    {
      id: 1,
      date: "2024-10-25",
      type: "entree",
      amount: 150000,
      category: "vente-services",
      client: "Bella Mode SARL",
      project: "Campagne Facebook Automne 2024",
      description: "Paiement campagne publicitaire",
      proof: null,
      notes: "Paiement partiel reçu",
      balance: 150000,
    },
    {
      id: 2,
      date: "2024-10-20",
      type: "sortie",
      amount: 45000,
      category: "logiciels",
      supplier: "Adobe Creative Cloud",
      description: "Abonnement mensuel Adobe",
      proof: "adobe-invoice.pdf",
      notes: "Abonnement annuel",
      balance: 105000,
    },
    {
      id: 3,
      date: "2024-10-18",
      type: "entree",
      amount: 75000,
      category: "vente-services",
      client: "Tech Solutions BF",
      project: "Refonte Site Web",
      description: "Paiement création graphique",
      proof: null,
      notes: "",
      balance: 180000,
    },
    {
      id: 4,
      date: "2024-10-15",
      type: "sortie",
      amount: 25000,
      category: "fournitures",
      supplier: "Bureau & Style",
      description: "Achat fournitures bureau",
      proof: "facture-bureau.pdf",
      notes: "Papeterie et consommables",
      balance: 155000,
    },
  ];

  financialData = {
    totalRevenue: 225000,
    totalExpenses: 70000,
    netProfit: 155000,
    cashBalance: 155000,
    revenueTrend: "+12%",
    expensesTrend: "+8%",
    profitTrend: "+15%",
    cashflowTrend: "Stable",
  };
}

function updateFinancialDashboard() {
  // Mettre à jour les statistiques
  document.getElementById("totalRevenue").textContent = formatCurrency(
    financialData.totalRevenue
  );
  document.getElementById("totalExpenses").textContent = formatCurrency(
    financialData.totalExpenses
  );
  document.getElementById("netProfit").textContent = formatCurrency(
    financialData.netProfit
  );
  document.getElementById("cashBalance").textContent = formatCurrency(
    financialData.cashBalance
  );

  document.getElementById("revenueTrend").textContent =
    financialData.revenueTrend;
  document.getElementById("expensesTrend").textContent =
    financialData.expensesTrend;
  document.getElementById("profitTrend").textContent =
    financialData.profitTrend;
  document.getElementById("cashflowTrend").textContent =
    financialData.cashflowTrend;

  // Mettre à jour le journal
  updateCashJournal();

  // Mettre à jour les graphiques
  updateCharts();
}

function updateCashJournal() {
  const tableBody = document.querySelector("#cashJournalTable tbody");
  const finalBalance = document.getElementById("finalBalance");

  let html = "";
  let runningBalance = 0;

  transactions.forEach((transaction) => {
    runningBalance = transaction.balance;
    const isEntree = transaction.type === "entree";

    html += `
            <tr class="transaction-${transaction.type}">
                <td>${formatDate(transaction.date)}</td>
                <td>TR-${transaction.id.toString().padStart(4, "0")}</td>
                <td>${transaction.description}</td>
                <td>${getCategoryLabel(transaction.category)}</td>
                <td>${transaction.client || transaction.supplier || "-"}</td>
                <td class="transaction-amount ${
                  isEntree ? "amount-entree" : "amount-sortie"
                }">
                    ${isEntree ? "+" : "-"}${formatCurrency(transaction.amount)}
                </td>
                <td class="${
                  runningBalance >= 0 ? "balance-positive" : "balance-negative"
                }">
                    ${formatCurrency(runningBalance)}
                </td>
                <td>
                    <div class="action-buttons">
                        <button class="btn-icon btn-view" onclick="viewTransaction(${
                          transaction.id
                        })" title="Voir">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn-icon btn-edit" onclick="editTransaction(${
                          transaction.id
                        })" title="Modifier">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-icon btn-delete" onclick="deleteTransaction(${
                          transaction.id
                        })" title="Supprimer">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
  });

  tableBody.innerHTML = html;
  finalBalance.textContent = formatCurrency(runningBalance);
}

function initializeCharts() {
  // Graphique revenus vs dépenses
  const revenueExpenseCtx = document
    .getElementById("revenueExpenseChart")
    .getContext("2d");
  charts.revenueExpense = new Chart(revenueExpenseCtx, {
    type: "line",
    data: {
      labels: [
        "Jan",
        "Fév",
        "Mar",
        "Avr",
        "Mai",
        "Jun",
        "Jul",
        "Aoû",
        "Sep",
        "Oct",
      ],
      datasets: [
        {
          label: "Revenus",
          data: [
            120000, 150000, 180000, 140000, 200000, 220000, 240000, 210000,
            230000, 225000,
          ],
          borderColor: "#10b981",
          backgroundColor: "rgba(16, 185, 129, 0.1)",
          tension: 0.4,
          fill: true,
        },
        {
          label: "Dépenses",
          data: [
            45000, 50000, 55000, 48000, 60000, 65000, 70000, 62000, 68000,
            70000,
          ],
          borderColor: "#ef4444",
          backgroundColor: "rgba(239, 68, 68, 0.1)",
          tension: 0.4,
          fill: true,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "top",
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              return `${context.dataset.label}: ${formatCurrency(context.raw)}`;
            },
          },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: function (value) {
              return formatCurrency(value);
            },
          },
        },
      },
    },
  });

  // Graphique de répartition des revenus
  const revenueDistributionCtx = document
    .getElementById("revenueDistributionChart")
    .getContext("2d");
  charts.revenueDistribution = new Chart(revenueDistributionCtx, {
    type: "doughnut",
    data: {
      labels: [
        "Campagnes Pub",
        "Création Graphique",
        "Production Vidéo",
        "Autres Services",
      ],
      datasets: [
        {
          data: [60, 25, 10, 5],
          backgroundColor: ["#3b82f6", "#10b981", "#8b5cf6", "#f59e0b"],
          borderWidth: 2,
          borderColor: "#ffffff",
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "bottom",
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              return `${context.label}: ${context.raw}%`;
            },
          },
        },
      },
    },
  });
}

function updateCharts() {
  // Mettre à jour les graphiques selon la période sélectionnée
  console.log("Mise à jour des graphiques...");
}

// Fonctions modales
function openTransactionModal(type) {
  const modal = document.getElementById("transactionModal");
  const title = document.getElementById("transactionModalTitle");

  if (type === "entree") {
    title.textContent = "Nouvelle Entrée de Fonds";
    document.getElementById("transactionType").value = "entree";
  } else {
    title.textContent = "Nouvelle Dépense";
    document.getElementById("transactionType").value = "sortie";
  }

  toggleTransactionFields();
  modal.classList.add("show");
}

function closeTransactionModal() {
  document.getElementById("transactionModal").classList.remove("show");
  document.getElementById("transactionForm").reset();
  document.getElementById("filePreview").innerHTML = "";
}

function toggleTransactionFields() {
  const type = document.getElementById("transactionType").value;
  const clientField = document.getElementById("clientField");
  const projectField = document.getElementById("projectField");
  const supplierField = document.getElementById("supplierField");

  if (type === "entree") {
    clientField.style.display = "block";
    projectField.style.display = "block";
    supplierField.style.display = "none";
  } else {
    clientField.style.display = "none";
    projectField.style.display = "none";
    supplierField.style.display = "block";
  }

  loadTransactionCategories(type);
}

function loadTransactionCategories(type) {
  const categorySelect = document.getElementById("transactionCategory");
  categorySelect.innerHTML =
    '<option value="">Sélectionnez une catégorie</option>';

  const categories =
    type === "entree"
      ? [
          { value: "vente-services", label: "Vente de services" },
          { value: "avance-client", label: "Avance client" },
          { value: "autres-revenus", label: "Autres revenus" },
        ]
      : [
          { value: "salaires", label: "Salaires et charges" },
          { value: "logiciels", label: "Logiciels et abonnements" },
          { value: "fournitures", label: "Fournitures de bureau" },
          { value: "communication", label: "Communication et internet" },
          { value: "deplacement", label: "Déplacement et transport" },
          { value: "autres-depenses", label: "Autres dépenses" },
        ];

  categories.forEach((cat) => {
    const option = document.createElement("option");
    option.value = cat.value;
    option.textContent = cat.label;
    categorySelect.appendChild(option);
  });
}

function saveTransaction() {
  const form = document.getElementById("transactionForm");
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  const transactionData = {
    id: transactions.length + 1,
    date: document.getElementById("transactionDate").value,
    type: document.getElementById("transactionType").value,
    amount: parseFloat(document.getElementById("transactionAmount").value),
    category: document.getElementById("transactionCategory").value,
    description: document.getElementById("transactionDescription").value,
    notes: document.getElementById("transactionNotes").value,
    proof: document.getElementById("filePreview").textContent || null,
  };

  if (transactionData.type === "entree") {
    transactionData.client = document.getElementById("transactionClient").value;
    transactionData.project =
      document.getElementById("transactionProject").value;
  } else {
    transactionData.supplier = document.getElementById(
      "transactionSupplier"
    ).value;
  }

  // Calculer le nouveau solde
  const lastTransaction = transactions[transactions.length - 1];
  const lastBalance = lastTransaction ? lastTransaction.balance : 0;
  transactionData.balance =
    lastBalance +
    (transactionData.type === "entree"
      ? transactionData.amount
      : -transactionData.amount);

  transactions.push(transactionData);

  // Mettre à jour les données financières
  updateFinancialData();
  updateFinancialDashboard();
  closeTransactionModal();

  alert("Transaction enregistrée avec succès!");
}

function updateFinancialData() {
  const revenue = transactions
    .filter((t) => t.type === "entree")
    .reduce((sum, t) => sum + t.amount, 0);
  const expenses = transactions
    .filter((t) => t.type === "sortie")
    .reduce((sum, t) => sum + t.amount, 0);

  financialData.totalRevenue = revenue;
  financialData.totalExpenses = expenses;
  financialData.netProfit = revenue - expenses;
  financialData.cashBalance = revenue - expenses;
}

function viewTransaction(transactionId) {
  const transaction = transactions.find((t) => t.id === transactionId);
  if (transaction) {
    alert(
      `Détails de la transaction:\n\nDate: ${formatDate(
        transaction.date
      )}\nType: ${
        transaction.type === "entree" ? "Entrée" : "Sortie"
      }\nMontant: ${formatCurrency(transaction.amount)}\nDescription: ${
        transaction.description
      }\nCatégorie: ${getCategoryLabel(transaction.category)}`
    );
  }
}

function editTransaction(transactionId) {
  alert("Modification de transaction - À implémenter");
}

function deleteTransaction(transactionId) {
  if (confirm("Voulez-vous vraiment supprimer cette transaction ?")) {
    transactions = transactions.filter((t) => t.id !== transactionId);
    updateFinancialData();
    updateFinancialDashboard();
    alert("Transaction supprimée avec succès!");
  }
}

function filterTransactions(filter) {
  console.log(`Filtrage des transactions: ${filter}`);
  // Implémentation du filtrage
}

function generateReports() {
  document.getElementById("reportModal").classList.add("show");
}

function closeReportModal() {
  document.getElementById("reportModal").classList.remove("show");
}

function generateReport() {
  const reportType = document.getElementById("reportType").value;
  const format = document.getElementById("reportFormat").value;
  const startDate = document.getElementById("reportStartDate").value;
  const endDate = document.getElementById("reportEndDate").value;

  if (!startDate || !endDate) {
    alert("Veuillez sélectionner une période");
    return;
  }

  // Simulation de génération de rapport
  alert(
    `Génération du rapport ${reportType} en format ${format} pour la période du ${formatDate(
      startDate
    )} au ${formatDate(endDate)}`
  );
  closeReportModal();
}

// Fonctions utilitaires
function formatCurrency(amount) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "XOF",
  }).format(amount);
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("fr-FR");
}

function getCategoryLabel(category) {
  const labels = {
    "vente-services": "Vente de services",
    "avance-client": "Avance client",
    "autres-revenus": "Autres revenus",
    salaires: "Salaires",
    logiciels: "Logiciels",
    fournitures: "Fournitures",
    communication: "Communication",
    deplacement: "Déplacement",
    "autres-depenses": "Autres dépenses",
  };
  return labels[category] || category;
}

// Gestion des fichiers
document
  .getElementById("transactionProof")
  .addEventListener("change", function (e) {
    const filePreview = document.getElementById("filePreview");
    const files = e.target.files;

    filePreview.innerHTML = "";

    if (files.length > 0) {
      const file = files[0];
      const fileItem = document.createElement("div");
      fileItem.className = "file-preview-item";
      fileItem.innerHTML = `
            <span>${file.name}</span>
            <button type="button" class="btn-icon btn-delete" onclick="removeFilePreview(this)">
                <i class="fas fa-times"></i>
            </button>
        `;
      filePreview.appendChild(fileItem);
    }
  });

function removeFilePreview(button) {
  button.closest(".file-preview-item").remove();
  document.getElementById("transactionProof").value = "";
}

// Gestion de la fermeture des modaux
document.addEventListener("click", function (event) {
  const modals = ["transactionModal", "reportModal"];
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
