// form-builder.js - Gestion du constructeur de formulaires

let currentForm = {
  name: "Nouveau Formulaire",
  description: "Description du formulaire",
  service: "",
  fields: [],
};

let selectedField = null;

document.addEventListener("DOMContentLoaded", function () {
    
  initializeFormBuilder();
  
});

function initializeFormBuilder() {
  console.log("Initialisation du constructeur de formulaires...");

  // Initialisation du drag and drop
  initializeDragAndDrop();

  // Chargement des formulaires existants
  loadExistingForms();
}

function initializeDragAndDrop() {
  const fieldTypes = document.querySelectorAll(".field-type");
  const formContainer = document.getElementById("formFieldsContainer");

  // Événements pour les éléments draggables
  fieldTypes.forEach((field) => {
    field.addEventListener("dragstart", handleDragStart);
  });

  // Événements pour la zone de dépôt
  formContainer.addEventListener("dragover", handleDragOver);
  formContainer.addEventListener("drop", handleDrop);
  formContainer.addEventListener("dragenter", handleDragEnter);
  formContainer.addEventListener("dragleave", handleDragLeave);
}

function handleDragStart(e) {
  e.dataTransfer.setData("text/plain", e.target.getAttribute("data-type"));
  e.target.classList.add("dragging");
}

function handleDragOver(e) {
  e.preventDefault();
  e.dataTransfer.dropEffect = "copy";
}

function handleDragEnter(e) {
  e.preventDefault();
  e.target.classList.add("drag-over");
}

function handleDragLeave(e) {
  e.preventDefault();
  e.target.classList.remove("drag-over");
}

function handleDrop(e) {
  e.preventDefault();
  e.target.classList.remove("drag-over");

  const fieldType = e.dataTransfer.getData("text/plain");
  addFieldToForm(fieldType, e.clientX, e.clientY);

  // Retirer la classe dragging
  document.querySelectorAll(".field-type").forEach((field) => {
    field.classList.remove("dragging");
  });
}

function addFieldToForm(fieldType, x, y) {
  console.log(`Ajout du champ: ${fieldType}`);

  const fieldId = "field_" + Date.now();
  const field = {
    id: fieldId,
    type: fieldType,
    label: "Nouveau Champ",
    required: false,
    placeholder: "",
    options: [],
  };

  currentForm.fields.push(field);
  renderField(field);
  updateFormPreview();
}

function renderField(field) {
  const container = document.getElementById("formFieldsContainer");

  // Supprimer l'état vide s'il existe
  const emptyState = container.querySelector(".empty-state");
  if (emptyState) {
    emptyState.remove();
  }

  const fieldElement = document.createElement("div");
  fieldElement.className = "form-field";
  fieldElement.setAttribute("data-field-id", field.id);

  let fieldHTML = "";

  switch (field.type) {
    case "text":
      fieldHTML = `
                <div class="field-header">
                    <span class="field-label">${field.label}</span>
                    <div class="field-actions">
                        <button class="btn-icon btn-edit" onclick="editField('${field.id}')">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-icon btn-delete" onclick="removeField('${field.id}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                <input type="text" class="field-control" placeholder="${field.placeholder}">
            `;
      break;

    case "number":
      fieldHTML = `
                <div class="field-header">
                    <span class="field-label">${field.label}</span>
                    <div class="field-actions">
                        <button class="btn-icon btn-edit" onclick="editField('${field.id}')">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-icon btn-delete" onclick="removeField('${field.id}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                <input type="number" class="field-control" placeholder="${field.placeholder}">
            `;
      break;

    case "select":
      fieldHTML = `
                <div class="field-header">
                    <span class="field-label">${field.label}</span>
                    <div class="field-actions">
                        <button class="btn-icon btn-edit" onclick="editField('${field.id}')">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-icon btn-delete" onclick="removeField('${field.id}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                <select class="field-control">
                    <option value="">Sélectionnez une option</option>
                </select>
            `;
      break;

    default:
      fieldHTML = `
                <div class="field-header">
                    <span class="field-label">${field.label}</span>
                    <div class="field-actions">
                        <button class="btn-icon btn-edit" onclick="editField('${field.id}')">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-icon btn-delete" onclick="removeField('${field.id}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                <input type="text" class="field-control" placeholder="${field.placeholder}">
            `;
  }

  fieldElement.innerHTML = fieldHTML;
  fieldElement.addEventListener("click", () => selectField(field.id));
  container.appendChild(fieldElement);
}

function selectField(fieldId) {
  // Désélectionner tous les champs
  document.querySelectorAll(".form-field").forEach((field) => {
    field.classList.remove("selected");
  });

  // Sélectionner le champ cliqué
  const fieldElement = document.querySelector(`[data-field-id="${fieldId}"]`);
  if (fieldElement) {
    fieldElement.classList.add("selected");
    selectedField = currentForm.fields.find((f) => f.id === fieldId);
    showFieldProperties(selectedField);
  }
}

