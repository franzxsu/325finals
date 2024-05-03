/**
 * @param {rule}        rule       rule of which the non_terminals are taken
 * @param {language}    language.  programming language
 * this function returns an array of a given rule's non-terminal production rules.
 */
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
            const regex = new RegExp(`<${rule}>\\s*::=\\s*((?:<[^>]+>\\s*\\|?\\s*)+)[\\r\\n]+`, 'gm');

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

export function get_production_rule(rule, language) {
    //TODO
}