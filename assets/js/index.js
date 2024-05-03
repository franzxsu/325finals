import { get_non_terminals } from './ebnf_parser.js';

document.addEventListener('DOMContentLoaded', function() {
  initializeStatementCells();
  initializeDeleteIcons();
  populateStatementSelect();
});

//ADD STATEMENT BUTTON
document.getElementById("addStatementBtn").addEventListener("click", function() {
    addNewStatementTable();
});

function initializeStatementCells() {
  const statementCells = document.querySelectorAll('.statement-cell');
  statementCells.forEach(cell => {
    const selectElement = cell.querySelector('select');
    selectElement.addEventListener('click', (event) => {
      event.stopPropagation();
    });

    cell.addEventListener('click', toggleCollapsibleContent.bind(null, cell));
  });
}

function toggleCollapsibleContent(cell) {
  const collapseContent = document.getElementById('collapseExample');
  collapseContent.classList.toggle('show');

  const row = cell.parentElement;
  const nextRow = row.nextElementSibling;

  if (nextRow !== collapseContent.parentElement) {
    if (collapseContent.parentElement) {
      collapseContent.parentElement.removeChild(collapseContent);
    }
    row.insertAdjacentElement('afterend', collapseContent);
  }
}

function initializeDeleteIcons() {
  const deleteIcons = document.querySelectorAll('.del-row');
  deleteIcons.forEach(icon => {
    icon.addEventListener('click', () => {
      const parentRow = icon.closest('tr');
      parentRow.remove();
    });
  });
}

function populateStatementSelect() {
  const selectElement = document.querySelector('.statement-selects');
  get_non_terminals("statement", "ruby")
    .then(statements => {
      statements.forEach(statement => {
        const option = document.createElement('option');
        option.textContent = statement;
        selectElement.appendChild(option);
      });
    })
    .catch(error => {
      console.error('Error:', error);
    });
}

function addNewStatementTable() {
    // Generate a unique ID for the new row
    const uniqueID = "row_" + Math.random().toString(36).substr(2, 9);

    // Create new table row
    const newRow = document.createElement('tr');
    newRow.id = uniqueID;

    // Create statement cell
    const statementCell = document.createElement('td');
    statementCell.style.cursor = "pointer";
    statementCell.classList.add("statement-cell");

    // Create select element
    const selectElement = document.createElement('select');
    selectElement.classList.add("form-select", "form-select-sm", "no-highlight", "statement-selects");
    selectElement.style.width = "auto";
    selectElement.style.cursor = "pointer";
    const defaultOption = document.createElement('option');
    defaultOption.textContent = "Select a statement";
    defaultOption.selected = true;
    selectElement.appendChild(defaultOption);
    statementCell.appendChild(selectElement);

    // Add event listener to statement cell for collapsible
    statementCell.addEventListener('click', toggleCollapsibleContent.bind(null, statementCell));

    // Create delete button cell
    const deleteCell = document.createElement('td');
    deleteCell.classList.add("text-center");
    const deleteButton = document.createElement('a');
    deleteButton.classList.add("del-row");
    const deleteIcon = document.createElement('i');
    deleteIcon.classList.add("fas", "fa-trash");
    deleteIcon.style.fontSize = "20px";
    deleteIcon.style.cursor = "pointer";
    deleteButton.appendChild(deleteIcon);
    deleteCell.appendChild(deleteButton);

    // Add event listener to delete icon
    deleteIcon.addEventListener('click', function() {
        const rowID = newRow.id;
        const collapsibleID = rowID + "_collapse";
        const rowToRemove = document.getElementById(rowID);
        const collapsibleToRemove = document.getElementById(collapsibleID);
        if (rowToRemove && collapsibleToRemove) {
            rowToRemove.remove();
            collapsibleToRemove.remove();
        }
    });

    // Append cells to the row
    newRow.appendChild(statementCell);
    newRow.appendChild(deleteCell);

    // Append row to table body
    const tableBody = document.getElementById('tableBody');
    tableBody.appendChild(newRow);

    // Populate select with options
    get_non_terminals("statement", "ruby")
        .then(statements => {
            statements.forEach(statement => {
                const option = document.createElement('option');
                option.textContent = statement;
                selectElement.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Error:', error);
        });

    // Create collapsible
    const collapsibleDiv = document.createElement('div');
    collapsibleDiv.id = uniqueID + "_collapse";
    collapsibleDiv.classList.add("collapse");
    collapsibleDiv.innerHTML = `
        <div class="card card-body">
            <code>
                CODE EXAMPLE
            </code>
        </div>
    `;

    // Append collapsible to COLLAPSES div
    const collapsesDiv = document.getElementById('COLLAPSES');
    collapsesDiv.appendChild(collapsibleDiv);
}
