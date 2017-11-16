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
    props: ['ast', 'hl'],
    template: 
        '<div class="foldable" :class="{hl: hl}" @keydown.enter="this.fold()">' +
            '<div v-if="ast.body && ast.body.type == \'BlockStatement\'">' +
                '<div v-if="open" @click="open = false">{{this.getCode(2)}}</div>' +
                '<div v-else>' +
                    '<div @click="open = true">{{this.getCode(1)}}</div>' +
                    '<Code v-for="i in ast.body.body" :ast="i"/>}' +
                '</div>' +
            '</div>' +
            '<div v-else-if="ast.consequent && ast.consequent.type == \'BlockStatement\' ">' +
                '<div v-if="open" @click="open = false">{{this.getCode(2)}}<span v-if="ast.alternate"> else { ... }</span></div>' +
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
    created: function () {
        document.addEventListener('keyup', function(e){
            console.log(e);
            this.open = !this.open;
        });
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
        },
        fold: function(e){
            let key = e.which || e.keyCode;
            if (e.keyCode  == 13) { // 13 is enter
                this.open = !this.open;
            }
        }
    }
});

Vue.component('App', {
    props: ['body'],
    template: '<div id="app" >' +
                '<Code v-for="(i, index) in body" :ast="i" :hl="index == cursor"/>' +
            '</div>',
    data: function() {
        return {
            cursor: 0
        }
    },
    created: function () {
        window.addEventListener('keyup', this.keypress)
    },
    methods: {
        keypress: function(e){
            let key = e.which || e.keyCode;
            if (key === 74 && this.cursor < this.body.length - 1) { // 13 is enter
                this.cursor++;
            } else if (key == 75 && this.cursor > 0) {
                this.cursor--;
            }
        }
    }
});

var app = new Vue({
    el: '#app',
    template: '<App :body="this.ast"/>',
    data: {
        ast: ast.body
    }
});
