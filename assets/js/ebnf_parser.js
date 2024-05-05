/**
 * @param {rule}        rule       rule of which the non_terminals are taken
 * @param {language}    language.  programming language
 * this function returns an array of a given rule's non-terminal production rules.
 */
export function get_non_terminals(rule, language) {

    if(language=="/index.html"){
        language = "ruby"
    }
    else if(language=="/julia.html"){
        language = "julia"
    }
    else if(language=="/r.html"){
        language = "r"
    }
    else{
        console.error(`EBNF FOR ${language} NOT FOUND`);
        language = NaN
    }

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

/**
 * @param {rule} rule
 * @param {language} language
 * This function returns the production rule string for a given rule
 */
export function get_production_rule(rule, language) {
    const filePath = `../../EBNF/${language}.ebnf`;
    return fetch(filePath)
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch EBNF file');
        }
        return response.text();
      })
      .then(ebnfContent => {
        const regex = new RegExp(`${rule}\\s*::=(.*?)(?=[\\r\\n]|$)`, 'gm');
        const match = regex.exec(ebnfContent);
        if (match) {
          return match[1].trim();
        } else {
          throw new Error(`Rule <${rule}> not found in EBNF file`);
        }
      })
      .catch(error => console.error('Error fetching or parsing EBNF file:', error));
  }