
setTimeout(function(){
   var div = document.getElementById('invisible') ;
   div.style.display = 'none' ;
}, 100) ;

let game = new Phaser.Game(800, 580, Phaser.AUTO) ;
game.state.add('state1', meteorSpace.state1) ;
game.state.add('state2', meteorSpace.state2) ;
game.state.add('state3', meteorSpace.state3) ;
game.state.add('state4', meteorSpace.state4) ;
game.state.add('state5', meteorSpace.state5) ;

game.state.start('state1') ;


