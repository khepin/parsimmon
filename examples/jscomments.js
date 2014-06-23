var Parsimmon = require('../index')
var string = Parsimmon.string
var regex = Parsimmon.regex
var seq = Parsimmon.seq
var alt = Parsimmon.alt
var lazy = Parsimmon.lazy
var ws = Parsimmon.optWhitespace

function join(array) {
    return array.join('')
}
/**
 * Custom parser matches any character except the given one
 */
function not(char) {
    return Parsimmon.Parser(function(stream, i) {
        if (char !== stream.charAt(i)) {
            return this._.success(i+1, stream.charAt(i))
        }
        return this._.failure('not ' + char)
    })
}

var comment = lazy(function(){
    return seq(
        commentStart,
        commentContent
    ).map(join)
}).skip(ws)

var commentStart = string('/*')
var commentEnd = string('*/')

var notStar = regex(/[^*]/)
// var notStar = not('*')

var commentContent = lazy(function(){
    return seq(
        notStar.many().map(join),
        alt(
            commentEnd,
            seq(string('*'), commentContent).map(join)
        )
    ).map(join)
})


var source = process.argv[2]
var start = (new Date()).valueOf()
var result = comment.many().parse(require('fs').readFileSync(source, 'utf-8'))

var time = ((new Date()).valueOf() - start) / 1000;
console.log(time + 's')

// console.log(result)