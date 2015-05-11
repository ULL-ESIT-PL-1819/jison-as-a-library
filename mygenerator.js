// mygenerator.js
var util = require('util');
var Parser = require("jison").Parser;

var grammar = {
    "tokens" : [ 'HEX' ],
    "lex": {
        "rules": [
           ["\\s+", "/* skip whitespace */"],
           ["[a-f0-9]+", function() { return 'HEX'; }]
        ]
    },

    "bnf": {
        "s": [["hex_strings", "console.log('attr= '+($1)); return $1" ]],
        "hex_strings": [ [ "hex_strings HEX",  "                                   "+
                                               " console.log('h -> h HEX('+$2+')');"+
                                               " $1.push($2);                      "+
                                               " $$ = $1;                          "
                         ],
                         ["HEX", "console.log('h -> HEX('+$1+')'); $$ = [$1];" ] 
                       ]
    },
    "startSymbol" : 's'
};

var parser = new Parser(grammar);

// generate source, ready to be written to disk
var parserSource = parser.generate();

// you can also use the parser directly from memory

var args = process.argv.slice(2).join(' ');
console.log(util.inspect(args));
if (args.length == 0) args = 'adfe34bc e82a';
var res = parser.parse(args);
console.log(util.inspect(res));

