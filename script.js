class Node {
  constructor(key, value) {
    this.key = key;
    this.value = value;
    this.next = null;
    this.prev = null;
  }
}

class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.m = new Map();

    this.head = new Node(-1, -1);
    this.tail = new Node(-1, -1);

    this.head.next = this.tail;
    this.tail.prev = this.head;
  }

  get(key) {
    if (!this.m.has(key)) return -1;

    let node = this.m.get(key);
    this.delete(node);
    this.insertAfterHead(node);
    return node.value;
  }

  put(key, value) {
    if (this.m.has(key)) {
      let node = this.m.get(key);
      node.value = value;
      this.delete(node);
      this.insertAfterHead(node);
    } else {
      if (this.m.size === this.capacity) {
        let node = this.tail.prev;
        this.m.delete(node.key);
        this.delete(node);
      }
      let nn = new Node(key, value);
      this.insertAfterHead(nn);
      this.m.set(key, nn);
    }
  }

  insertAfterHead(node) {
    let after = this.head.next;
    node.next = after;
    node.prev = this.head;
    after.prev = node;
    this.head.next = node;
  }

  delete(node) {
    let before = node.prev;
    let after = node.next;
    before.next = after;
    after.prev = before;
  }

  getCacheKeys() {
    let res = [];
    let curr = this.head.next;
    while (curr !== this.tail) {
      res.push(curr.key);
      curr = curr.next;
    }
    return res;
  }
}

let lru = null;

function createCache() {
  let cap = Number(document.getElementById("capacity").value);
  lru = new LRUCache(cap);
  render();
}

function putKey() {
  let key = Number(document.getElementById("key").value);
  let value = Number(document.getElementById("value").value);
  lru.put(key, value);
  render();
}

function getKey() {
  let key = Number(document.getElementById("key").value);
  let res = lru.get(key);
  alert(res === -1 ? "Key not found" : "Value = " + res);
  render();
}

function render() {
  let div = document.getElementById("cache");
  div.innerHTML = "";

  let keys = lru.getCacheKeys();
  keys.forEach(k => {
    let box = document.createElement("div");
    box.className = "box";
    box.innerText = k;
    div.appendChild(box);
  });
}
