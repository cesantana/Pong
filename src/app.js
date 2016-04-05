
var HelloWorldLayer = cc.Layer.extend({
    jugador1:null,    
    jugador2:null,    
    pelota:null,    
    puntuacion1:null,
    puntuacion2:null,
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
    
    ctor:function () {
        this._super();
        this.inicializar();

            //Inicializar evento de jugados 1
        cc.eventManager.addListener({ 
            event: cc.EventListener.KEYBOARD,
            onKeyPressed: this.move1,
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

