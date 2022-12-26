 precision mediump float;
 varying float v_Alpha;
 void main(){
   float dist = distance(gl_PointCoord,vec2(0.5,0.5));
   if(dist < 0.5){
     gl_FragColor = vec4(0.87,0.91,0,v_Alpha);
   }else{
     discard;
   }
 }