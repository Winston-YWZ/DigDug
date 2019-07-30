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
},
    start () {

    },
update(dt){
if(Math.abs(this.node.x>467)||Math.abs(this.node.y)>437){
    this.node.stopAllActions();
    if(Math.abs(this.node.y<-437))
    {
        this.node.y=-437;
    }
    if(Math.abs(this.node.x>467))
    {
        this.node.x=467;
    }
    if(Math.abs(this.node.x<-467))
    {
        this.node.x=-467;
    }
    //this.node.runAction(cc.sequence(cc.moveTo(2,cc.v2(0,24)),this.shake()));
    this.node.runAction(cc.moveTo(2,cc.v2(0,24)));
    if(this.node.y==24&&this.node.x==0){
        this.node.stopAllActions();
        this.node.runAction(this.shake());
    }
}
},
    
});
