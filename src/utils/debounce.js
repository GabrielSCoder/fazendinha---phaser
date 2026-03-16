export function debounce(func, delay) {
    let timeout; // This variable will hold the timeout ID

    return function (...args) {
        const context = this; // Store the 'this' context for later use

        // Clear any existing timeout to prevent the previous function call from executing
        clearTimeout(timeout);

        // Set a new timeout
        timeout = setTimeout(() => {
            // Execute the original function after the delay, preserving 'this' context and arguments
            func.apply(context, args);
        }, delay);
    };
}