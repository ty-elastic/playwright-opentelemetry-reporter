import { createHash } from 'crypto';
import { formatTestTitle } from './format-test-title';
/**
 * Creates a hash from the title of a test step.
 *
 * @param {TestStep} step - The test step whose title should be hashed.
 * @returns {string} A hexadecimal representation of the hash value.
 */
export function getHashFromStepTitle(test, step, config) {
    const fullTitle = formatTestTitle(config, test, step);
    const hash = createHash('sha256').update(fullTitle).digest('hex');
    return hash;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2V0LWhhc2gtZnJvbS1zdGVwLXRpdGxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2xpYi9nZXQtaGFzaC1mcm9tLXN0ZXAtdGl0bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLFFBQVEsQ0FBQztBQUlwQyxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0scUJBQXFCLENBQUM7QUFFdEQ7Ozs7O0dBS0c7QUFDSCxNQUFNLFVBQVUsb0JBQW9CLENBQ2xDLElBQWMsRUFDZCxJQUFjLEVBQ2QsTUFBa0I7SUFFbEIsTUFBTSxTQUFTLEdBQUcsZUFBZSxDQUFDLE1BQU0sRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDdEQsTUFBTSxJQUFJLEdBQUcsVUFBVSxDQUFDLFFBQVEsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDbEUsT0FBTyxJQUFJLENBQUM7QUFDZCxDQUFDIn0=