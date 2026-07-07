import { FullConfig } from '@playwright/test';
import { TestCase, TestStep } from '@playwright/test/reporter';
export declare function formatTestTitle(config: FullConfig, test: TestCase, step?: TestStep, omitLocation?: boolean): string;
export declare function relativeFilePath(config: FullConfig, file: string): string;
export declare function stepSuffix(step: TestStep | undefined): string;
