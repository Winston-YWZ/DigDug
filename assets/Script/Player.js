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
        //速度
        speed:10,
        //没有勾中金子的加速度
        acc:10,
        maxRotation:0,
        minRotation:0,
        rotateTime:0.5
    },
    // onLoad () {},
    onLoad(){
        //找到score节点
        this.score=cc.find("Canvas/label/score");
        //开始摇摆
        this.node.runAction(this.shake());
        //增加监听器
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        //初始化下一个金子摆放位置的值
        this.nextGoldPosition=0;
        //初始化分数
        this.currentScore=0;
        //碰撞
        var manager = cc.director.getCollisionManager();
        manager.enabled = true;
        //钩子向下时的加速度
        this.downAcc=false;
        //钩子向上时的加速度
        this.backAcc=false;
    },
    shake:function(){
        //钩子是否在旋转状态
        this.isRotating=true;
        this.node.x=-9.4;
        this.node.y=229.1;
        //如果开始摇摆时发现了存在金子
        if(this.other!=null){
            //增加分数
            this.currentScore+=this.other.node.getComponent("GoldAttribute").value;
            //将金子摆放到地面
            this.other.node.parent=cc.find("Canvas/GainedGold");
            this.other.node.anchorY=0;
            this.other.node.x=this.nextGoldPosition;
            this.other.node.y=0;
            this.other.node.angle=0;
            //设置下一个金子的摆放位置
            this.nextGoldPosition+=this.other.node.width;
        }
        var down=cc.rotateTo(this.rotateTime,0).easing(cc.easeSineIn());
        var lu=cc.rotateTo(this.rotateTime,this.maxRotation).easing(cc.easeSineOut());
        var ru=cc.rotateTo(this.rotateTime,this.minRotation).easing(cc.easeSineOut());
        return cc.repeatForever(cc.sequence(lu,down,ru,down));
    },
     // LIFE-CYCLE CALLBACKS:
     onKeyDown(event){
        if(event.keyCode==cc.macro.KEY.down)
        {   
            //只有钩子在旋转过程中DOWN才有用
            if(this.isRotating==true){
            this.isRotating=false;
            this.hooking=true;//将状态转为射出
            this.node.stopAllActions();
             //路程除以速度
             //var outh=cc.moveBy(Math.abs(-600/Math.cos(Math.PI/180*this.node.rotation))/this.speed,cc.v2(-600*Math.tan(Math.PI/180*this.node.rotation),-600)).easing(cc.easeSineIn());
             //this.node.runAction(outh);
             //设置钩子的向下加速
             this.downAcc=true;
             this.currentSpeed=0;
            }           
        }
    },
    onCollisionEnter: function (other, self) {
        this.downAcc=false;
        this.currentSpeed=0;
        if(this.hooking==true)
        {
            this.hooking=false; 
            this.backAcc=true;
            this.node.stopAllActions();
            if(other.node.parent==cc.find('Canvas/map')){
                this.other=other;
                this.other.node.parent=this.node;
                other.node.anchorY = 1;
                this.other.node.y=-45;
                this.other.node.x=0;
                //获得回拉的最大速度
                this.maxSpeed=this.other.node.getComponent("GoldAttribute").speed;
                cc.log("速度"+this.other.node.getComponent("GoldAttribute").speed);
                //设置回拉的加速
                this.currentBackAcc=this.maxSpeed/4;
            }else{
                this.other=null;
                this.maxSpeed=this.speed;
                this.currentBackAcc=this.acc;
            }
            // var pullback=cc.moveTo(this.caltime(),cc.v2(0,-35.6));
            // this.node.stopAllActions();   
            // //返回后继续摇摆
            // var finished = cc.callFunc(function(){
            // this.node.runAction(this.shake());
            // }, this);
            // this.node.runAction(cc.sequence(pullback,finished))
        }
    },
    start () {

    },
    // caltime()
    // {
    //     var disx=Math.abs(this.node.x);
    //     var disy=Math.abs(this.node.y-24);
    //     var dis=Math.sqrt(disx*disx+disy*disy);
    //     if(this.other!=null){
    //         var time=dis/this.other.node.getComponent("GoldAttribute").speed;
    //     }else{
    //         time=dis/this.speed;
    //         cc.log(time);
    //     }
    //     return time;

    // },
    update(dt){
        //动态的增加计分板的分数
        if(this.score.getComponent(cc.Label).string<this.currentScore){
            var a=this.score.getComponent(cc.Label)
            a.string=-(-a.string)+10;
        }
        if(this.downAcc==true){
            if(this.currentSpeed<=this.speed){
                this.currentSpeed+=this.acc*dt;
            }else{
                this.currentSpeed=this.speed;
            }
            this.node.x-=this.currentSpeed*Math.sin(Math.PI/180*this.node.rotation)*dt;
            this.node.y-=this.currentSpeed*Math.cos(Math.PI/180*this.node.rotation)*dt;
        }else if(this.backAcc==true){
            
            if(!(Math.abs(this.node.x+9.4)<4&&Math.abs(this.node.y-229.1)<4)){
                cc.log("速度很慢");
                if(this.currentSpeed<=this.maxSpeed){
                    cc.log(this.maxSpeed);
                    this.currentSpeed+=this.currentBackAcc*dt;
                }else{
                    this.currentSpeed=this.maxSpeed;
                }
                this.node.x+=this.currentSpeed*Math.sin(Math.PI/180*this.node.rotation)*dt;
                cc.log("当前的最大速度："+this.maxSpeed);
                cc.log("当前的速度"+this.currentSpeed);
                this.node.y+=this.currentSpeed*Math.cos(Math.PI/180*this.node.angle)*dt;
            }else{
                this.backAcc=false;
                this.node.runAction(this.shake());
            }
        }

    }

});