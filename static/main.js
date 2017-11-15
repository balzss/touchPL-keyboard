var ast = acorn.parse(`
    for (var i = 1; i <= 100; i++) {
    var expletive = '';
    if (i % 5 === 0) expletive += 'Buzz';
    console.log(expletive || i);
}

        if (i % 3 === 0) {
expletive += 'Fizz';
expletive += 'Fizz';
expletive += 'Fizz';
        } else {
            i++;
        }
function asd(a, b){
    return a + b;
}

while(true){
    console.log(asd);
}
    `);



Vue.component('Code', {
    props: ['ast'],
    template: 
        '<div class="foldable" >' +
            '<div v-if="ast.body && ast.body.type == \'BlockStatement\'">' +
                '<div v-if="open" @click="open = false">{{this.getCode(2)}}</div>' +
                '<div v-else>' +
                    '<div @click="open = true">{{this.getCode(1)}}</div>' +
                    '<Code v-for="i in ast.body.body" :ast="i"/>}' +
                '</div>' +
            '</div>' +
            '<div v-else-if="ast.consequent && ast.consequent.type == \'BlockStatement\' ">' +
                '<div v-if="open" @click="open = false">{{this.getCode(2)}}</div>' +
                '<div v-else>' +
                    '<div @click="open = true">{{this.getCode(1)}}</div>' +
                    '<Code v-for="i in ast.consequent.body" :ast="i"/>' +
                    '} <span v-if="ast.alternate">else {</span>' +
            '<div v-if="ast.alternate && ast.alternate.type == \'BlockStatement\' ">' +
                        '<Code v-for="i in ast.alternate.body" :ast="i"/>}' +
                    '</div>' +
                '</div>' +
            '</div>' +
            '<div v-else>' +
                '<div>{{getCode(0)}}</div>' +
            '</div>' +
        '</div>',
    data: function() {
        return {
            open: false
        }
    },
    methods: {
        getCode: function(folded){
            var fromAst = { 
                type: "Program", 
                body: [this.ast], 
                sourceType: "script" 
            }
            if(folded == 1){
                return astring.generate(fromAst).split('{')[0] + '{';
            } else if (folded == 2){
                return astring.generate(fromAst).split('{')[0] + '{ ... }';
            } else {
                return astring.generate(fromAst);
            }
        }
    }
});

Vue.component('App', {
    props: ['body'],
    template: '<div id="app">' +
                '<Code v-for="i in body" :ast="i"/>' +
            '</div>'
});

var app = new Vue({
    el: '#app',
    template: '<App :body="this.ast"/>',
    data: {
        ast: ast.body
    }
});
