// Phaser.Physics.Arcade.Sprite

class createWall extends Phaser.GameObjects.Sprite {
    constructor( scene, opt ){
        let w = opt.x[1] - opt.x[0];
        let h = opt.y[1] - opt.y[0];
        let px = w / 2 + opt.x[0]
        let py = h / 2 + opt.y[0]
        super( scene, px, py, 'wall');

        this.setOrigin(0,0)
        scene.physics.world.enableBody(this);
        console.log( this.body )
        this.body.setSize(w, h);
        this.body.setImmovable();
        scene.add.existing(this);
    }
}

class createPlayer extends Phaser.GameObjects.Sprite {
    constructor( scene, x, y ){
        super( scene, x, y, 'personIdle');
        this.scene = scene;
        this.hurtTime = 0;
        this.preMovedVelocity = {
            x: data.player.moveSpeed,
            y: 0,
        }
        this.preMovedX = data.player.moveSpeed;
        this.keyEnabled = {
            space: true,
        }
        this.canJump = true;
        this.canJumpDash = false;
        this.canClimbWall = false;

        this.init();
    }

    init(){
        this.scene.physics.world.enableBody(this);
        this.setScale(2);
        this.anims.play('playerIdle', true);
        // this.body.setSize(20,50);
        // this.body.setOffset(12,10);
        this.body.setGravityY(1600);
        this.body.setFrictionX(1);

        this.body.setCollideWorldBounds(true);
        this.scene.add.existing(this);

        this.scene.input.keyboard.on('keyup-SPACE', ()=>{
            this.keyEnabled.space = true
        })
    }

    update(){
        /* keydown */
        const keyCode = this.scene.input.keyboard.addKeys("W,A,S,D,SPACE")
        const keyDown = {
            space: keyCode.SPACE.isDown,
            down: keyCode.S.isDown,
            left: keyCode.A.isDown,
            right: keyCode.D.isDown,
            up: keyCode.W.isDown,
            new: preKeyDown.new,  // 解決最後按下的按鈕，來決定要往哪個方向。
        }

        for( let [key, val] of Object.entries( keyDown ) ){
            if ( keyDown[key] === preKeyDown[key] ){ continue }
            if ( keyDown[key] === true ){
                keyDown.new = key
                break
            } else {
                keyDown.new = null
            }
        }

        const dir = {x: 0, y: 0,}
        if ( keyDown.left && keyDown.right ){
            dir.x = ( keyDown.new === 'left' ) ? -1 : 1
        } else if ( keyDown.left ){
            dir.x = -1
        } else if ( keyDown.right ){
            dir.x = 1
        }
        
        if ( keyDown.up && keyDown.down ){
            dir.y = ( keyDown.new === 'up' ) ? -1 : 1
        } else if ( keyDown.up ){
            dir.y = -1
        } else if ( keyDown.down ){
            dir.y = 1
        }


        this.body.setVelocityX( data.player.moveSpeed * dir.x );
        // this.body.setVelocityY(data.player.moveSpeed * dir.y);

        let animStatus = 'Idle'
        switch ([dir.x, dir.y].toString()){
            case '-1,-1':
            case '0,-1':    
            case '1,-1':
                // animStatus = 'Run'
                // this.anims.play('playerAnim-up', true)
            break
            case '-1,1':
            case '0,1':
            case '1,1':
                // animStatus = 'Run'
                // this.anims.play('playerAnim-down', true)
            break
            case '-1,0':
                this.flipX = true;
                animStatus = 'Run'
                // this.anims.play('playerAnim-left', true)
            break
            case '1,0':
                this.flipX = false;
                animStatus = 'Run'
                // this.anims.play('playerAnim-right', true)
            break
            default:
                animStatus = 'Idle'
            break
        }

        if ( keyDown.space && this.keyEnabled.space ){
            if ( this.canJump === true ){
                this.canJump = false;
                this.canJumpDash = true;
                this.body.velocity.y = -500;
            } else if ( this.canJumpDash === true ){
                this.canJumpDash = false;
            }
            this.keyEnabled.space = false;
        }


        if ( this.body.velocity.y < 0 ){
            animStatus = 'Jump'
        }
        if ( this.body.velocity.y > 0 ){
            animStatus = 'Fall'
        }
        if ( this.body.velocity.y === 0 ){
            this.canJump = true
        }


        if ( this.canJump === false && this.canJumpDash === false ){
            if ( keyDown.fire ){
                //a
            } else {
                animStatus = 'JumpDash'
                this.body.setVelocityX( data.player.moveSpeed * 2 * dir.x );
            }
        }

        this.anims.play('player' + animStatus , true)

        for( let [key, val] of Object.entries( keyDown ) ){
            preKeyDown[key] = val
        }

        this.alpha = ( this.hurtTime + 500 > this.scene.time.now ) ? 0.5 : 1;

        if ( this.body.velocity.x !== 0 || this.body.velocity.y !== 0 ){
            this.preMovedVelocity = {
                x: this.body.velocity.x,
                y: this.body.velocity.y,
            }
        }

        if ( this.body.velocity.x !== 0 ){
            this.preMovedX = this.body.velocity.x
        }
    }
}

