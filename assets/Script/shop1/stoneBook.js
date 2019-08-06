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

        speed:1,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.isShown=false;
        this.state=this.node.getChildByName("state");
        this.node.on(cc.Node.EventType.MOUSE_ENTER,this.onMouseEnter,this);
        this.node.on(cc.Node.EventType.MOUSE_LEAVE,this.onMouseLeave,this);
    },
    onMouseEnter(event){
        if(!this.isShown){
            this.isShown=true;
        }
    },
    onMouseLeave(event){
        if(this.isShown){
            this.isShown=false;
        }
    },
    start () {

    },

    update (dt) {
        if(this.isShown&&this.state.opacity<200){
            this.state.opacity+=this.speed;
        }else if(!this.isShown&&this.state.opacity>0){
            this.state.opacity-=this.speed;
        }
    },
});
