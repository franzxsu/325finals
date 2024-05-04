import { get_non_terminals, get_production_rule } from './ebnf_parser.js';

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
    updateOutput()
    //remove event listener on select
    selectElement.addEventListener('click', function(event) {
        event.stopPropagation();
      });

    //event listener on select
    selectElement.addEventListener('click', function() {

        const rowID = newRow.id;
        const collapsibleID = `${rowID}_collapsible`;
        const collapsibleElement = document.getElementById(collapsibleID);
        const selectedOption = selectElement.options[selectElement.selectedIndex].text;
      
        if (collapsibleElement) {
          get_production_rule(selectedOption, 'ruby')
            .then(productionRule => {
              collapsibleElement.querySelector('td').innerText = ' ' + productionRule + ' ';
              updateOutput()
            })
            .catch(error => {
              console.error('Error fetching production rule:', error);
            });
        }
        
      });
    // Add event listener to statement cell for collapsible
    statementCell.addEventListener('click', function() {
        // Toggle collapsible content
        toggleCollapsibleContent(newRow.id);
        
        // Log newRow.id to console
        console.log(newRow.id);
        
        // Get the modified ID with '_collapsible'
        var collapsibleId = newRow.id + '_collapsible';
        
        // Find the first element with the modified ID
        var collapsibleElement = document.getElementById(collapsibleId);
        
        // Check if the collapsible element exists
        if (collapsibleElement) {
            // Find the td element with colspan="2" inside the collapsible element
            var tdElement = collapsibleElement.querySelector('td[colspan="2"]');
            
            // Check if the td element exists
            if (tdElement) {
                // Get the innerHTML value of the td element
                var innerHTMLValue = tdElement.innerHTML;
                
                // Print the innerHTML value
                console.log(innerHTMLValue);
                updateStructBuilder(newRow.id, innerHTMLValue);
            }
        }
        updateOutput();
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
      updateOutput();

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
    updateOutput()
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
    cell.innerHTML = '//please choose a statement...';
    collapsible.appendChild(cell);
    row.parentNode.insertBefore(collapsible, row.nextSibling);
    updateOutput()
  }

function updateOutput() {
    var tdElements = document.querySelectorAll('td[colspan="2"]');
    var outputString = "";

    for (var i = 0; i < tdElements.length; i++) {
        outputString += tdElements[i].innerHTML + '<br>';
    }
    
    document.getElementById("codebase").innerHTML = outputString;
}


function updateStructBuilder(id, string) {
    let tempIndex = 0;
    const body = document.getElementById('structInputBox');
    const regex = /&lt;([^&]+)&gt;/g;
    body.innerHTML = string.replace(regex, (_, capturedString) => {
        const index = tempIndex++;
        return `<input type="text" placeholder="${capturedString}" class="form-control-sm" data-index=${index} style="width: auto;" data-expression="${capturedString}" id="${id}"/>`;
    });
}



document.getElementById('saveStructBtn').addEventListener('click', function(){
    let updatesArray = [];
    const inputs = document.querySelectorAll('#structInputBox input[type="text"]');
    inputs.forEach(input => {
        const id = input.getAttribute('id');
        const capturedString = input.getAttribute('data-expression');
        const index = input.getAttribute('data-index');
        const value = input.value;
        console.log(`ID: ${id}, Captured String: ${capturedString}, Index: ${index}, Value: ${value}`);

        updatesArray.push({ id, index, capturedString, value });
    });

    console.log(updatesArray)
    update_tabled(updatesArray);
    
});
function update_tabled(updatesArray) {

    let tdToReplace = document.querySelector('#' + updatesArray[0].id + '_collapsible td');
    let htmlContent = tdToReplace.innerHTML;

    console.log(htmlContent)
    function replacePlaceholders(content, updatesArray) {
        let regex = /&lt;([^&]+)&gt;/g;
        let counter = 0;
        let replacedContent = content.replace(regex, function(match, placeholder) {
            let value = updatesArray[counter].value;
            counter++;
            return value;
        });
        console.log(replacedContent)
        return replacedContent;
    }
    let replacedHtmlContent = replacePlaceholders(htmlContent, updatesArray);
    tdToReplace.innerHTML = replacedHtmlContent;

    updateOutput()
}















