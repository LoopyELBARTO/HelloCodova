document.addEventListener('deviceready', function(){
    var config = {
        type: Phaser.AUTO,
        width: 483,
        height:272,
        zoom:3,
        parent:'game',
        pixelArt:true,
        physics:{
            default:'arcade',
            arcade:{ y:0}
        },
        scene: {preload: preload,
                create: create,
                update: update
        }
    };

    var game = new Phaser.Game(config);
    var player;
    var playerVelocity = 80;
    var camera 
    var physics;   
    var backgroundBarrier;
    var wallBarrier;

    function preload() {
        //load tilesheet
        this.load.image('tiles', 'assets/maps/tileset/DungeonTileset.png');
        //load Tiled map
        this.load.tilemapTiledJSON('prototypeMap', 'assets/maps/prototype/prototype.json');
        //load player spritesheet
        this.load.spritesheet('player', 'assets/player/idle.png', {frameWidth:16, frameHeight:16});
        this.load.spritesheet('player_forward', 'assets/player/forward.png', {frameWidth:16, frameHeight:16});
        this.load.spritesheet('player_backward', 'assets/player/backward.png', {frameWidth:16, frameHeight:16});
        this.load.spritesheet('player_horizontal', 'assets/player/horizontal.png', {frameWidth:16, frameHeight:16});
    }
    
    function create() {
        window.addEventListener('resize', resize);
        resize();

        var map = this.make.tilemap({key: 'prototypeMap'});

        var backgroundTiles = map.addTilesetImage('DungeonTileset', 'tiles');
        var groundTiles = map.addTilesetImage('DungeonTileset', 'tiles');
        var boxTiles = map.addTilesetImage('DungeonTileset', 'tiles');
        var wallTiles = map.addTilesetImage('DungeonTileset', 'tiles');
        var wallBarrierTile = map.addTilesetImage('DungeonTileset', 'tiles');

        backgroundBarrier = map.createStaticLayer('Background', backgroundTiles,0,0);        
        var groundLayer = map.createStaticLayer('Ground', groundTiles, 0, 0);
        var boxLayer = map.createStaticLayer('Box', boxTiles, 0,0);
        var wallLayer = map.createStaticLayer('Walls', wallTiles, 0,0);

        wallBarrier = map.createStaticLayer('WallBarrier', wallBarrierTile,0,0);

        physics = this.physics;

        camera = this.cameras.main;
        camera.setSize(480,320);

        this.physics.world.setBounds(0,0, map.widthInPixels, map.heightInPixels);

        player = this.physics.add.sprite(50,50, 'player');
        wallBarrier.setCollision([1,2,3,9,24,25,27,49,51,55,75,76,101]);
        physics.add.collider(player, wallBarrier);
        physics.add.collider(player, backgroundBarrier);

        player.setCollideWorldBounds(true);

        camera.setBounds(0,0, map.widthInPixels, map.heightInPixels);
        camera.startFollow(player, true);

        this.anims.create({
            key: 'idle',
            frames: this.anims.generateFrameNumbers('player', { start: 0, end: 4}),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'forward',
            frames: this.anims.generateFrameNumbers('player_forward', {start: 0, end: 4}),
            frameRate:10,
            repeat: -1
        });

        this.anims.create({
            key: 'backward',
            frames: this.anims.generateFrameNumbers('player_backward', {start: 0, end: 4}),
            frameRate:10,
            repeat: -1
        });

        this.anims.create({
            key: 'walk_horizontal',
            frames: this.anims.generateFrameNumbers('player_horizontal', {start: 0, end: 4}),
            frameRate:10,
            repeat: -1
        });

        this.key_D = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.key_A = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.key_W = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.key_S = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    }
    
    function update(){
        player.setVelocity(0);

        if (this.key_D.isDown){
            player.setVelocityX(playerVelocity);
            player.anims.play('walk_horizontal', true);
            player.flipX= false;
            return
        }
        else if (this.key_A.isDown){
            player.setVelocityX(-playerVelocity);
            player.anims.play('walk_horizontal', true);
            player.flipX= true;
            return
        }
        else if (this.key_W.isDown){
            player.setVelocityY(-playerVelocity);
            player.anims.play('forward', true);
            return
        }
        else if (this.key_S.isDown){
            player.setVelocityY(playerVelocity);
            player.anims.play('backward', true);
            return
        }
        else{
            player.setVelocity(0);
            player.anims.stop();

            //player.anims.play('idle', true);
        }
    }
    function resize() {
        var canvas = game.canvas, width = window.innerWidth, height = window.innerHeight;
        var wratio = width / height, ratio = canvas.width / canvas.height;
    
        if (wratio < ratio) {
            canvas.style.width = width + "px";
            canvas.style.height = (width / ratio) + "px";
        } else {
            canvas.style.width = (height * ratio) + "px";
            canvas.style.height = height + "px";
        }
    }
});