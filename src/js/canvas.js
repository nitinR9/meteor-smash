var width = 800 ;
var height = 600 ;

setTimeout(function(){
   var div = document.getElementById('invisible') ;
   div.style.display = 'none' ;
}, 100) ;

var game = new Phaser.Game(width, height, Phaser.CANVAS) ;
game.state.add('state1', meteorspace.state1) ;
game.state.add('state2', meteorspace.state2) ;
game.state.add('state3', meteorspace.state3) ;
game.state.add('state4', meteorspace.state4) ;
game.state.add('state5', meteorspace.state5) ;

game.state.start('state1') ;