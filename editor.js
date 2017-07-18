onload=function(){
  
  // Add one button for each shape
  for(i in shapes){
    b.innerHTML += `<button id="b_${i}">${i}</button>`;
  }

  // Build the grid (6x6)
  for(i=0;i<6;i++){
    for(j=0;j<6;j++){
      grid.innerHTML+=`<div class=tile style=top:${i*500}px;left:${j*500}px></div>`;
    }
  }

  // Switch between 2D iso, 3D, and 3D FPS views by applying a class to the body
  b_3D.onclick = function(){b.className = ""};
  b_2D.onclick = function(){b.className = "iso"};
  b_fps.onclick = function(){b.className = "fps"};

  // Move/rotate the scene relative to the center (the red square)
  
  // Position
  x = -1500;
  y = -1500;
  z = 0;

  // Rotation
  rot = 0;

  // Apply new position/rotation.
  move_scene = function(){
    
    // Update scene's transformOrogin/transform
    scene.style.transformOrigin = (-x) + "px " + (-y) + "px";
    scene.style.transform = "translateX(" + x + "px) translateY(" + y + "px) translateZ(" + z + "px) rotateZ(" + rot + "rad)";
    
    // The grid moves up and down to follow the center
    grid.style.transform = "translateZ(" + (-z) + "px)";
  }
  move_scene();
  
  // Moving left/right/front/back requires to take the current angle into account.
  // That's what these functions do for x and y offsets relative to the current angle.
  xoffset = function(o){
    x += o * Math.cos(rot);
    y += o * Math.sin(rot);
  }
  yoffset = function(o){
    y += o * Math.cos(rot);
    x += o * Math.sin(rot);
  }
  
  // All the move/rotate buttons
  b_rl.onclick = function(){rot -= Math.PI/4; move_scene()};
  b_rr.onclick = function(){rot += Math.PI/4; move_scene()};
  b_mr.onclick = function(){xoffset(-500); move_scene()};
  b_ml.onclick = function(){xoffset(500); move_scene()};
  b_md.onclick = function(){if(z<0) z += 500; move_scene()};
  b_mu.onclick = function(){z -= 500; move_scene()};
  b_mf.onclick = function(){yoffset(-500); move_scene()};
  b_mb.onclick = function(){yoffset(500); move_scene()};
  
  // Rotate last 3D shape
  last_shape_angle = 0;
  b_rot.onclick = function(){
    last_shape_angle += Math.PI/2;
    if(top["shape"+(shapes_count-1)]){
      top["shape"+(shapes_count-1)].style.transform = top["shape"+(shapes_count-1)].style.transform.replace(/$|rotateZ\(.*?\)$/, "rotateZ(" + last_shape_angle + "rad)");
      data[data.length-1].angle = (parseFloat((last_shape_angle/(Math.PI*2)).toFixed(2))%1);
    }
  };
  
  // Delete last shape
  last_shape = null;
  b_del.onclick = function(){
    last_shape.remove();
    data.pop();
  };
  
  // Export
  b_export.onclick = function(){console.log(JSON.stringify(data))};
  
  // Current shape
  shape = "cube";
  
  // Buttons change the current shape
  for(i in shapes){
    (function(i){
      top["b_" + i].onclick = function(){ shape = i; };
    })(i);
  }
  
  // Preview current shape when hovering the grid
  onmousemove = e => {
    if(e.target.className == "tile"){
      if(shapes[shape].type == "shape_3d"){
        e.target.innerHTML = `<div class="shape temp shape_3d ${shape}">${shapes[shape].template}</div>`;
      }
      else if(shapes[shape].type == "shape_sprite"){
      e.target.innerHTML = `<div class="shape temp shape_sprite ${shape}" style="transform: translateX(0) translateY(0) translateZ(0) rotateX(-90deg) rotateY(${rot}rad)">${shapes[shape].template}</div>`;
      }
    }
  }
  
  onmouseout = e => {
    if(e.target.className == "tile"){
      e.target.innerHTML = "";
    }
  }
  
  // Click to place a shape with an angle set to 0 and save it in the map's data
  data = [];
  shapes_count = 0;
  sprites_count = 0;
  sprites_styles = [];
  onclick = e => {
    if(e.which == 1){
      if(e.target.className == "tile"){
        data.push({type: shape, x: parseInt(e.target.style.left)/500, y: parseInt(e.target.style.top)/500, z: -z / 500, angle: 0});
        if(shapes[shape].type == "shape_3d"){
          things.innerHTML += `<div id="shape${shapes_count}" class="shape shape_3d ${shape}" style="transform:translateX(0) translateY(0) translateZ(${(250-z)}px);left:${e.target.style.left};top:${e.target.style.top}">${shapes[shape].template}</div>`; 
          last_shape=top["shape"+shapes_count];
          shapes_count++;
          last_shape_angle = 0;
        }
        else if(shapes[shape].type == "shape_sprite"){
          sprites_styles[sprites_count] = `translateX(0) translateY(0) translateZ(${-z}px) rotateX(-90deg)`;
          things.innerHTML += `<div id="sprite${sprites_count}" class="shape shape_sprite ${shape}" style="transform:${sprites_styles[sprites_count]} rotateY(${rot}rad);left:${e.target.style.left};top:${e.target.style.top}">${shapes[shape].template}</div>`;
          last_shape=top["sprite"+sprites_count];
          sprites_count++;
        }
      }
    }
  }
  
  // Sprites (snail, ball...) always face the camera.
  // This is executed at each frame.
  setInterval(function(){
    for(i = 0; i < sprites_count; i++){
      if(top["sprite" + i]){
        top["sprite" + i].style.transform = sprites_styles[i] + " rotateY(" + (rot) + "rad)";
      }
    }
  }, 33);
  
}