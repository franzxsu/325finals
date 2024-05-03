const nearley = require('nearley');
const fs = require('fs');

// Function to parse the input EBNF string
function parseEBNF(input) {
    try {
        parser.feed(input);
        return parser.results[0];
    } catch (error) {
        console.error('Parsing error:', error.message);
        return null;
    }
}
