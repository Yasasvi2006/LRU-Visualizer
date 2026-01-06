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
}

let lru = null;

function updateStatus(msg) {
    document.getElementById("status-message").innerText = msg;
}

function createCache() {
    let cap = Number(document.getElementById("capacity").value);
    if (cap < 1) return alert("Capacity must be at least 1");
    lru = new LRUCache(cap);
    document.getElementById("capacity-display").innerText = `(Cap: ${cap})`;
    updateStatus(`Cache created with capacity ${cap}`);
    render();
}

function putKey() {
    if (!lru) return alert("Create cache first!");
    let k = document.getElementById("key").value;
    let v = document.getElementById("value").value;
    if (!k || !v) return;
    
    lru.put(k, v);
    updateStatus(`Put: Key ${k}, Value ${v}`);
    render();
}

function getKey() {
    if (!lru) return alert("Create cache first!");
    let k = document.getElementById("key").value;
    let res = lru.get(k);
    
    if (res === -1) {
        updateStatus(`Get: Key ${k} NOT FOUND`);
    } else {
        updateStatus(`Get: Key ${k} found. Value: ${res}`);
    }
    render();
}

function render() {
    let div = document.getElementById("cache");
    div.innerHTML = "";
    
    let curr = lru.head.next;
    let nodesArray = [];
    while (curr !== lru.tail) {
        nodesArray.push(curr);
        curr = curr.next;
    }

    if (nodesArray.length === 0) {
        div.innerHTML = '<p class="empty-msg">Cache is currently empty</p>';
        return;
    }

    nodesArray.forEach((node, index) => {
        // Create Node Box
        let nodeDiv = document.createElement("div");
        nodeDiv.className = "node";
        
        // Add Head/Tail classes
        if (index === 0) nodeDiv.classList.add("head-node");
        if (index === nodesArray.length - 1) nodeDiv.classList.add("tail-node");

        nodeDiv.innerHTML = `
            <span class="key">KEY: ${node.key}</span>
            <span class="val">${node.value}</span>
        `;
        div.appendChild(nodeDiv);

        // Add Arrow
        if (index < nodesArray.length - 1) {
            let arrow = document.createElement("div");
            arrow.className = "arrow";
            arrow.innerHTML = "⇄";
            div.appendChild(arrow);
        }
    });
}
