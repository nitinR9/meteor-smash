
meteorSpace.state2 = function(){ // here 'play' is a state in this game
this.ready = false ;
} ;


meteorSpace.state2.prototype = {
    preload: function(){
        game.add.text(centerX,centerY, 'Loading', {font: '60px consolas', fill: '#fff'}).anchor.setTo(0.5) ;

        percent = game.add.text(centerX, centerY+60, '0.0%', {font: '40px consolas', fill: '#fff'}) ;
        percent.anchor.setTo(0.5) ;
        // image loading
        game.load.image('background', 'assets/img/bg2.png') ;
        game.load.image('spaceship', 'assets/img/spaceship.png') ;
        game.load.image('laser', 'assets/img/laser.png') ;
        game.load.image('meteor', 'assets/img/meteor.png') ;
        game.load.spritesheet('kaboom', 'assets/img/explode.png', 128,128) ;
        game.load.image('wall', 'assets/img/boundary.png') ;
        
        
        // buttons
        game.load.image('play', 'assets/img/playbutton.png') ;
        game.load.image('pause', 'assets/img/pausebutton.png') ;
        
        // mp3 files
        game.load.audio('expsound', 'assets/sounds/smallexplosion2.mp3' ) ;
        game.load.audio('danger', 'assets/sounds/tas_red_alert.mp3') ;     

        game.load.image('menu', 'assets/img/menubutton.png') ;
        game.load.image('restart', 'assets/img/restartbutton.png') ;

        game.load.image('startbg', 'assets/img/bg1.png') ;
        game.load.bitmapFont('font1', 'assets/fonts/bitmapFonts/desyrel.png', 'assets/fonts/bitmapFonts/desyrel.xml') ;
        game.load.bitmapFont('font2', 'assets/fonts/bitmapFonts/desyrel-pink.png', 'assets/fonts/bitmapFonts/desyrel-pink.xml') ;
        game.load.spritesheet('subtitle', 'assets/img/presstitle.png', 400, 49) ;

        game.load.audio('bgsound', 'assets/sounds/bgsound.mp3') ;

        game.load.onLoadComplete.add(this.loadComplete, this) ;

    },
    loadUpdate: function(){
        percent.text = `${((game.load.progressFloat).toFixed(1))}%` ;
    },
    loadComplete: function(){
        this.ready = true ;
    },
    update: function(){
        if(this.ready && game.cache.isSoundDecoded('expsound') && game.cache.isSoundDecoded('danger') && game.cache.isSoundDecoded('bgsound')){
            game.time.events.add(Phaser.Timer.SECOND, function(){
               game.state.start('state3') ;
            },this) ;
         }
    }
} ;
