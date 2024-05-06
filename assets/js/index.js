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
                const oldSubTables = parentRow.subTables;
                if (oldSubTables) {
                    oldSubTables.forEach(subTable => {
                        subTable.remove(); // Remove each subtable cell individually
                    });
                }
    
                const subTables = addSubTables(productionRule, parentRow.id);
                parentRow.subTables = subTables; // Store the reference to the new subtables
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
        const subTablesToRemove = rowToRemove.subTables; // Get the array of subtables associated with the row
        if (subTablesToRemove) {
            subTablesToRemove.forEach(subTable => {
                subTable.remove(); // Remove each subtable associated with the row
            });
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

function addSubTables(rule, statementID) {
    const statementTable = document.getElementById(statementID);
    const subtables = [];
    const subTableCell = document.createElement('td');
    subTableCell.colSpan = 2;

    const nestedTable = document.createElement('table');

    // Split the rule text into segments separated by newline characters
    const segments = rule.split(/\\n/);

    // Iterate through each segment
    segments.forEach(segment => {
        const nestedRow = document.createElement('tr');
        const nestedCell = document.createElement('td');

        // Use regular expression to identify placeholders enclosed within angle brackets
        const regex = /<([A-Za-z0-9]+)>/g;
        let lastIndex = 0;
        let match;

        function createInputField(placeholderName) {
            // Create the appropriate input field based on whether the placeholder is a terminal
            if (isTerminal(placeholderName)) {
                const inputField = document.createElement('input');
                inputField.type = 'text';
                inputField.placeholder = placeholderName;
                return inputField;
            } else {
                // If the placeholder is not a terminal, create a dropdown
                const selectField = document.createElement('select');
                get_non_terminals(placeholderName, url)
                    .then(choices => {
                        choices.forEach(choice => {
                            const option = document.createElement('option');
                            option.textContent = choice;
                            selectField.appendChild(option);
                        });
                    })
                    .catch(error => {
                        console.error('Error fetching choices:', error);
                    });
            
                selectField.selectedIndex = 0;
                return selectField;
            }
        }
        
        while ((match = regex.exec(segment)) !== null) {
            // Create a text node for the plaintext text before the placeholder
            const textBefore = segment.substring(lastIndex, match.index);
            if (textBefore) {
                nestedCell.appendChild(document.createTextNode(textBefore));
            }
        
            // Extract the placeholder without angle brackets
            const placeholderName = match[1];
        
            // Create the appropriate input field
            const inputField = createInputField(placeholderName);
        
            // Append input field to the cell
            nestedCell.appendChild(inputField);
        
            lastIndex = regex.lastIndex;
        }

        const textAfter = segment.substring(lastIndex);
        if (textAfter) {
            nestedCell.appendChild(document.createTextNode(textAfter));
        }

        nestedRow.appendChild(nestedCell);
        nestedTable.appendChild(nestedRow);
    });

    subTableCell.appendChild(nestedTable);
    statementTable.parentNode.insertBefore(subTableCell, statementTable.nextSibling);

    subtables.push(subTableCell);
    return subtables;
}


function isTerminal(rule) {
    const terminals = ['filename', 'identifier', 'condition'];
    return terminals.includes(rule);
}


// function addSubTables(rule, statementID) {
//     console.log(rule);
//     const subtables = [];
//     const regex = /(?:^|>)([^<]*<([^>]*)>)/g;

//     const statementTable = document.getElementById(statementID);
//     let match;
//     while ((match = regex.exec(rule)) !== null) {
//         const x = match[1]; // Use match[1] to capture the substring excluding the < and >
//         const newRow = document.createElement('tr');
//         const subTableCell = document.createElement('td');
//         subTableCell.colSpan = 2;
//         const nestedTable = document.createElement('table');
//         const nestedRow = document.createElement('tr');
//         const nestedCell = document.createElement('td');
//         nestedCell.textContent = x;
//         nestedRow.appendChild(nestedCell);
//         nestedTable.appendChild(nestedRow);
//         subTableCell.appendChild(nestedTable);
//         newRow.appendChild(subTableCell);
//         statementTable.parentNode.insertBefore(newRow, statementTable.nextSibling);
//         subtables.push(newRow);
//     }
//     return subtables;
// }


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