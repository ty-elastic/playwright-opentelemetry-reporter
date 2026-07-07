"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHashFromStepTitle = getHashFromStepTitle;
const crypto_1 = require("crypto");
const format_test_title_1 = require("./format-test-title");
/**
 * Creates a hash from the title of a test step.
 *
 * @param {TestStep} step - The test step whose title should be hashed.
 * @returns {string} A hexadecimal representation of the hash value.
 */
function getHashFromStepTitle(test, step, config) {
    const fullTitle = (0, format_test_title_1.formatTestTitle)(config, test, step);
    const hash = (0, crypto_1.createHash)('sha256').update(fullTitle).digest('hex');
    return hash;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2V0LWhhc2gtZnJvbS1zdGVwLXRpdGxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2xpYi9nZXQtaGFzaC1mcm9tLXN0ZXAtdGl0bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFZQSxvREFRQztBQXBCRCxtQ0FBb0M7QUFJcEMsMkRBQXNEO0FBRXREOzs7OztHQUtHO0FBQ0gsU0FBZ0Isb0JBQW9CLENBQ2xDLElBQWMsRUFDZCxJQUFjLEVBQ2QsTUFBa0I7SUFFbEIsTUFBTSxTQUFTLEdBQUcsSUFBQSxtQ0FBZSxFQUFDLE1BQU0sRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDdEQsTUFBTSxJQUFJLEdBQUcsSUFBQSxtQkFBVSxFQUFDLFFBQVEsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDbEUsT0FBTyxJQUFJLENBQUM7QUFDZCxDQUFDIn0=