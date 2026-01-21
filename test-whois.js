const whoiser = require('whoiser');
console.log('Type:', typeof whoiser);
console.log('Keys:', Object.keys(whoiser));
console.log('Is function?', typeof whoiser === 'function');
console.log('whoiser.default?', whoiser.default);
