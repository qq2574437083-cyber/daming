// moduleA.js - EventQueue implementation

class EventQueue {
    constructor(maxSize = 1000) {
        this.queue = [];
        this.maxSize = maxSize;
    }

    enqueue(event) {
        if (this.queue.length >= this.maxSize) {
            // Remove oldest event if queue is full
            this.queue.shift();
        }
        this.queue.push(event);
        return this;
    }

    dequeue() {
        return this.queue.shift();
    }

    clear() {
        this.queue = [];
        return this;
    }

    size() {
        return this.queue.length;
    }

    isEmpty() {
        return this.queue.length === 0;
    }

    peek() {
        return this.queue[0] || null;
    }
}

export default EventQueue;