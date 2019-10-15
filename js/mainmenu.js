
meteorSpace.state3 = function(){ // here 'play' is a state in this game

} ;

let text1, text2, text3, backsound ;

meteorSpace.state3.prototype = {
    
    create: function(){
        game.add.image(0,0,'startbg') ;

        text1 = game.add.bitmapText(centerX, centerY, 'font1','METEOR SMASH',84);
        text1.anchor.set(0.5,0.5) ;

        text2 = game.add.bitmapText(centerX+200, centerY+50, 'font2','A space Arcade Game',24);
        text2.anchor.set(0.5,0.5) ;

        text3 = game.add.sprite(centerX, centerY+100, 'subtitle') ;
        text3.anchor.set(0.5,0.5) ;
        text3.animations.add('blink', [0,1,2,3,4,5,6,7]) ;
        text3.animations.play('blink', 5, true) ;

        backsound = game.add.audio('bgsound', 0.5, true) ;
        backsound.play() ;

        console.log('state2') ;
        
    },
    update: function(){
        if(game.input.keyboard.isDown(Phaser.Keyboard.ENTER)){
            backsound.stop() ;
            game.state.start('state4') ;
            backsound.destroy() ;
            text1.destroy() ;
            text2.destroy() ;
            text3.destroy() ;
        }
    }
} ;

