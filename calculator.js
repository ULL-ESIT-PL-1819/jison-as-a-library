// mygenerator.js
var util = require('util');
var Parser = require("jison").Parser;

var grammar = {
    "tokens": ['NUMBER', 'PI', 'E'],
    "lex": {
        "rules": [
           ["\\s+",                    "/* skip whitespace */"],
           ["[0-9]+(?:\\.[0-9]+)?\\b", "return 'NUMBER';"],
           ["\\*",                     "return '*';"],
           ["\\/",                     "return '/';"],
           ["-",                       "return '-';"],
           ["\\+",                     "return '+';"],
           ["\\^",                     "return '^';"],
           ["\\(",                     "return '(';"],
           ["\\)",                     "return ')';"],
           ["PI\\b",                   "return 'PI';"],
           ["E\\b",                    "return 'E';"],
           ["$",                       "return 'EOF';"]
        ]
    },

    "operators": [
        ["left", "+", "-"],
        ["left", "*", "/"],
        ["left", "^"],
        ["left", "UMINUS"]
    ],

    "bnf": {
        "expressions" :[[ "e EOF",   "console.log($1); return $1;"  ]],

        "e" :[[ "e + e",   "$$ = $1 + $3;" ],
              [ "e - e",   "$$ = $1 - $3;" ],
              [ "e * e",   "$$ = $1 * $3;" ],
              [ "e / e",   "$$ = $1 / $3;" ],
              [ "e ^ e",   "$$ = Math.pow($1, $3);" ],
              [ "- e",     "$$ = -$2;", {"prec": "UMINUS"} ],
              [ "( e )",   "$$ = $2;" ],
              [ "NUMBER",  "$$ = Number(yytext);" ],
              [ "E",       "$$ = Math.E;" ],
              [ "PI",      "$$ = Math.PI;" ]]
    }
}

var parser = new Parser(grammar);

// generate source, ready to be written to disk
var parserSource = parser.generate();

// you can also use the parser directly from memory

var args = process.argv.slice(2).join(' ');
console.log(util.inspect(args));
if (args.length == 0) args = '2+3*4';
var res = parser.parse(args);
console.log(util.inspect(res));

