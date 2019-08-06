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
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
        timeDisplay:{
            default:null,
            type:cc.Label
        },
       NextScene:{
        default:"",  
        type:cc.string
       },
       LastScene:{
       default:"",
        type:cc.string
       },
       TargetScore:0,
    
tip:{
default:null,
type:cc.Prefab,
},
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
    //读取设置的时间
    this.timer=this.timeDisplay.getComponent('counter').time;
   this.BestScore=this.GetBestScore();
  
    },

    start () {

    },
    update (dt) {
        //更新计数器
        this.timer-=dt;
        this.timeDisplay.string=""+Math.floor(this.timer);
        if(this.timer<=30){
            this.timeDisplay.node.color=new cc.color(233,245,22,255);
        }
        if(this.timer<10){
            this.timeDisplay.node.color=new cc.color(239,22,22,255)
        }
        if(this.timer<=0){
           this.GameOver(); 
        }
    },
    GameOver:function(){
        this.timeDisplay.node.color="";
        this.timeDisplay.string='0';
        //游戏转场
      if(cc.find('hook').getComponent("Player").currentScore>this.TargetScore)
        cc.director.loadScene(this.NextScene);
        //cc.director.end();
      else
{
   cc.instantiate(tip);
   tip.node.setPosition(cc.v2(480,320));
    //do something
}    },
    SetBestScore (value){
       if(value>this.BestScore){
        cc.sys.localStorage.setItem("HighestScore", value);
       }
       else
       {
           cc.log("这并不比历史最高分要高，所以不会存储该值");
       }
    },

    GetBestScore(){
    return cc.sys.localStorage.getItem("HighestScore");
    },



});