class createProjectile extends Phaser.GameObjects.Sprite {
    constructor( scene ){
        super( scene, scene.player.x, scene.player.y + 10, 'weaponImg' );
        this.scene = scene;
        this.vx = scene.player.preMovedX;
        // this.vy = scene.player.preMovedVelocity.y;
        this.damage = data.projectiles.damage;
        this.id = ~~scene.time.now;

        this.init();
    }
    init(){
        this.scene.physics.world.enableBody(this);
        this.setScale(0.5);
        this.anims.play('projectileAnim', true);
        // this.angle = Math.atan2(this.vy, this.vx) * 180 / Math.PI;

        this.flipX = this.vx < 0 ? true : false;

        this.body.setImmovable();
        this.body.setSize(80,35);
        this.body.setOffset(20,10);
        this.body.velocity.x = this.vx * data.projectiles.speed * 0.01;
        // this.body.velocity.y = this.vy * data.projectiles.speed * 0.01;
        
        this.scene.add.existing(this);
    }
    update(){
        if ( this.body.checkWorldBounds() ){
            this.destroy();
        }
    }
}

class createEnemy extends Phaser.GameObjects.Sprite {
    constructor( scene ){
        let rx = ~~(Math.random()*2)
        let ry = ~~(Math.random()*2)
        let SX = Math.floor(scene.player.x) + (rx ? 0.5*cw : -0.5*cw ) + ~~(Math.random()*400 - 200)
        let SY = Math.floor(scene.player.y) + (ry ? 0.5*ch+30 : -0.5*ch-30)
        super( scene, SX, SY, 'enemy' );
        this.scene = scene;
        this.id = 'enemy' + scene.time.now;
        this.moveSpeed = data.enemy.moveSpeed;
        this.health = data.enemy.health;
        this.damage = data.enemy.damage;

        this.init();
    }
    init(){
        this.scene.physics.world.enableBody(this);
        this.setScale(0.6);
        this.anims.play('enemyAnim-down', true);
        this.body.setSize(20,50);
        this.body.setOffset(10,10);
        this.body.setBounce(1);
        this.scene.enemies.add(this);
        this.scene.add.existing(this);
    }
    update(){
        if (this.active){
            let peX = this.x - this.scene.player.x
            let peY = this.y - this.scene.player.y
            let peR = (1 / Math.sqrt(peX**2 + peY**2))
            this.body.setVelocityX( peX * peR * this.moveSpeed * -1 )
            this.body.setVelocityY( peY * peR * this.moveSpeed * -1 )
        }

        if (this.health <= 0){
            if ( data.exp.active ){
                this.scene.exps.add( new createExp(this.scene, this.x, this.y) )
            }
            this.destroy();
        }
    }
    damageCD( lastTime ){
        return data.enemy.damageCD * 1000 - (this.scene.time.now - lastTime)
    }
}
