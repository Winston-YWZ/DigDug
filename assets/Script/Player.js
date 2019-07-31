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
        if(event.keyCode==cc.macro.KEY.down)
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

    },

    onCollisionEnter: function (other, self) {
        console.log('on collision enter');
        if(this.hooking==true)
        {
            this.hooking=false;
            var pullback=cc.moveTo(this.caltime(),cc.v2(0,24));
            cc.log("ready to pull back");
            this.node.stopAllActions();
            var finished = cc.callFunc(function(){
                cc.log("finished");
                this.node.runAction(this.shake());
            }, this);
            this.node.runAction(cc.sequence(pullback,finished));
            cc.log("group is:"+other.node.group)
            if(other.node.group!="wall")
            {
                this.node.addChild(other.node);
            }
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


});
