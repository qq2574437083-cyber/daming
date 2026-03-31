// moduleB.js - EventDispatcher implementation

class EventDispatcher {
    constructor() {
        this.events = new Map();
    }

    // Register an event listener
    on(eventName, callback) {
        if (!this.events.has(eventName)) {
            this.events.set(eventName, []);
        }
        this.events.get(eventName).push(callback);
        return this;
    }

    // Unregister an event listener
    off(eventName, callback) {
        if (this.events.has(eventName)) {
            const callbacks = this.events.get(eventName);
            const index = callbacks.indexOf(callback);
            if (index > -1) {
                callbacks.splice(index, 1);
            }
        }
        return this;
    }

    // Dispatch an event
    dispatch(eventName, data = {}) {
        if (this.events.has(eventName)) {
            const callbacks = this.events.get(eventName);
            callbacks.forEach(callback => {
                try {
                    callback(data);
                } catch (error) {
                    console.error(`Error in event dispatcher for ${eventName}:`, error);
                }
            });
        }
        return this;
    }

    // Check if an event has listeners
    hasListeners(eventName) {
        return this.events.has(eventName) && this.events.get(eventName).length > 0;
    }

    // Get all event names
    getEventNames() {
        return Array.from(this.events.keys());
    }

    // Clear all listeners for a specific event
    clearEvent(eventName) {
        if (this.events.has(eventName)) {
            this.events.delete(eventName);
        }
        return this;
    }

    // Clear all listeners
    clearAll() {
        this.events.clear();
        return this;
    }
}

export default EventDispatcher;