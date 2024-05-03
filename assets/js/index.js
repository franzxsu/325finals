import { get_non_terminals } from './ebnf_parser.js';

document.addEventListener('DOMContentLoaded', function() {
        // Find all statement cells
        const statementCells = document.querySelectorAll('.statement-cell');

        // Add click event listener to each statement cell
        statementCells.forEach(cell => {
            // Find the select element inside the statement cell
            const selectElement = cell.querySelector('select');

            // Add click event listener to the select element
            selectElement.addEventListener('click', function(event) {
                // Prevent the default behavior of the click event
                event.stopPropagation();
            });

            // Add click event listener to the statement cell
            cell.addEventListener('click', function() {
                // Find the collapsible content
                const collapseContent = document.getElementById('collapseExample');

                // Toggle collapse state
                if (collapseContent.classList.contains('show')) {
                    collapseContent.classList.remove('show');
                } else {
                    collapseContent.classList.add('show');
                }

                // If collapseContent is not already appended, append it just below the clicked table row
                if (!collapseContent.parentElement || collapseContent.parentElement !== cell.parentElement.nextElementSibling) {
                    // Remove the collapsible content from its current parent
                    if (collapseContent.parentElement) {
                        collapseContent.parentElement.removeChild(collapseContent);
                    }

                    // Append collapsible content just below the clicked table row
                    const row = cell.parentElement;
                    row.insertAdjacentElement('afterend', collapseContent);
                }
            });
        });


        // DELETE ICON
            const deleteIcons = document.querySelectorAll('.del-row');

            // Add click event listener to each delete icon
            deleteIcons.forEach(icon => {
                icon.addEventListener('click', function() {
                    // Find the parent <tr> element and remove it
                    const parentRow = icon.closest('tr');
                    parentRow.remove();
                });
            });

            console.log(get_non_terminals("statement", "ruby"));
    });

