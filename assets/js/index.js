import { get_non_terminals, get_production_rule } from './ebnf_parser.js';

document.addEventListener('DOMContentLoaded', function() {

});

//ADD STATEMENT BUTTON
document.getElementById("addStatementBtn").addEventListener("click", function() {
    addNewStatementTable();
});

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

    //remove event listener on select
    selectElement.addEventListener('click', function(event) {
        event.stopPropagation();
      });

    //event listener on select
    selectElement.addEventListener('change', function() {
        const rowID = newRow.id;
        const collapsibleID = `${rowID}_collapsible`;
        const collapsibleElement = document.getElementById(collapsibleID);
        const selectedOption = selectElement.options[selectElement.selectedIndex].text;
      
        if (collapsibleElement) {
          get_production_rule(selectedOption, 'ruby')
            .then(productionRule => {
              collapsibleElement.querySelector('td').innerText = ' ' + productionRule + ' ';
            })
            .catch(error => {
              console.error('Error fetching production rule:', error);
            });
        }
      });

    // Add event listener to statement cell for collapsible
    statementCell.addEventListener('click', function() {
      toggleCollapsibleContent(newRow.id);
      console.log("asd");
    });
  
    // Create delete button cell
    const deleteCell = document.createElement('td');
    deleteCell.classList.add("text-center");
    const deleteButton = document.createElement('a');
    deleteButton.classList.add("del-row");
    const deleteIcon = document.createElement('i');
    deleteIcon.classList.add("fas", "fa-trash", "text-danger");
    deleteIcon.style.fontSize = "20px";
    deleteIcon.style.cursor = "pointer";
    deleteButton.appendChild(deleteIcon);
    deleteCell.appendChild(deleteButton);
  
    // Add event listener to delete icon
    deleteIcon.addEventListener('click', function() {
      const rowToRemove = deleteIcon.closest('tr');
      const rowID = rowToRemove.id;
      const collapsibleID = `${rowID}_collapsible`;
      const collapsibleElement = document.getElementById(collapsibleID);
  
      if (collapsibleElement) {
        collapsibleElement.remove();
      }
  
      rowToRemove.remove();
    });
  
    // Append cells to the row
    newRow.appendChild(statementCell);
    newRow.appendChild(deleteCell);
  
    // Append row to table body
    const tableBody = document.getElementById('tableBody');
    tableBody.appendChild(newRow);
  
    // Create collapsible element if it doesn't exist
    const collapsible = newRow.nextElementSibling;
    if (!collapsible || !collapsible.classList.contains('collapsible')) {
      createCollapsible(uniqueID);
    }
  
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
  }
  
  function toggleCollapsibleContent(id) {
    const collapsibleID = `${id}_collapsible`;
    const collapsibleElement = document.getElementById(collapsibleID);
  
    if (collapsibleElement) {
      if (collapsibleElement.style.display === 'none') {
        collapsibleElement.style.display = 'table-row';
      } else {
        collapsibleElement.style.display = 'none';
      }
    }
  }
  
  function createCollapsible(uniqueID) {
    const row = document.getElementById(uniqueID);
    const collapsible = document.createElement('tr');
    collapsible.id = `${uniqueID}_collapsible`;
    collapsible.classList.add('collapsible', 'bg-dark');
    collapsible.style.display = 'none';
    const cell = document.createElement('td');
    cell.colSpan = row.cells.length;
    cell.innerHTML = '<code>' + '//please choose a statement...' + '</code>';
    collapsible.appendChild(cell);
    row.parentNode.insertBefore(collapsible, row.nextSibling);
  }

function updateOutput(){
    //todo
}