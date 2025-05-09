class Node {
    constructor(val, color = 'red') {
      this.value = val;
      this.color = color;
      this.left = this.right = this.parent = null;
    }
  }
  
  class RBTree {
    constructor() {
      this.nil = new Node(null, 'black');
      this.root = this.nil;
    }
  
    leftRotate(x) {
      const y = x.right;
      x.right = y.left;
      if (y.left !== this.nil) y.left.parent = x;
      y.parent = x.parent;
  
      if (!x.parent) this.root = y;
      else if (x === x.parent.left) x.parent.left = y;
      else x.parent.right = y;
  
      y.left = x;
      x.parent = y;
    }
  
    rightRotate(y) {
      const x = y.left;
      y.left = x.right;
      if (x.right !== this.nil) x.right.parent = y;
      x.parent = y.parent;
  
      if (!y.parent) this.root = x;
      else if (y === y.parent.left) y.parent.left = x;
      else y.parent.right = x;
  
      x.right = y;
      y.parent = x;
    }
  
    insert(val) {
      let z = new Node(val);
      z.left = z.right = this.nil;
  
      let y = null, x = this.root;
      while (x !== this.nil) {
        y = x;
        x = (z.value < x.value ? x.left : x.right);
      }
  
      z.parent = y;
      if (!y) this.root = z;
      else if (z.value < y.value) y.left = z;
      else y.right = z;
  
      z.color = 'red';
      this.insertFix(z);
    }
  
    insertFix(z) {
      while (z.parent && z.parent.color === 'red') {
        let p = z.parent, g = p.parent;
  
        if (p === g.left) {
          let u = g.right;
  
          if (u.color === 'red') {
            p.color = u.color = 'black';
            g.color = 'red';
            z = g;
          } else {
            if (z === p.right) {
              z = p;
              this.leftRotate(z);
            }
            p.color = 'black';
            g.color = 'red';
            this.rightRotate(g);
          }
        } else {
          let u = g.left;
  
          if (u.color === 'red') {
            p.color = u.color = 'black';
            g.color = 'red';
            z = g;
          } else {
            if (z === p.left) {
              z = p;
              this.rightRotate(z);
            }
            p.color = 'black';
            g.color = 'red';
            this.leftRotate(g);
          }
        }
      }
      this.root.color = 'black';
    }
  
    transplant(u, v) {
      if (!u.parent) this.root = v;
      else if (u === u.parent.left) u.parent.left = v;
      else u.parent.right = v;
      v.parent = u.parent;
    }
  
    minimum(x) {
      while (x.left !== this.nil) x = x.left;
      return x;
    }
  
    remove(val) {
      let z = this.searchNode(val);
      if (!z) return;
  
      let y = z, yc = y.color, x;
  
      if (z.left === this.nil) {
        x = z.right;
        this.transplant(z, z.right);
      } else if (z.right === this.nil) {
        x = z.left;
        this.transplant(z, z.left);
      } else {
        y = this.minimum(z.right);
        yc = y.color;
        x = y.right;
  
        if (y.parent === z) x.parent = y;
        else {
          this.transplant(y, y.right);
          y.right = z.right;
          y.right.parent = y;
        }
  
        this.transplant(z, y);
        y.left = z.left;
        y.left.parent = y;
        y.color = z.color;
      }
  
      if (yc === 'black') this.deleteFix(x);
    }
  
    deleteFix(x) {
      while (x !== this.root && x.color === 'black') {
        let w;
  
        if (x === x.parent.left) {
          w = x.parent.right;
  
          if (w.color === 'red') {
            w.color = 'black';
            x.parent.color = 'red';
            this.leftRotate(x.parent);
            w = x.parent.right;
          }
  
          if (w.left.color === 'black' && w.right.color === 'black') {
            w.color = 'red';
            x = x.parent;
          } else {
            if (w.right.color === 'black') {
              w.left.color = 'black';
              w.color = 'red';
              this.rightRotate(w);
              w = x.parent.right;
            }
  
            w.color = x.parent.color;
            x.parent.color = 'black';
            w.right.color = 'black';
            this.leftRotate(x.parent);
            x = this.root;
          }
  
        } else {
          w = x.parent.left;
  
          if (w.color === 'red') {
            w.color = 'black';
            x.parent.color = 'red';
            this.rightRotate(x.parent);
            w = x.parent.left;
          }
  
          if (w.right.color === 'black' && w.left.color === 'black') {
            w.color = 'red';
            x = x.parent;
          } else {
            if (w.left.color === 'black') {
              w.right.color = 'black';
              w.color = 'red';
              this.leftRotate(w);
              w = x.parent.left;
            }
  
            w.color = x.parent.color;
            x.parent.color = 'black';
            w.left.color = 'black';
            this.rightRotate(x.parent);
            x = this.root;
          }
        }
      }
  
      x.color = 'black';
    }
  
    searchNode(val) {
      let x = this.root;
      while (x !== this.nil && x.value !== val)
        x = (val < x.value ? x.left : x.right);
      return x === this.nil ? null : x;
    }
  
    search(val) {
      let x = this.root, path = [];
      while (x !== this.nil && x.value !== val) {
        path.push(x);
        x = (val < x.value ? x.left : x.right);
      }
      if (x !== this.nil) path.push(x);
      return { node: x === this.nil ? null : x, path };
    }
  }
  
  // Ініціалізація
  const tree = new RBTree();
  const init = [50, 30, 70, 20, 40, 60, 80];
  init.forEach(v => tree.insert(v));
  
  const svg = document.getElementById('tree-svg');
  
  function drawTree() {
    svg.innerHTML = '';
    let arr = [];
  
    (function dfs(n, d, x0, x1) {
      if (n === tree.nil) return;
      const x = (x0 + x1) / 2, y = 50 + d * 80;
      arr.push({ n, x, y });
      dfs(n.left, d + 1, x0, x);
      dfs(n.right, d + 1, x, x1);
    })(tree.root, 0, 0, svg.clientWidth);
  
    arr.forEach(o => {
      if (o.n.left !== tree.nil) {
        let c = arr.find(e => e.n === o.n.left);
        svg.appendChild(line(o.x, o.y, c.x, c.y));
      }
      if (o.n.right !== tree.nil) {
        let c = arr.find(e => e.n === o.n.right);
        svg.appendChild(line(o.x, o.y, c.x, c.y));
      }
    });
  
    arr.forEach(o => {
      svg.appendChild(circle(o.x, o.y, o.n));
      svg.appendChild(text(o.x, o.y, o.n.value));
    });
  }
  
  function line(x1, y1, x2, y2) {
    let l = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    l.setAttribute('class', 'link');
    l.setAttribute('x1', x1);
    l.setAttribute('y1', y1);
    l.setAttribute('x2', x2);
    l.setAttribute('y2', y2);
    return l;
  }
  
  function circle(x, y, n) {
    let c = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    c.setAttribute('class', 'node ' + (n.color === 'red' ? 'red' : 'black'));
    c.setAttribute('cx', x);
    c.setAttribute('cy', y);
    c.setAttribute('r', 22);
    return c;
  }
  
  function text(x, y, v) {
    let t = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    t.setAttribute('x', x);
    t.setAttribute('y', y + 6);
    t.setAttribute('text-anchor', 'middle');
    t.setAttribute('fill', '#fff');
    t.setAttribute('font-size', '12px');
    t.textContent = v;
    return t;
  }
  
  function highlight(path) {
    drawTree();
    path.forEach(n => {
      document.querySelectorAll('text').forEach(t => {
        if (+t.textContent === n.value)
          t.previousSibling.classList.add('highlight');
      });
    });
  }
  
  // Події
  window.searchShip = () => {
    let k = +document.getElementById('pirateCount').value;
    if (isNaN(k)) return;
    let r = tree.search(k);
    if (r.node) highlight(r.path);
    else {
      tree.insert(k);
      drawTree();
      highlight(tree.search(k).path);
    }
  };
  
  window.removeShip = () => {
    let k = +document.getElementById('groundCount').value;
    if (isNaN(k)) return;
    tree.remove(k);
    drawTree();
  };
  
  window.resetTree = () => {
    tree.root = tree.nil;
    init.forEach(v => tree.insert(v));
    drawTree();
  };
  
  drawTree();
  