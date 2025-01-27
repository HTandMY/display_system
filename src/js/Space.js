import * as PIXI from 'pixi.js';
import Constellation from './Constellation.js';

export default class Space {
    constructor(app){
        this.app = app;
        this.spaceBox = new PIXI.Container();
        this.flameBox = new PIXI.Container();
        this.constellationGroups = new PIXI.Container();
        this.spaceBox.addChild(this.constellationGroups , this.flameBox);
        this.constellation = [];
        this.moving = true;
        this.constellationGroups.x = document.documentElement.clientWidth / 2;
        this.constellationGroups.y = document.documentElement.clientHeight / 2 + 1350;
        
        this.addSpaceBg();
        this.createConstellation();
        this.addScrollIcon();
        this.addFlame();
    }

    addSpaceBg(){
        let self = this;
        this.spaceBg = new PIXI.Sprite(this.app.loader.resources['spaceBg_01'].texture);
        this.spaceBg.anchor.set(0.5);
        this.spaceBg.scale.set(1.1);
        this.spaceBg.interactive = true;
        this.spaceBg.on('pointerdown', function(){self.moveStart(this)})
            .on('pointerup', function(){self.moveEnd(this)})
            .on('pointermove', function(){self.moveOn(this)});
        this.constellationGroups.addChild(this.spaceBg);
    }
    
    moveStart(_this){
        this.moving = false;
        _this.newPointX = this.app.renderer.plugins.interaction.mouse.global.x;
    }

    moveOn(_this){
        if(this.moving == false){
            _this.pointX = _this.newPointX;
            _this.newPointX = this.app.renderer.plugins.interaction.mouse.global.x;
            let movePosition = -(_this.pointX -_this.newPointX) * 0.001
            this.constellationGroups.rotation = this.constellationGroups.rotation + movePosition;
        }
    }

    moveEnd(){
        this.moving = true;
    }

    addScrollIcon(){
        this.scrollIcon = new PIXI.Sprite(this.app.loader.resources['item_scroll'].texture);
        this.scrollIcon.x = document.documentElement.clientWidth / 2;
        this.scrollIcon.y = document.documentElement.clientHeight - 200;
        this.scrollIcon.anchor.set(0.5);
        this.scrollIcon.scale.set(0.5);
        this.scrollIcon.alpha = 0;
        this.scrollIcon.step = 0;
        this.flameBox.addChild(this.scrollIcon);
    }

    addFlame(){
        this.flame = new PIXI.Sprite(this.app.loader.resources['flame'].texture);
        this.flame.x = document.documentElement.clientWidth / 2;
        this.flame.anchor.set(0.5 , 0);
        this.flame.width = document.documentElement.clientWidth + 50;
        this.flame.height = document.documentElement.clientHeight;
        let flame_bottom_list = []
        for(let i = 0 ; i < 6 ; i++){
            flame_bottom_list[i] = new PIXI.Texture(this.app.loader.resources['flame_bottom'].texture);
            flame_bottom_list[i].frame = new PIXI.Rectangle(i * 1920 , 0 , 1920 , 180);
        }
        this.flameBottom = new PIXI.AnimatedSprite(flame_bottom_list);
        this.flameBottom.animationSpeed = 0.1;
        this.flameBottom.play();
        this.flameBottom.anchor.set(0.5 , 1);
        this.flameBottom.width = document.documentElement.clientWidth;
        this.flameBottom.height = 120;
        this.flameBottom.x = document.documentElement.clientWidth / 2;
        this.flameBottom.y = document.documentElement.clientHeight;

        this.title = new PIXI.Text('星座一覧' , game.fontStyle.KaisoNext);
        this.title.style.fontSize = 50;
        this.title.anchor.set(0.5 , 0);
        this.title.position.set(document.documentElement.clientWidth / 2 , 50);

        this.line_horizontal = new PIXI.Graphics().lineStyle(1, 0xFFFFFF, 0.5).moveTo(0 , document.documentElement.clientHeight / 2).lineTo(document.documentElement.clientWidth , document.documentElement.clientHeight / 2);
        this.line_vertical = new PIXI.Graphics().lineStyle(1, 0xFFFFFF, 0.5).moveTo(document.documentElement.clientWidth / 2 , 0).lineTo(document.documentElement.clientWidth / 2 , document.documentElement.clientHeight);

        this.flameBox.addChild(this.title , this.line_horizontal ,this.line_vertical , this.flame , this.flameBottom );
    }

    createConstellation(){
        let num = game.Manager.data.userData.groups.length;
        for (let i in game.Manager.data.userData.groups) {
            this.constellation[i] = new Constellation(this.app , i);
            this.constellation[i].constellationBox.x = Math.cos((Math.PI * 2 / num) * i) * 1500;
            this.constellation[i].constellationBox.y = Math.sin((Math.PI * 2 / num) * i) * 1500;
            this.constellation[i].constellationBox.rotation = (Math.PI * 2 / num) * i + (Math.PI * 0.5);
            this.constellation[i].constellationBox.scale.set(0.3);
            this.constellation[i].addEvent();
            this.constellationGroups.addChild(this.constellation[i].constellationBox);
        }
    }

    resetStarColor(){
        for(let i in this.constellation){
            this.constellation[i].resetStarColor();
        }
    }

    resetStarSize(){
        for(let i in this.constellation){
            this.constellation[i].resetStarSize();
        }
    }

    enter(){
        this.scrollIcon.step = -8;
        this.scrollIcon.alpha = 0;
        this.scrollIcon.x = document.documentElement.clientWidth / 2;
    }

    update(){
        if(this.moving){
            this.constellationGroups.rotation -= 0.0005;
        }else{
            this.scrollIcon.step = -8;
            this.scrollIcon.alpha = 0;
            this.scrollIcon.x = document.documentElement.clientWidth / 2;
        }
        if(this.scrollIcon.step > 0 && this.scrollIcon.step < 4){
            this.scrollIcon.alpha = Number((-(Math.pow(this.scrollIcon.step - 2,2)) * 0.125 + 0.5).toFixed(2));
            this.scrollIcon.x = document.documentElement.clientWidth / 2 + Math.sin(4 * this.scrollIcon.step) * 20;
        }else if(this.scrollIcon.step >= 4){
            this.scrollIcon.step = -8;
            this.scrollIcon.alpha = 0;
            this.scrollIcon.x = document.documentElement.clientWidth / 2;
        }
        this.scrollIcon.step += 0.02;
    }
}