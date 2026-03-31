// Test file for Event Pool System
import EventPoolSystem from './src/index.js';

console.log('Testing Event Pool System...');

// Create event pool instance
const eventPool = new EventPoolSystem();

// Test 1: Register event listener
console.log('\nTest 1: Registering event listener');
eventPool.registerEvent('testEvent', (data) => {
    console.log('Test event triggered with data:', data);
});

// Test 2: Emit event
console.log('\nTest 2: Emitting test event');
eventPool.emitEvent('testEvent', { message: 'Hello, Event Pool!' });

// Test 3: Get event metrics
console.log('\nTest 3: Getting event metrics');
const metrics = eventPool.getMetrics('testEvent');
console.log('Event metrics:', metrics);

// Test 4: Get queue size
console.log('\nTest 4: Getting queue size');
const queueSize = eventPool.getQueueSize();
console.log('Queue size:', queueSize);

// Test 5: Batch emit events
console.log('\nTest 5: Batch emitting events');
eventPool.batchEmit([
    { eventName: 'batchEvent1', data: { id: 1 } },
    { eventName: 'batchEvent2', data: { id: 2 } }
]);

// Test 6: Add middleware
console.log('\nTest 6: Adding middleware');
eventPool.use((eventName, data) => {
    console.log('Middleware processing event:', eventName);
    return { ...data, processed: true };
});

// Test 7: Emit event with middleware
console.log('\nTest 7: Emitting event with middleware');
eventPool.registerEvent('middlewareEvent', (data) => {
    console.log('Middleware event triggered with processed data:', data);
});
eventPool.emitEvent('middlewareEvent', { original: 'data' });

// Test 8: Clear events
console.log('\nTest 8: Clearing events');
eventPool.clear();
console.log('Queue size after clear:', eventPool.getQueueSize());
console.log('Metrics after clear:', eventPool.getMetrics('testEvent'));

// Test 9: Test ProgressiveEffects
console.log('\nTest 9: Testing ProgressiveEffects');
import ProgressiveEffects from './src/core/ProgressiveEffects.js';
console.log('Linear growth:', ProgressiveEffects.linearGrowth(100, 5, 10));
console.log('Exponential growth:', ProgressiveEffects.exponentialGrowth(100, 0.1, 10));
console.log('Logarithmic growth:', ProgressiveEffects.logarithmicGrowth(100, 10, 10));

console.log('\nAll tests completed!');
