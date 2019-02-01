var colors = require('colors');

console.log("echo...")
//════ COLOR FORMATTING ════════════════════════════╗
var output_format = "console"
process.argv.forEach(function (val, index, array) {
  if(val=="--chrome") output_format = "chrome"
  if(val=="--console") output_format = "console"
});
console.clear()
console.log("-- Color formatting optimized for " + output_format+" --\n\n")
//══════════════════════════════════════════════════╝


//════ LOG ═════════════════════════════════════════╗

const DEF = [ "#ffffff", "#e5e5e5", "white" ]
const ERR = [ "#e5102f", "#c60320", "red"   ]
const SUC = [ "#06ad36", "#058429", "green" ]
const INF = [ "#337fcc", "#2164a8", "cyan"  ]

global.__ = function(tag, type, ...text){

   if (text.length>1){
    let first = text.shift()
    if(output_format=="chrome"){
      console.log(`%c[${tag}] %c${first}`, `color: ${type[0]}`, `color: ${type[1]}`, ...text)
    } else {
      console.log(`[${tag}]`[type[2]].bold, `${first}`[type[2]], ...text)
    }
   } else {
     if(output_format=="chrome"){
      console.log(`%c[${tag}] %c${text}`, `color: ${type[0]}`, `color: ${type[1]}`)
     } else {
      console.log(`[${tag}]`[type[2]].bold, `${text}`[type[2]])
     }
   }

}

global._e = function(tag, ...text){__(tag, ERR, ...text)}
global._d = function(tag, ...text){__(tag, DEF, ...text)}
global._s = function(tag, ...text){__(tag, SUC, ...text)}
global._i = function(tag, ...text){__(tag, INF, ...text)}
global._ = function(...text){ console.log(...text) }

//══════════════════════════════════════════════════╝