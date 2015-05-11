# mygenerator.coffee
util = require('util')
Parser = require('jison').Parser
grammar = ''' 
%lex 
%%
\\s+         /* skip whitespace */
[a-f0-9]+    return 'HEX'
/lex

%%
s: hex_strings { console.log('attr= '+$1); return $1 }
;
hex_strings: hex_strings HEX { console.log('h -> h HEX('+$2+')'); 
                               $1.push($2); $$ = $1;
                             }
           | HEX { console.log('h -> HEX('+$1+')'); 
                   $$ = [$1]; 
                 }
;
'''
parser = new Parser grammar
# generate source, ready to be written to disk
parserSource = parser.generate()
# you can also use the parser directly from memory
args = process.argv.slice(2).join(' ')
console.log util.inspect(args)
if args.length is 0
  args = 'adfe34bc e82a'
res = parser.parse(args)
console.log util.inspect(res)
