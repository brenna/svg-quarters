var originRe = /M(\s*)[0-9.]*[\s,][0-9.]*/;
var surface = document.getElementById('surface');
var circle = document.getElementById('circle');
var waveOffset = 0.1;
var gridScale = 2.25;
var numRings = 5;


/* generate diagonal grid points in n concentric rings */
function makeGrid(n){

  //make an array of n empty arrays
  var coords = [];
  while(coords.push([]) <= n);

  for (var x = -n; x <= n; x++){
    for (var y = -n; y <=n; y++){
      if ((x + y)%2 === 0){
        var ringIndex = (Math.abs(x) + Math.abs(y))/2;
        coords[ringIndex].push([x*gridScale,y*gridScale]);
      }
    }
  }

  return coords;
}

/* takes seimclon separated path list, amount to translate in x and y
 returns the same list with the M coordiates translated by a certain amount */
function translatePaths(paths, dx, dy){
  return paths.split(';').map(function(path){
     var origin = originRe.exec(path)[0].split(" ");
     origin[1] = Number(origin[1]) + dx;
     origin[2] = Number(origin[2]) + dy;

     return path.replace(originRe, origin.join(" "));
  }).join(";");
}

/* take a circle elem and clone it but placed at a new location and with an animation start offset */
function cloneCircle(circle, dx, dy, animOffset){
  var clone = circle.cloneNode(true);
  var quads = clone.childNodes;
  for (var i=0; i < quads.length; i++){
    /* eliminate text only nodes, because .children ain't working on mobile
    and .childNodes gets all sorts of garbage */
    if (quads[i].nodeType === 1){
      var paths = quads[i].childNodes[1].getAttribute('values');
      quads[i].childNodes[1].setAttribute('values', translatePaths(paths, dx, dy));
      quads[i].childNodes[1].setAttribute('begin', animOffset);
    }
  }

  surface.appendChild(clone);
}

//make a grid
var gridCoords = makeGrid(numRings);

//then generate the waaaves:
//start at 1. 0 is trivial, it's the original circle
for (var i = 1; i < gridCoords.length; i++){
  gridCoords[i].forEach(function(pos){
    cloneCircle(circle, pos[0], pos[1], waveOffset*i );
  });
}