function showFieldProperties(field) {
  const propertiesContent = document.getElementById("propertiesContent");

  let propertiesHTML = `
        <div class="property-group">
            <h4>Propriétés du Champ</h4>
            <div class="property-item">
                <label for="fieldLabel">Label</label>
                <input type="text" id="fieldLabel" value="${
                  field.label
                }" onchange="updateFieldProperty('label', this.value)">
            </div>
            <div class="property-item">
                <label for="fieldPlaceholder">Placeholder</label>
                <input type="text" id="fieldPlaceholder" value="${
                  field.placeholder
                }" onchange="updateFieldProperty('placeholder', this.value)">
            </div>
            <div class="property-item">
                <label>
                    <input type="checkbox" ${
                      field.required ? "checked" : ""
                    } onchange="updateFieldProperty('required', this.checked)">
                    Champ obligatoire
                </label>
            </div>
        </div>
    `;

  if (field.type === "select") {
    propertiesHTML += `
            <div class="property-group">
                <h4>Options de la Liste</h4>
                <div class="field-options" id="fieldOptions">
                    ${field.options
                      .map(
                        (option, index) => `
                        <div class="option-item">
                            <input type="text" value="${option}" onchange="updateFieldOption(${index}, this.value)">
                            <button class="btn-icon btn-delete" onclick="removeFieldOption(${index})">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                    `
                      )
                      .join("")}
                </div>
                <button class="btn btn-outline" onclick="addFieldOption()" style="margin-top: 10px;">
                    <i class="fas fa-plus"></i> Ajouter une option
                </button>
            </div>
        `;
  }

  propertiesContent.innerHTML = propertiesHTML;
}

function updateFieldProperty(property, value) {
  if (selectedField) {
    selectedField[property] = value;
    updateFieldDisplay(selectedField.id);
  }
}

function updateFieldDisplay(fieldId) {
  const fieldElement = document.querySelector(`[data-field-id="${fieldId}"]`);
  const field = currentForm.fields.find((f) => f.id === fieldId);

  if (fieldElement && field) {
    const labelElement = fieldElement.querySelector(".field-label");
    if (labelElement) {
      labelElement.textContent = field.label;
      if (field.required) {
        labelElement.innerHTML =
          field.label + '<span class="field-required">*</span>';
      }
    }

    const inputElement = fieldElement.querySelector(".field-control");
    if (inputElement && field.placeholder) {
      inputElement.placeholder = field.placeholder;
    }
  }
}

function removeField(fieldId) {
  if (confirm("Voulez-vous vraiment supprimer ce champ ?")) {
    currentForm.fields = currentForm.fields.filter((f) => f.id !== fieldId);
    const fieldElement = document.querySelector(`[data-field-id="${fieldId}"]`);
    if (fieldElement) {
      fieldElement.remove();
    }

    // Réinitialiser les propriétés
    document.getElementById("propertiesContent").innerHTML = `
            <div class="empty-properties">
                <i class="fas fa-mouse-pointer"></i>
                <p>Sélectionnez un champ pour voir ses propriétés</p>
            </div>
        `;

    // Afficher l'état vide si plus de champs
    if (currentForm.fields.length === 0) {
      showEmptyState();
    }
  }
}

function showEmptyState() {
  const container = document.getElementById("formFieldsContainer");
  container.innerHTML = `
        <div class="empty-state">
            <i class="fas fa-magic"></i>
            <h4>Commencez à construire votre formulaire</h4>
            <p>Glissez-déposez des champs depuis le panneau de gauche</p>
        </div>
    `;
}

function updateFormPreview() {
  document.getElementById("formTitle").textContent = currentForm.name;
  document.getElementById("formDescription").textContent =
    currentForm.description;
}

// Fonctions modales
function openFormModal() {
  document.getElementById("formModal").classList.add("show");
}

function closeFormModal() {
  document.getElementById("formModal").classList.remove("show");
}

function createNewForm() {
  const formName = document.getElementById("formName").value;
  const formService = document.getElementById("formService").value;
  const formDescription = document.getElementById("formDescription").value;

  if (formName && formService) {
    currentForm = {
      name: formName,
      description: formDescription,
      service: formService,
      fields: [],
    };

    updateFormPreview();
    closeFormModal();
    showEmptyState();

    alert("Formulaire créé avec succès !");
  } else {
    alert("Veuillez remplir tous les champs obligatoires.");
  }
}

function saveForm() {
  if (currentForm.fields.length === 0) {
    alert("Veuillez ajouter au moins un champ au formulaire.");
    return;
  }

  console.log("Formulaire sauvegardé:", currentForm);
  alert("Formulaire sauvegardé avec succès !");

  // Ici, vous enverriez les données au backend
  // saveFormToBackend(currentForm);
}

function loadExistingForms() {
  // Simulation du chargement des formulaires existants
  console.log("Chargement des formulaires existants...");
}

// Gestion des options pour les listes déroulantes
function addFieldOption() {
  if (selectedField && selectedField.type === "select") {
    selectedField.options.push("Nouvelle option");
    showFieldProperties(selectedField);
  }
}

function updateFieldOption(index, value) {
  if (selectedField && selectedField.type === "select") {
    selectedField.options[index] = value;
  }
}

function removeFieldOption(index) {
  if (selectedField && selectedField.type === "select") {
    selectedField.options.splice(index, 1);
    showFieldProperties(selectedField);
  }
}

// Fermer le modal en cliquant à l'extérieur
document.addEventListener("click", function (event) {
  const modal = document.getElementById("formModal");
  if (event.target === modal) {
    closeFormModal();
  }
});

// Fermer le modal avec la touche Échap
document.addEventListener("keydown", function (event) {
  if (event.key === "Escape") {
    closeFormModal();
  }
});
