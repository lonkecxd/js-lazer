var golden= '185,147,98';

var c=$("#myCanvas")[0]; 
var ctx = c.getContext("2d");

var ww,wh;
var center = {x:0,y:0};
var deg_to_pi= Math.PI/180;
function getWindowSize(){
  ww = $(window).outerWidth();
  wh = $(window).outerHeight();
  c.width = ww;
  c.height = wh;
  center={x:ww/2,y:wh/2};
  ctx.restore();
  ctx.translate(center.x,center.y);
}
getWindowSize();
$(window).resize(getWindowSize);

var enemies = Array(10).fill([]).map(o=>{
  return {
    r: Math.random()*200,
    deg: Math.random()*360,
    opacity: 0
  }
})

setInterval(draw,10)
var time = 0;
function Point(r,deg){
  return {
    x:r*Math.cos(deg_to_pi*deg),
    y:r*Math.sin(deg_to_pi*deg)
  }
}
function Color(op){
  return "rgba("+golden+","+op+")";
}
function draw(){
  time+=1;
  ctx.fillStyle = "#111"
  ctx.beginPath();
  ctx.rect(-2000,-2000,4000,4000);
  ctx.fill();
  
  //画雷达
  ctx.strokeStyle = "rgba(255,255,255,.3)";
  ctx.moveTo(-ww/2,0);
  ctx.lineTo(ww/2,0);
  ctx.moveTo(0,wh/2);
  ctx.lineTo(0,-wh/2);
  ctx.stroke();
  
  ctx.strokeStyle = "rgba("+golden+",1)";
  var r = 200;
  
  
  var line_deg = time%360;
  var line_deg_len = 100;
  for(var i=0;i<line_deg_len;i++){
    var deg1 = time-i-1;
    var deg2 = time-i;
    var point1 = Point(r,deg1);
    var point2 = Point(r,deg2);
    var opacity = 1- i/line_deg_len;
    ctx.beginPath();
    ctx.fillStyle = Color(opacity);
    ctx.moveTo(0,0);
    ctx.lineTo(point1.x,point1.y);
    ctx.lineTo(point2.x,point2.y);
    ctx.fill();
  }
  
  enemies.forEach((o)=>{
    ctx.fillStyle = Color(o.opacity);
    var obj_point = Point(o.r,o.deg);
    ctx.beginPath();
    ctx.arc(
      obj_point.x,obj_point.y,
      5,0,2*Math.PI
    );
    ctx.fill();
    
    ctx.strokeStyle = Color(o.opacity);
    var x_size = 6;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(obj_point.x-x_size,obj_point.y+x_size);
    ctx.lineTo(obj_point.x+x_size,obj_point.y-x_size);
    ctx.moveTo(obj_point.x+x_size,obj_point.y+x_size);
    ctx.lineTo(obj_point.x-x_size,obj_point.y-x_size);
    ctx.stroke();
    
    if(Math.abs(o.deg - line_deg)<=1){
      o.opacity = 1;
      $("#message").text("检测到距离："+o.r.toFixed(2)+"海里 角度："+o.deg.toFixed(0));
    }
    o.opacity *=0.99;
    
    ctx.strokeStyle = Color(o.opacity);
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(
      obj_point.x,obj_point.y,
      10*(1/o.opacity/3+0.0001),0,2*Math.PI
    );
    ctx.stroke();
  })
  ctx.strokeStyle = Color(1);
  var split = 120;
  var feature = 15;
  var start_r = 230;
  var len = 5;
  for(let i=0;i<split;i++){
    ctx.beginPath();
    var deg = (i/120) * 360;
    if(i%feature==0){
      len  = 10;
      ctx.lineWidth = 3;
    }else{
      len = 5;
      ctx.lineWidth = 1;
    }
    var point1 = Point(start_r,deg);
    var point2 = Point(start_r+len,deg);
    ctx.moveTo(point1.x,point1.y);
    ctx.lineTo(point2.x,point2.y);
    ctx.stroke();
    
  }
  
  function CondCircle(r,line_width,func_cond){
    ctx.lineWidth = 1;
    ctx.strokeStyle = Color(1);
    ctx.beginPath();
    for(let t=0;t<=360;t++){
      var point = Point(r,t);
      if(func_cond(t)){
        ctx.lineTo(point.x,point.y);
      }else{
        ctx.moveTo(point.x,point.y);
      }
    }
    ctx.stroke();
    
  }
  CondCircle(300,2,function(deg){
    return ((deg+time)%180)<90;
  });
  CondCircle(100,1,function(deg){
    return ((deg+time)%3)<1;
  });
  CondCircle(10,1,function(deg){
    return true;
  });
}