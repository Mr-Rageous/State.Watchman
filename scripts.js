/*
Reference Documentation for 'Object.defineProperty()':
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty
*/

// State controller
const State = {
    // Internal storage for properties
    _values: {},
    _listeners: {},

    // Generic addEventListener method
    watchman: {
        addEventListener: function (property, listener) {
            // If internal listeners does not have this property
            if (!State._listeners[property]) {
                // Create it and set it to empty
                State._listeners[property] = [];
                
                // Define getter and setter dynamically
                Object.defineProperty(State, property, {
                    get: function () {
                        // Get the internal value for property
                        return State._values[property];
                    },
                    set: function (value) {
                        // Set the internal value for property
                        State._values[property] = value;
                        // Call all listeners for this property and passes in value
                        State._listeners[property].forEach(listener => listener(value));
                    },
                    // Allows external modification
                    configurable: true,
                });
            }

            // Add the new listener
            State._listeners[property].push(listener);
        },
        // Remove an event listener for a given property
        removeEventListener: function (prop, listener) {
            if (!State._listeners[prop]) return;

            if (listener) {
                // Remove specific listener
                State._listeners[prop] = State._listeners[prop].filter(fn => fn !== listener);
            } else {
                // Remove all listeners for the property
                delete State._listeners[prop];
            }
        }
    }
};

// Define listeners
const listener1 = (newValue) => console.log("[INFO] Listener 1: User changed to", newValue);
const listener2 = (newValue) => console.log("[INFO] Listener 2: User changed to", newValue);

// Add listeners
State.watchman.addEventListener("user", listener1);
State.watchman.addEventListener("user", listener2);

// Change user value
console.log('Changing user value to "Alice"');
State.user = "Alice";

// Remove one listener
console.log('Removing listener1 from "user"');
State.watchman.removeEventListener("user", listener1);

// Change user value
console.log('Changing user value to "Bob"');
State.user = "Bob";

// Remove all listeners for 'user'
console.log('Removing all listeners for "user"');
State.watchman.removeEventListener("user");

console.log(`State.user = "${State.user}"`);