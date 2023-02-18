const cw = 1200;
const ch = 675;
const preKeyDown = {
    space: false,
    down: false,
    left: false,
    right: false,
    up: false,
    new: null,
}
const worldMouse = {
    x: cw + 10,
    y: cw + 10,
}

const destroyGroup = ( group ) =>{
    for( let i=group.getChildren().length-1; i>=0; i-- ){
        group.getChildren()[i].destroy()
    }
}

let data = {
    debug: true,
    pause: false,
    totalDamage: {
        iceball: 0,
        fireball: 0,
        sword: 0,
        boom: 0,
    },
    world: {
        bounce: {
            // x: 0 - cw/2 / 2,
            // y: 0 - ch / 2,
            // width: cw + cw/2,
            // height: ch + ch,
            x: 0,
            y: 0,
            width: 5520 * 2,
            height: 640 * 2,
        }
    },
    player: {
        health: 500,
        moveSpeed: 500,
        exp: {
            level: 1,
            expNow: 0,
            expToNextLevel: 10,
        },
    },
    enemy: {
        active: true,
        health: 30,
        spawnCD: 0.5,
        damage: 2,
        damageCD: 0.6,
        moveSpeed: 50,
        clear: function(){
            let grp = game.scene.keys.gamePlay.enemies
            destroyGroup( grp )
        }
    },
    projectiles: {
        active: true,
        damage: 10,
        spawnCD: 0.3,
        speed: 250,
        clear: function(){
            let grp = game.scene.keys.gamePlay.weapon.fireballs
            destroyGroup( grp )
        }
    },
}


// const gui_w = new dat.gui.GUI();
// let gui_weapon = gui_w.addFolder('=== Weapon ===');
//     gui_weapon.open();

// let gui_iceball = gui_weapon.addFolder('Iceball');
//     gui_iceball.add(data.weapon.iceball, 'active');
//     gui_iceball.add(data.weapon.iceball, 'damage').min(1).max(100).step(1);
//     gui_iceball.add(data.weapon.iceball, 'penetrate').min(1).max(100).step(1);
//     gui_iceball.add(data.weapon.iceball, 'spawnCD').min(0.01).max(2).step(0.01).onChange((val)=>{
//         let scene = game.scene.keys.gamePlay
//         scene.weapon.iceballSpawnTime.delay = val * 1000
//     })
//     gui_iceball.add(data.weapon.iceball, 'speed').min(1).max(1000).step(1);
//     gui_iceball.add(data.weapon.iceball, 'clear');
//     gui_iceball.open();

// let gui_fireball = gui_weapon.addFolder('Fireball');
//     gui_fireball.add(data.weapon.fireball, 'active');
//     gui_fireball.add(data.weapon.fireball, 'damage').min(1).max(100).step(1);
//     gui_fireball.add(data.weapon.fireball, 'spawnCD').min(0.01).max(2).step(0.01).onChange((val)=>{
//         let scene = game.scene.keys.gamePlay
//         scene.weapon.fireballSpawnTime.delay = val * 1000
//     })
//     gui_fireball.add(data.weapon.fireball, 'maxAmount').min(1).max(1000).step(1);
//     gui_fireball.add(data.weapon.fireball, 'speed').min(1).max(1000).step(1);
//     gui_fireball.add(data.weapon.fireball, 'clear');
//     gui_fireball.open();

// let gui_sword = gui_weapon.addFolder('Sword');
//     gui_sword.add(data.weapon.sword, 'active');
//     gui_sword.add(data.weapon.sword, 'damage').min(1).max(100).step(1);
//     gui_sword.add(data.weapon.sword, 'damageCD').min(0.1).max(3).step(0.01);
//     gui_sword.add(data.weapon.sword, 'spawnCD').min(0.01).max(2).step(0.01).onChange((val)=>{
//         let scene = game.scene.keys.gamePlay
//         scene.weapon.swordSpawnTime.delay = val * 1000
//     })
//     gui_sword.add(data.weapon.sword, 'maxAmount').min(1).max(100).step(1);
//     gui_sword.add(data.weapon.sword, 'size').min(1).max(200).step(1);
//     gui_sword.add(data.weapon.sword, 'clear');
//     gui_sword.open();


// let gui_boom = gui_weapon.addFolder('Boom');
//     gui_boom.add(data.weapon.boom, 'active');
//     gui_boom.add(data.weapon.boom, 'damage').min(1).max(1000).step(1);
//     gui_boom.add(data.weapon.boom, 'CD').min(1).max(180).step(1);
//     gui_boom.add(data.weapon.boom, 'spawnCD').min(0.01).max(1).step(0.01);
//     gui_boom.add(data.weapon.boom, 'duration').min(1).max(60).step(0.1);
//     gui_boom.open();


const gui = new dat.gui.GUI();
    gui.add(data, 'debug').onChange((val)=>{
        let scene = game.scene.keys.gamePlay
        scene.toggleDebug = true
    })
    gui.add(data, 'pause').onChange((val)=>{
        let scene = game.scene
        if ( val ){
            scene.pause('gamePlay')
        } else {
            scene.resume('gamePlay')
        }
    })
    
//     let gui_player = gui.addFolder('=== Player ===');
//         gui_player.add(data.player, 'health').min(1).max(1000).step(1).listen();
//         gui_player.add(data.player, 'moveSpeed').min(1).max(500).step(1);
//         gui_player.open();

//     let gui_lv = gui_player.addFolder('Level');
//         gui_lv.add(data.player.exp,'level').min(1).max(100).step(1).listen();
//         gui_lv.add(data.player.exp,'expNow').min(0).max(1000).step(1).listen();
//         gui_lv.add(data.player.exp,'expToNextLevel').min(1).max(1000).step(1).listen();
//         gui_lv.open();
        
//     let gui_exp = gui_player.addFolder('Exp');
//         gui_exp.add(data.exp, 'active');
//         gui_exp.add(data.exp, 'clear');
//         gui_exp.open();
    
//     let gui_enemy = gui.addFolder('=== Enemy ===');
//         gui_enemy.add(data.enemy, 'active');
//         gui_enemy.add(data.enemy, 'health').min(1).max(1000).step(1).onChange((val)=>{
//             let scene = game.scene.keys.gamePlay
//             for( let i=0; i<scene.enemies.getChildren().length; i++ ){
//                 scene.enemies.getChildren()[i].health = val
//             }
//         })
//         gui_enemy.add(data.enemy, 'spawnCD').min(0.01).max(2).step(0.01).onChange((val)=>{
//             let scene = game.scene.keys.gamePlay
//             scene.enemyTime.delay = val * 1000
//         })
//         gui_enemy.add(data.enemy, 'moveSpeed').min(1).max(200).step(1).onChange((val)=>{
//             let scene = game.scene.keys.gamePlay
//             for( let i=0; i<scene.enemies.getChildren().length; i++ ){
//                 scene.enemies.getChildren()[i].moveSpeed = val
//             }
//         })
//         gui_enemy.add(data.enemy, 'damage').min(1).max(300).step(1);
//         gui_enemy.add(data.enemy, 'clear');
//         gui_enemy.open();