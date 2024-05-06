import { get_non_terminals, get_production_rule } from './ebnf_parser.js';
const url = window.location.pathname
console.log(window.location.pathname);

document.getElementById("addStatementBtn").addEventListener("click", function() {
    addNewStatementTable();
});

function addNewStatementTable() {
    const uniqueID = "row_" + Math.random().toString(36).substr(2, 9);
    const newRow = document.createElement('tr');
    newRow.id = uniqueID;
    const statementCell = document.createElement('td');
    statementCell.style.cursor = "pointer";
    statementCell.classList.add("statement-cell");
    const selectElement = document.createElement('select');
    selectElement.classList.add("form-select", "form-select-sm", "no-highlight", "statement-selects");
    selectElement.style.width = "auto";
    selectElement.style.cursor = "pointer";

    const defaultOption = document.createElement('option');
    defaultOption.textContent = "Select a statement";
    defaultOption.selected = true;
    selectElement.appendChild(defaultOption);
    statementCell.appendChild(selectElement);

    updateOutput();
    selectElement.addEventListener('click', function(event) {
        event.stopPropagation();
    });

    //happens when you click on an option on the drop down
    selectElement.addEventListener('change', function() {
        const selectedOption = selectElement.options[selectElement.selectedIndex].text;
        get_production_rule(selectedOption, 'ruby')
            .then(productionRule => {
                console.log(productionRule);
                const parentRow = this.closest('tr');
                const oldSubTable = parentRow.subTable;
                if (oldSubTable) {
                    oldSubTable.remove();
                }

                const subTable = addSubTable(productionRule, parentRow.id);
                parentRow.subTable = subTable; // Store the reference to the new subtable
                updateOutput();
            })
            .catch(error => {
                console.error('Error fetching production rule:', error);
            });
    });
    

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

    deleteIcon.addEventListener('click', function() {
        const rowToRemove = deleteIcon.closest('tr');
        if (rowToRemove.subTable) {
            rowToRemove.subTable.remove();
        }
        rowToRemove.remove();
        updateOutput();
    });

    newRow.appendChild(statementCell);
    newRow.appendChild(deleteCell);

    const tableBody = document.getElementById('tableBody');
    tableBody.appendChild(newRow);

    get_non_terminals("statement", url)
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

function addSubTable(rule, statementID) {
    console.log(rule);

    /// Regular expression to match strings within < > brackets
    const regex = /<([^>]*)>/g;

    // Match all occurrences of strings within < > brackets
    let match;
    while ((match = regex.exec(rule)) !== null) {
    console.log(match[0]);
    }
    
    const statementTable = document.getElementById(statementID);

    const subTableCell = document.createElement('td');
    subTableCell.colSpan = 2;

    const nestedTable = document.createElement('table');

    const nestedRow = document.createElement('tr');
    const nestedCell = document.createElement('td');
    nestedCell.textContent = rule;
    nestedRow.appendChild(nestedCell);
    nestedTable.appendChild(nestedRow);
    subTableCell.appendChild(nestedTable);

    statementTable.parentNode.insertBefore(subTableCell, statementTable.nextSibling);
    
    return subTableCell;
}

function addSubSubTable(parentTable) {

    const subSubTable = document.createElement('table');
    subSubTable.style.border = "1px solid red";

    const subSubRow = document.createElement('tr');
    const subSubCell = document.createElement('td');
    subSubCell.textContent = "Sub-Sub Table Content";
    subSubRow.appendChild(subSubCell);
    subSubTable.appendChild(subSubRow);


    const nestedRow = parentTable.querySelector('tr');
    const nestedCell = nestedRow.querySelector('td');
    nestedCell.appendChild(subSubTable);
}

function updateOutput() {
    var tdElements = document.querySelectorAll('td[colspan="2"]');
    var outputString = "";

    for (var i = 0; i < tdElements.length; i++) {
        outputString += tdElements[i].innerHTML + '<br>';
    }
    
    document.getElementById("codebase").innerHTML = outputString;
}










// WE DONT NEED THESE

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