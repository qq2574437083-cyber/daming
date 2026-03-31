// index.js

// Importing core modules
import EventQueue from './core/moduleA';
import EventDispatcher from './core/moduleB';
import EventHandler from './core/moduleC';
import ProgressiveEffects from './core/ProgressiveEffects';

// Main EventPoolSystem interface
class EventPoolSystem {
    constructor(maxQueueSize = 1000, enablePriority = true) {
        this.queue = new EventQueue(maxQueueSize);
        this.dispatcher = new EventDispatcher();
        this.handler = new EventHandler();
        this.progressiveEffects = ProgressiveEffects;
        this.enablePriority = enablePriority;
        this.eventMetrics = new Map();
        this.middlewares = [];
    }

    // Register event with priority support
    registerEvent(eventName, callback, priority = 0) {
        this.handler.on(eventName, callback);
        if (!this.eventMetrics.has(eventName)) {
            this.eventMetrics.set(eventName, { count: 0, lastTriggered: null });
        }
        return this;
    }

    // Emit events with middleware processing
    emitEvent(eventName, data = {}) {
        let processedData = data;
        
        // Process middlewares
        for (const middleware of this.middlewares) {
            processedData = middleware(eventName, processedData);
        }

        // Add to queue
        this.queue.enqueue({ eventName, data: processedData, timestamp: Date.now() });

        // Update metrics
        const metrics = this.eventMetrics.get(eventName);
        if (metrics) {
            metrics.count++;
            metrics.lastTriggered = new Date();
        }

        // Dispatch event
        this.handler.emit(eventName, processedData);
        return this;
    }

    // Remove event listener
    removeEvent(eventName, callback) {
        this.handler.off(eventName, callback);
        return this;
    }

    // Add middleware for event processing
    use(middleware) {
        this.middlewares.push(middleware);
        return this;
    }

    // Get event metrics
    getMetrics(eventName) {
        return this.eventMetrics.get(eventName) || null;
    }

    // Clear all events
    clear() {
        this.eventMetrics.clear();
        this.queue.clear();
        return this;
    }

    // Get current queue size
    getQueueSize() {
        return this.queue.size();
    }

    // Batch emit events
    batchEmit(events) {
        events.forEach(({ eventName, data }) => {
            this.emitEvent(eventName, data);
        });
        return this;
    }
}

// Exporting all modules
export { EventQueue, EventDispatcher, EventHandler, ProgressiveEffects };
export default EventPoolSystem;