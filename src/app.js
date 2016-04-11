
var HelloWorldLayer = cc.Layer.extend({
    jugador1:null,    
    jugador2:null,    
    pelota:null,    
    puntuacion1:null,
    puntuacion2:null,
    btn:null,
    speed:null,
    inicializar : function(){
    this.speed=5;
        var size = cc.winSize;
        var color = cc.color(100,100,100);

        this.jugador1 =  new cc.DrawNode();
        this.jugador1.drawRect(cc.p(0,0),cc.p(20,100),color,3);
        this.jugador1.setPosition(size.width * 0.1,size.height / 2);
        this.addChild(this.jugador1, 1);

        this.jugador2 =  new cc.DrawNode();
        this.jugador2.drawRect(cc.p(0,0),cc.p(20,100),color,3);
        this.jugador2.setPosition(size.width -(size.width * 0.1),size.height / 2);
        this.addChild(this.jugador2, 1);        

        var lineaDivisoria =  new cc.DrawNode();
        lineaDivisoria.drawSegment(cc.p(size.width/2,0),cc.p(size.width/2,size.height),3,color);
        this.addChild(lineaDivisoria,0);
        
        this.puntuacion1 = new cc.LabelTTF("0","Arial",24);
        this.puntuacion1.setPosition(size.width * 0.4, size.height - (size.height * 0.10));
        this.addChild(this.puntuacion1,0);
        
        this.puntuacion2 = new cc.LabelTTF("0","Arial",24);
        this.puntuacion2.setPosition(size.width - (size.width * 0.4), size.height - (size.height * 0.10));
        this.addChild(this.puntuacion2,0);
        
        this.pelota =  new cc.DrawNode();
        this.pelota.drawCircle(cc.p(0,0),5,0,100,false,10,color);
        this.pelota.setPosition(size.width / 2,size.height / 2);
        this.addChild(this.pelota, 1);
        var moveto = cc.moveTo(this.speed, -10, this.random(0, size.height));
        this.pelota.runAction(moveto);
        
        this.btn = new cc.Sprite(res.Reset_png);
        this.btn.setPosition(28, 28);
        this.addChild(this.btn,0);
    },
    
    //random para dar direccion a la pelota
    random: function getRandomInt(min, max) {
    	return Math.floor(Math.random() * (max - min + 1)) + min;
	},
    
    
    //mover barras con WS & flecha arriba y abajo
    move1 : function(key, event){
      
        cc.log("Mover barra");
        var size = cc.winSize;
        var  move = event.getCurrentTarget();
    
         switch(key){
            case 38:
                 cc.log("Mover barra2");
                move.jugador2.y += size.height/20;
                move.jugador2.y = Math.min(move.jugador2.y, size.height - 100);            
                break;
             case 40:
                  cc.log("Mover barra2");
                move.jugador2.y -= size.height/20;
                move.jugador2.y = Math.max(move.jugador2.y, 0);
                 break;
            case 87:
                cc.log("Mover barra1");
                move.jugador1.y += size.height/20;
                move.jugador1.y = Math.min(move.jugador1.y, size.height - 100);
                break;
            case 83:
                cc.log("Mover barra1");
                move.jugador1.y -= size.height/20;
                move.jugador1.y = Math.max(move.jugador1.y, 0);
                break;
        }
    },
    
    movePelota : function(){
        var curScene = cc.director.getRunningScene();
        var allChildren = curScene.getChildren();
        var moveto = cc.moveTo(allChildren[0].speed, -10, allChildren[0].random(0, cc.winSize.height));
        allChildren[0].pelota.stopAllActions();
        allChildren[0].pelota.runAction(moveto);
        cc.director.resume();
    },
    
    play : function(){
        if(this.pelota.x <= cc.winSize.width*0.1 - 10){
            var num = parseInt(this.puntuacion2.string);
            num++;
            this.puntuacion2.string = num;
            this.centro();
        }
        if(this.pelota.x >= cc.winSize.width - (cc.winSize.width * 0.1) + 10){
            var num = parseInt(this.puntuacion1.string);
            num++;
            this.puntuacion1.string = num;
            this.centro();
        }
    },
    
    //poner pelota en el centro
    centro : function(){
        this.pelota.setPosition(cc.winSize.width / 2, cc.winSize.height / 2);
            cc.director.pause();
            setTimeout(this.movePelota, 2000);
    },
    
    //resetear puntuacion y lugar
    reset : function(Location,event){
        var locate = Location.getLocation();
        if (locate.x<=50 && locate.y<=50){  
            cc.log("reset fn");
            var num=0;
            this.puntuacion1 = num;
            this.puntuacion2 = num;
            this.centro();
            cc.log("cemtro");
        }
    },
    
    //hace rebotar a la pelota
    rebotar : function(){
        if( Math.abs(this.pelota.x - this.jugador1.x) <= 36 && Math.abs(this.pelota.y - this.jugador1.y) <= 100){
            var moveto = cc.moveTo(this.speed, cc.winSize.width+10, this.random(0, cc.winSize.height));
            this.pelota.stopAllActions();
            this.pelota.runAction(moveto);
        }
        if( Math.abs(this.pelota.x - this.jugador2.x) <= 23 &&  Math.abs(this.pelota.y - this.jugador2.y) <= 100){
            var moveto = cc.moveTo(this.speed, -10, this.random(0, cc.winSize.height));
            this.pelota.stopAllActions();
            this.pelota.runAction(moveto);
        }
    },
    ctor:function () {
        this._super();
        this.inicializar();

            //Inicializar evento de jugados 1
        cc.eventManager.addListener({ 
            event: cc.EventListener.KEYBOARD,
            onKeyPressed: this.move1,
            }, this);
        
        //time to play!!
        this.schedule(this.play, 0.1);
          
        // rebota!!!! Pelotita rebota!!!
        this.schedule(this.rebotar, 0.1);
        
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            onTouchBegan: this.reset,
        }, this);
        
        return true;
    }
});

var HelloWorldScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new HelloWorldLayer();
        this.addChild(layer);
    }
});

