(function(){
  // 1920x1080

  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');

  const btns = [document.querySelector('.btn-u'),
    document.querySelector('.btn-l'),
    document.querySelector('.btn-r'),
    document.querySelector('.btn-d')];

  const stars = document.querySelector('.cele');
  const wonWin = document.querySelector('.win-cont');

  ctx.beginPath();
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, 1000, 1000);

  let path = [{x: 0, y: 0}],
    r = 0,
    c = 0,
    dnbt = true,
    dirc = [0, 1, 2, 3],
    edgy = [0, 0, 0, 0],
    ed = 0,
    vi = 0,
    go;

  let chr = {x: 13, y: 17, w: 20, h: 20,
      draw() {
        ctx.fillStyle = '#364652';
        ctx.fillRect(this.x, this.y, this.w, this.h);},
      clean() {
        trl.push(this.x, this.y, this.w, this.h);
        ctx.fillStyle = 'white';
        ctx.fillRect(this.x, this.y, this.w, this.h);} },
    trl = [],
    colld = [],
    lane = [],
    t = {
      tar: null,
      typ: null,
      get mv2() {
        if (!collide()) {
          return 3;
        } else {
          return -4;
        } } },
    ghost = [],
    sparkles = {
      clr() {
        let r = Math.abs(Math.floor(Math.random()*(0-255)));
        let g = Math.abs(Math.floor(Math.random()*(0-255)));
        let b = Math.abs(Math.floor(Math.random()*(0-255)));
        return `rgb(${r}, ${g}, ${b})`;},
      range(w) {
        if (!w) {
          return (trl[0]+trl[2])-trl[0];
        } else if (w === 1) {
          return (trl[1]+trl[3])-trl[1];
        } else if (w === 2) {
          return (trl[1]+trl[3])-trl[1];
        } else if (w === 3) {
          return (trl[0]+trl[2])-trl[0];
        }
      } };

  var cells = new Array(20);
  for (let d=0; d<20; d++) {
    //first index rows
    cells[d] = [];
    for (let v=0; v<20; v++) {
      //second cols... false means unvistsed
      cells[d][v] = false;
      ctx.fillStyle = '#364652';
      ctx.fillRect(d*50, v*50, 10, 50);
      colld.push({x: d*50, y: v*50, w: 10, h: 50});
      ctx.fillRect(d*50, v*50, 50, 10);
      colld.push({x: d*50, y: v*50, w: 50, h: 10});
    }
  }

  cells[0][0] = true;

  //some ways in n out
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 10, 10, 40);
  ctx.fillRect(1000, 960, 10, 40);

  ctx.fillStyle = '#364652';
  ctx.fillRect(1000, 0, 10, 960);
  ctx.fillRect(0, 1000, 1010, 10);

  function edges() {
    if (r === 0 && ed < 1) {
      edgy[0] = 1;
      dirc = dirc.filter(x => x !== 0);
    } else if (c === 0 && ed === 1) {
      edgy[1] = 1;
      dirc = dirc.filter(x => x !== 1);
    } else if (c === 19 && ed === 2) {
      edgy[2] = 1;
      dirc = dirc.filter(x => x !== 2);
    } else if (r === 19 && ed === 3) {
      edgy[3] = 1;
      dirc = dirc.filter(x => x !== 3);
    } else if (ed === 4) {
      //having iterated through the above condz the last time here presumbaly has logged all edges if any and now checks 4 visisted cells by only iterating through the cells that actually exist
      let friedRice = dirc;
      //once dirc has been altered by noEdgeNeighbour it affects the for loop and we don't want that hence the tasty clone
      for (let i = 0; i < friedRice.length; i++) {
        vi = friedRice[i];
        noEdgeNeighbour();
      }
    }
  }

  function noEdgeNeighbour() {
    //vi n the for loop in edges allows us 2 check for visisted cells without tryna find a value for a cell that doesn't exist in the arr and thus getting an undefined error and killing my sweet bb
    if (vi < 1 && cells[r-1][c]) {
        dirc = dirc.filter(x => x !== 0);
    } else if (vi === 1 && cells[r][c-1]) {
        dirc = dirc.filter(x => x !== 1);
    } else if (vi === 2 && cells[r][c+1]) {
        dirc = dirc.filter(x => x !== 2);
    } else if (vi === 3 && cells[r+1][c]) {
        dirc = dirc.filter(x => x !== 3);
    }
    if (!dirc.length) {
      //ie nowhere 2 gooo
      backtrack();
    }
  }

  function conjureCalc() {
    return dirc[Math.floor(Math.random()*dirc.length)];
  }

  function ymir() {
    dnbt = true;
    while (ed <= 5) {
      edges();
      ed++;
    }
    if (dnbt) {
      go = conjureCalc();
      if (go === 0) {
        r--;
      } else if (go === 1) {
        c--;
      } else if (go === 2) {
        c++;
      } else if (go === 3) {
        r++;
      }
    }
    cells[r][c] = true;
    curse();
  }

  function backtrack() {
    if (!path.length) {
      path = [{x: 0, y:0}]
    }
    let last = path.length-1;
    r = path[last].y;
    c = path[last].x;
    path.splice(-1, 1);
    dnbt = false;
  }

  function curse() {
    if (dnbt) {
      //dont wanna repush same cell thts just backtracked
      let newPath = Object.create(path[0]);
      newPath.x = c;
      newPath.y = r;
      path.push(newPath);
      artistCheck(go, c, r);
    }
    edgy = [0, 0, 0, 0];
    dirc = [0, 1, 2, 3];
    ed = 0;
    vi = 0;
    setTimeout(function() {
      if (!fini()) {
        ymir();
      } else {
        theseus();
      }
    }, 1);
  }

  function fini() {
    let dn = cells.flat();
    let ge = dn.every(x => x);
    if (ge) {
      return true;
    } else {
      return false;
    }
  }

  function artistCheck(dirt, x, y) {
    ctx.fillStyle = 'white';
    if (dirt === 0) {
      lane.push({x: x*50, y: (y+1)*50, w: 50, h: 10});
      ctx.fillRect(x*50+10, (y+1)*50, 40, 10);
    } else if (dirt === 1) {
      lane.push({x: (x+1)*50, y: y*50, w: 10, h: 50});
      ctx.fillRect((x+1)*50, y*50+10, 10, 40);
    } else if (dirt === 2) {
      lane.push({x: x*50, y: y*50, w: 10, h: 50});
      ctx.fillRect(x*50, y*50+10, 10, 40);
    } else if (dirt === 3) {
      lane.push({x: x*50, y: y*50, w: 50, h: 10});
      ctx.fillRect(x*50+10, y*50, 40, 10);
    }
    setBoundaries(go);
  }

  function setBoundaries(fscp) {
    let door = lane[lane.length-1];
    for (let i=0; i<colld.length; i++) {
      //for future ref objs in arrays!!! cannot!!! simply be compared as objs n not as prop/val pairs!!!
      if (colld[i].x === door.x && colld[i].y === door.y && colld[i].w === door.w && colld[i].h === door.h) {
        colld.splice(i, 1);
        if (go === 2 || go === 1) {
          colld.push({x: door.x, y: door.y, w: 10, h: 10});
        }
        break;
      }
    }
  }

  ymir();

  function theseus() {
    chr.draw();
    for (let i=0; i<4; i++) {
      //dude idek if this is allowed or whateveeer but like whether i do this or no interval or just cb theseus over n over makes no explicit difference... once listeners r added are they like eternal n global even within a function? the bug's prolly something to do with this but for now this just seems the safest
      setInterval(function() {
        btns[i].addEventListener('touchstart', dealer, false);
        btns[i].addEventListener('touchend', brakes, false);
      }, 10);
    }
  }

  function surrounds() {
    return colld.filter(x => x.x < chr.x+50 && x.x > chr.x-50 && x.y < chr.y+50 && x.y > chr.y-50);
  }

  function dealer(e) {
    if (e.cancelable) {
      //otherwise throws an error, idk if pD even needed on btns now since they wouldn't scroll the page anyway, they just get pressed
      e.preventDefault();
    }
    t.tar = btns.findIndex(x => x === e.target);
    t.typ = 0;
    ghost.push(t.tar);
    trl.push(chr.x, chr.y, chr.w, chr.h);
    if (!collide()) {
      move(t.tar);
    }
  }

  function brakes(e) {
    t.typ = 1;
    move(t.tar);
  }

  function move(b) {
    chr.clean();
    sickGraphics();
    if (b === 0) {
      chr.y -= t.mv2;
    } else if (b === 1) {
      chr.x -= t.mv2;
    } else if (b === 2) {
      chr.x += t.mv2;
    } else {
      chr.y += t.mv2;
    }
    chr.draw();
    if (!collide() && !t.typ) {
      //100000% the bug is 2 do w timeouts n their major air of mystery but like without it if move is immediately recursed 2 it's so speedy... too speedy... acc im p convinced the issue is just poor performance like timeouts are queued until everything else is done n theres a lot 2 do in move :/
      window.setTimeout(function() {move(t.tar); }, 5);
    }
  }

  function collide() {
    let prox = surrounds();
    //v lazily accounting 4 a couple of walls earlier forgotten...
    prox.push({x: 1000, y: 0, w: 10, h: 960});
    prox.push({x: 0, y: 1000, w: 1010, h: 10});
    if (chr.x > 955 && chr.y > 955) {
      winner();
      return;
    }
    for (let i=0; i<prox.length; i++) {
      ctx.fillStyle = '#364652';
      ctx.fillRect(prox[i].x, prox[i].y, prox[i].w, prox[i].h);
      if (chr.x-1 < prox[i].x+prox[i].w && chr.x+chr.w+1 > prox[i].x && chr.y-1 < prox[i].y+prox[i].h && chr.y+chr.h+1 > prox[i].y) {
        return true;
      }
    }
  }

  function sickGraphics() {
    let v;
    let d = ghost[ghost.length-1];
    v = sparkles.range(d);
    let pxl = Math.floor(v/10);
    for (let i=0; i<v/2; i++) {
      ctx.fillStyle = sparkles.clr();
      if (!d) {
        ctx.fillRect(trl[0]+(pxl*i), trl[1]+17, pxl, 3);
      } else if (d === 1) {
        ctx.fillRect(trl[0]+17, trl[1]+(pxl*i), 3, pxl);
      } else if (d === 2) {
        ctx.fillRect(trl[0], trl[1]+(pxl*i), 3, pxl);
      } else if (d === 3) {
        ctx.fillRect(trl[0]+(pxl*i), trl[1], pxl, 3);
      }
    }
    trl = [];
    ghost = ghost.splice(-1, 2);
  }

  function winner() {
    for (let i=0; i<3; i++) {
      stars.children[i].classList.toggle('invisi');
    }
    wonWin.classList.toggle('invisi');
  }

}());
