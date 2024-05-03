document.addEventListener('DOMContentLoaded', function() {
    // Find all statement cells
    const statementCells = document.querySelectorAll('.statement-cell');
                                        
    // Add click event listener to each statement cell
    statementCells.forEach(cell => {
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
});
