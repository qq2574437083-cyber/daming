# Event Pool System Documentation

## Overview
The Event Pool System allows for efficient management and processing of events in applications. This documentation covers the structure, usage, and best practices for working with the system.

## How to Use the Event Pool System

### Initialization
To initialize the event pool, you would typically create an instance of the EventPoolSystem class:
```javascript
import EventPoolSystem from './src/index.js';

const eventPool = new EventPoolSystem();
```

### Adding Events
You can add events to the pool using the `emitEvent` method:
```javascript
eventPool.emitEvent('event_name', { data: 'some data' });
```

### Registering Event Listeners
To register event listeners, use the `registerEvent` method:
```javascript
eventPool.registerEvent('event_name', (data) => {
    console.log('Event triggered:', data);
});
```

### Example Usage
Here’s a basic example of how to use the event pool:
```javascript
import EventPoolSystem from './src/index.js';

// Create event pool instance
const eventPool = new EventPoolSystem();

// Register event listener
eventPool.registerEvent('userLoggedIn', (userData) => {
    console.log('User logged in:', userData);
});

// Emit event
eventPool.emitEvent('userLoggedIn', { id: 1, name: 'John Doe' });

// Get event metrics
console.log('Event metrics:', eventPool.getMetrics('userLoggedIn'));

// Get queue size
console.log('Queue size:', eventPool.getQueueSize());
```

## Project Structure

```
project_root/
|-- src/
|   |-- core/
|   |   |-- moduleA.js  # EventQueue implementation
|   |   |-- moduleB.js  # EventDispatcher implementation
|   |   |-- moduleC.js  # EventHandler implementation
|   |   |-- ProgressiveEffects.js  # Progressive effects calculations
|   |-- index.js  # Main EventPoolSystem interface
|-- README.md
```  

## Features
- Event queue management with size limit
- Event dispatching and handling
- Middleware support for event processing
- Event metrics tracking
- Batch event emission
- Progressive effects calculations (linear, exponential, logarithmic growth)

## Conclusion
This documentation provides a brief overview of the Event Pool System. For more in-depth information, refer to the code comments and further documentation as required.