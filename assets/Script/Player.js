// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        speed:10,

         

    },
    shake:function(){
        var down=cc.rotateTo(0.5,0).easing(cc.easeSineIn());
        var lu=cc.rotateTo(0.5,60).easing(cc.easeSineOut());
        var ru=cc.rotateTo(0.5,-60).easing(cc.easeSineOut());
        return cc.repeatForever(cc.sequence(lu,down,ru,down));

    },
    // LIFE-CYCLE CALLBACKS:
    onKeyDown(event){
        if(event.keyCode==cc.macro.KEY.down&&this.hooking==false)
        {
            cc.log('hhaha');

            this.hooking=true;//将状态转为射出
            this.node.stopAllActions();

            var outh=cc.moveBy(2,cc.v2(-600*Math.tan(Math.PI/180*this.node.rotation),-600)).easing(cc.easeSineIn());

            this.node.runAction(outh);
        }
    },

    // onLoad () {},
    onLoad(){
        this.node.runAction(this.shake());
        // cc.log(typeof(cc.moveTo(0.5,6)));
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        var manager = cc.director.getCollisionManager();
        manager.enabled = true;
        this.source=this.node.getPosition();
        this.hooking=false;
       this.stones=null;
    },

    onCollisionEnter: function (other, self) {
        console.log('on collision enter');
        if(this.hooking==true)
        {
            if(other.node.group!="wall")
            {
               this.addChild(self.node,other.node);
           this.stones=other.node;
            }
            this.hooking=false;
            var pullback=cc.moveTo(this.caltime(),this.source);
            cc.log("ready to pull back");
            this.node.stopAllActions();
            var finished = cc.callFunc(function(){
                
                if(this.stones!=null)
                {
                   this.stones.destroy();
                   this.stones=null;
                }
                cc.log("finished");
                this.node.runAction(this.shake());
               
            }, this);
            this.node.runAction(cc.sequence(pullback,finished));
            cc.log("node is:"+other.node.name);
           
        }
    },
    start () {

    },
    caltime()
    {
        var disx=Math.abs(this.node.x);
        var disy=Math.abs(this.node.y-24);
        var dis=Math.sqrt(disx*disx+disy*disy);
        var time=dis/this.speed;
        cc.log(time);
        cc.log("time :"+time);
        return time;

    },
     addChild(parent,child)
    {
        //var pos= child.convertToWorldSpaceAR(child.position);
      //cc.log("posa"+child.position);
      //cc.log("pos_world"+pos); 
      child.parent = parent;
       //pos=parent.convertToNodeSpaceAR(pos);
        //cc.log("posb"+child.position);
        
        child.setPosition(cc.v2(0,-child.height/2));       
      }
  
});
