const gamePlay = {
    key: 'gamePlay',
    preload(){
        this.load.image('map','static/img/map.png' )
        this.load.image('wall','static/img/x.png' )
        this.load.spritesheet('personIdle', 'static/img/player2.png', { frameWidth: 34, frameHeight: 51, } )
        this.load.spritesheet('personRun', 'static/img/player2.png', { frameWidth: 34, frameHeight: 51, } )
        this.load.spritesheet('personJump', 'static/img/player2.png', { frameWidth: 34, frameHeight: 51, } )
        this.load.spritesheet('personFall', 'static/img/player2.png', { frameWidth: 34, frameHeight: 51, } )
        this.load.spritesheet('personJumpDash', 'static/img/player2.png', { frameWidth: 34, frameHeight: 51, } )
        this.load.spritesheet('projectileImg', 'static/img/balls.png', { frameWidth: 99, frameHeight: 47, } )
    },
    create(){
        let This = this
        console.log(this)
    /*=== world ===*/
        const { x:bx, y:by, width:bw, height:bh, } = data.world.bounce
        this.physics.world.setBounds(0, 0, bw, bh);


    /*=== groups ===*/
        this.enemies = this.add.group();
        this.walls = this.add.group();
        this.projectiles = this.add.group();


    /*=== map ===*/
    // this.map = this.add.sprite(cw/2, ch/2, 'map')
        this.map = this.add.image(0, 0, 'map')
        this.map.setScale(2)
        this.map.setOrigin(0,0)

    /*=== animations ===*/
        let playerFrames = {
            'idle': [
                {w: 34, x: 322},
                {w: 34, x: 322},
                {w: 34, x: 322},
                {w: 34, x: 322},
                {w: 34, x: 322},
                {w: 34, x: 322},
                {w: 34, x: 322},
                {w: 34, x: 356},
                {w: 34, x: 390},
            ],
            'run': [
                // {w: 20, x: 137},
                // {w: 24, x: 157},
                // {w: 32, x: 181},
                // {w: 34, x: 213},
                // {w: 28, x: 247},
                // {w: 24, x: 274},
                // {w: 26, x: 298},
                // {w: 32, x: 325},
                // {w: 34, x: 357},
                // {w: 32, x: 391},

                {w: 34, x: 137},
                {w: 34, x: 157},
                {w: 34, x: 181},
                {w: 34, x: 213},
                {w: 34, x: 246},
                {w: 34, x: 271},
                {w: 34, x: 296},
                {w: 34, x: 325},
                {w: 34, x: 357},
                {w: 34, x: 391},
            ],
            'jump': [
                // {w: 24, x: 248},
                {w: 34, x: 248},
            ],
            'fall': [
                // {w: 24, x: 274},
                {w: 34, x: 274},
            ],
            'jumpDash': [
                // {w: 42, x: 314},
                {w: 34, x: 318},
            ]
        }

        this.anims.create({key: 'playerIdle', frameRate: 8, repeat: -1, frames: This.anims.generateFrameNumbers('personIdle', { start: 0, end: playerFrames.idle.length-1, }), })
        this.anims.anims.entries.playerIdle.frames.forEach((ele,idx)=>{
            // ele.frame.setSize(playerFrames.idle[idx].w, 36, playerFrames.idle[idx].x, 15 )
            ele.frame.setSize(playerFrames.idle[idx].w, 50, playerFrames.idle[idx].x, 1 )
        })

        this.anims.create({key: 'playerRun', frameRate: 16, repeat: -1, frames: This.anims.generateFrameNumbers('personRun', { start: 0, end: playerFrames.run.length-1, }), })
        this.anims.anims.entries.playerRun.frames.forEach((ele,idx)=>{
            // ele.frame.setSize(playerFrames.run[idx].w, 36, playerFrames.run[idx].x, 105 )
            ele.frame.setSize(playerFrames.run[idx].w, 50, playerFrames.run[idx].x, 91 )
        })

        this.anims.create({key: 'playerJump', frameRate: 16, repeat: 0, frames: This.anims.generateFrameNumbers('personJump', { start: 0, end: playerFrames.jump.length-1, }), })
        this.anims.anims.entries.playerJump.frames.forEach((ele,idx)=>{

            console.log( ele.frame )
            ele.frame.setSize(playerFrames.jump[idx].w, 50, playerFrames.jump[idx].x, 54 )
        })

        this.anims.create({key: 'playerFall', frameRate: 16, repeat: -1, frames: This.anims.generateFrameNumbers('personFall', { start: 0, end: playerFrames.fall.length-1, }), })
        this.anims.anims.entries.playerFall.frames.forEach((ele,idx)=>{
            ele.frame.setSize(playerFrames.fall[idx].w, 50, playerFrames.fall[idx].x, 54 )
        })

        this.anims.create({key: 'playerJumpDash', frameRate: 16, repeat: -1, frames: This.anims.generateFrameNumbers('personJumpDash', { start: 0, end: playerFrames.jumpDash.length-1, }), })
        this.anims.anims.entries.playerJumpDash.frames.forEach((ele,idx)=>{
            ele.frame.setSize(playerFrames.jumpDash[idx].w, 50, playerFrames.jumpDash[idx].x, 150 )
        })



        let wallXY = [
            { x: [0, 30], y: [320, 580], },
            { x: [0, 160], y: [580, 640], },
            { x: [160, 290], y: [515, 640], },
            { x: [290, 1120], y: [610, 640], },
            { x: [1120, 1220], y: [550, 640], },
            { x: [1220, 1660], y: [480, 640], },
            { x: [1660, 3420], y: [550, 640], },

            { x: [3420, 4100], y: [610, 640], },

            { x: [3900, 6240], y: [930, 960], },
        ]
        wallXY.forEach(( obj )=>{
            this.walls.add( new createWall( This, obj ) )
        })

        this.anims.create({key: 'projectileAnim', frameRate: 8, repeat: -1, frames: This.anims.generateFrameNumbers('projectileImg', { start: 13, end: 20, }), })



    /*=== player & mouseArrow ===*/
        this.player = new createPlayer(this, 1000, 400);
        
        
    /*=== camera ===*/
        this.myCam = this.cameras.main.startFollow(this.player);
        // // this.myCam.setScale(2);
        // this.myCam.setBackgroundColor(0x664422);


    /*=== objects / time ===*/
        this.projectileSpawnTime = this.time.addEvent({ 
            repeat: -1, 
            delay: data.projectiles.spawnCD * 1000, 
            callback: () => {
                if ( !data.projectiles.active ){ return false }
                This.projectiles.add( new createProjectile(This) );
            }
        })


    /*=== collider / overlap ===*/
        // this.physics.add.collider(this.player, this.enemies, (player, enemy) => {
        //     if ( enemy.hurtPlayerLastTime === undefined || enemy.damageCD( enemy.hurtPlayerLastTime ) < 0 ){
        //         player.hurtTime = this.time.now;
        //         enemy.hurtPlayerLastTime = this.time.now;
        //         data.player.health -= enemy.damage; // player.health -= enemy.damage;
        //         This.hurtTexts.add( new createHurtText(this, player.x, player.y - 30, -enemy.damage, { color: '#f00', fontSize: 18, strokeThickness: 5, }) );
        //     }
        // })


        this.physics.add.collider(this.enemies, this.enemies);
        this.physics.add.collider(this.player, this.walls, (player,wall)=>{
            console.log(  )
        });
        this.physics.add.collider(this.projectiles, this.walls, (projectile,wall)=>{
            projectile.destroy();
        });

        this.toggleDebug = false;
        console.log('sceneCreated:', this);
    },
    update(){
        const This = this

        /*=== debug ===*/
        if (this.toggleDebug === true) {
            if ( this.physics.world?.debugGraphic?.clear === undefined ){
                this.physics.world.createDebugGraphic();
            }
            if (data.debug) {
                this.physics.world.drawDebug = true;
            } else {
                this.physics.world.drawDebug = false;
                this.physics.world.debugGraphic.clear();
            }
            this.toggleDebug = false;
        }


    /*=== map ===*/
        // this.map.tilePositionX = this.myCam.scrollX
        // this.map.tilePositionY = this.myCam.scrollY
        // this.map.tilePositionX = this.sys.game.loop.frame * 10 // 類似空戰感
        // this.tree.tilePositionX = this.player.x
        // this.tree.tilePositionY = this.player.y


    /*=== update groups ===*/
        const groupUpdate = (group) => {
            for( let i=group.getChildren().length-1; i>=0; i-- ){
                group.getChildren()[i].update();
            }
        }
        this.player.update()
        groupUpdate( this.projectiles )
    },
}

const game = new Phaser.Game({
    type: Phaser.AUTO,
    width: cw,
    height: ch,
    parent: 'app',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {
            },
            debug: data.debug,
        },
    },
    useTicker: true,
    scene: [
        // gameStart,
        gamePlay,
    ]
});