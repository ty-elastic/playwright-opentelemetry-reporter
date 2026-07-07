import { FullConfig, TestCase, TestStep } from '@playwright/test/reporter';
/**
 * Creates a hash from the title of a test step.
 *
 * @param {TestStep} step - The test step whose title should be hashed.
 * @returns {string} A hexadecimal representation of the hash value.
 */
export declare function getHashFromStepTitle(test: TestCase, step: TestStep, config: FullConfig): string;
