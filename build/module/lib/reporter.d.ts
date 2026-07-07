import { FullConfig, Reporter, TestCase, TestResult, TestStep } from '@playwright/test/reporter';
declare class OpenTelemetryReporter implements Reporter {
    private config;
    private testSpans;
    private stepSapns;
    private tracer;
    constructor();
    onBegin(config: FullConfig): void;
    onTestBegin(test: TestCase, result: TestResult): void;
    onTestEnd(test: TestCase, result: TestResult): void;
    onStepBegin(test: TestCase, _result: TestResult, step: TestStep): void;
    onStepEnd(test: TestCase, _result: TestResult, step: TestStep): void;
    printsToStdio(): boolean;
}
export default OpenTelemetryReporter;
/**
 * Prefix required for any annotation to be converted into a span attribute.
 */
export declare const TEST_ANNOTATION_SCOPE = "pw_otel_reporter.";
/**
 * Utility function to generate an annotation label which this reporter will
 * use to tag spans.
 *
 * @param label {string} the label to use
 * @returns {string} the label with the required prefix added
 */
export declare function annotationLabel(label: string): string;
