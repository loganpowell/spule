/**
 * 
 * Helper Promise wrapper to inject a delay into a Task
 */
export const msTaskPromiseDelay = ms => new Promise(resolve => setTimeout(resolve, ms))