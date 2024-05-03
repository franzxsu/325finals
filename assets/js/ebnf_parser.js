export function get_non_terminals(rule, language) {
    const filePath = `../../EBNF/${language}.ebnf`;

    return fetch(filePath)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch EBNF file');
            }
            return response.text();
        })
        .then(ebnfContent => {
            // Constructing the regular expression using RegExp constructor
            const regex = new RegExp(`<${rule}>\\s*::=\\s*((?:<[^>]+>\\s*\\|?\\s*)+)`, 'gm');
            const stmts = [];
            let match;

            while ((match = regex.exec(ebnfContent)) !== null) {
                // Extract statements from the matched group
                const statements = match[1].split('|').map(statement => statement.trim());
                stmts.push(...statements);
            }
            
            return stmts;
        })
        .catch(error => console.error('Error fetching or parsing EBNF file:', error));
}