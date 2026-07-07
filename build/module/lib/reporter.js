import opentelemetry, { SpanStatusCode } from '@opentelemetry/api';
import { ATTR_CODE_COLUMN, ATTR_CODE_FILEPATH, ATTR_CODE_LINENO, ATTR_TEST_CASE_NAME, ATTR_TEST_CASE_RESULT_STATUS, ATTR_TEST_SUITE_NAME, } from '@opentelemetry/semantic-conventions/incubating';
import { formatTestTitle } from './format-test-title';
import { getHashFromStepTitle } from './get-hash-from-step-title';
import { name as PKG_NAME, version as PKG_VERSION } from './version';
class OpenTelemetryReporter {
    config;
    testSpans = {};
    stepSapns = {};
    tracer;
    constructor() {
        this.tracer = opentelemetry.trace.getTracer(PKG_NAME, PKG_VERSION);
    }
    onBegin(config) {
        this.config = config;
    }
    onTestBegin(test, result) {
        const testSpan = this.tracer.startSpan(formatTestTitle(this.config, test, null, true), {
            startTime: result.startTime,
        });
        this.testSpans[test.id] = testSpan;
    }
    onTestEnd(test, result) {
        const testSpan = this.testSpans[test.id];
        if (testSpan) {
            // Tests which are skipped or whose result status matches the expected
            // status are considered passing.
            const isPassing = result.status === 'skipped' || result.status === test.expectedStatus;
            testSpan.setAttributes({
                [ATTR_TEST_CASE_NAME]: formatTestTitle(this.config, test),
                [ATTR_TEST_CASE_RESULT_STATUS]: isPassing ? 'pass' : 'fail',
                [ATTR_TEST_SUITE_NAME]: test.parent.title,
                [ATTR_CODE_FILEPATH]: test.location.file,
                [ATTR_CODE_LINENO]: test.location.line,
                [ATTR_CODE_COLUMN]: test.location.column,
            });
            test.annotations.forEach((annotation) => {
                if (annotation.type.startsWith(TEST_ANNOTATION_SCOPE)) {
                    const attrLabel = annotation.type.replace(TEST_ANNOTATION_SCOPE, '');
                    testSpan.setAttribute(attrLabel, annotation.description);
                }
            });
            if (!isPassing) {
                testSpan.setStatus({
                    code: SpanStatusCode.ERROR,
                    message: result.error?.message || '',
                });
            }
            testSpan.end(result.startTime.getTime() + result.duration);
        }
    }
    onStepBegin(test, _result, step) {
        const parent = step.parent === undefined
            ? this.testSpans[test.id]
            : this.stepSapns[getHashFromStepTitle(test, step.parent, this.config)];
        const stepHash = getHashFromStepTitle(test, step, this.config);
        const ctx = opentelemetry.trace.setSpan(opentelemetry.context.active(), parent);
        const stepSpan = this.tracer.startSpan(`Step: ${step.title}`, {
            startTime: step.startTime,
        }, ctx);
        this.stepSapns[stepHash] = stepSpan;
    }
    onStepEnd(test, _result, step) {
        const stepSpan = this.stepSapns[getHashFromStepTitle(test, step, this.config)];
        if (stepSpan) {
            stepSpan.setAttributes({
                'test.step.category': step.category,
                'test.step.name': step.title,
            });
            if (step.location) {
                stepSpan.setAttributes({
                    [ATTR_CODE_FILEPATH]: step.location.file,
                    [ATTR_CODE_LINENO]: step.location.line,
                    [ATTR_CODE_COLUMN]: step.location.column,
                });
            }
            if (step.error) {
                stepSpan.setStatus({
                    code: SpanStatusCode.ERROR,
                    message: step.error?.message || '',
                });
            }
            stepSpan.end(step.startTime.getTime() + step.duration);
        }
    }
    printsToStdio() {
        return false;
    }
}
export default OpenTelemetryReporter;
/**
 * Prefix required for any annotation to be converted into a span attribute.
 */
export const TEST_ANNOTATION_SCOPE = 'pw_otel_reporter.';
/**
 * Utility function to generate an annotation label which this reporter will
 * use to tag spans.
 *
 * @param label {string} the label to use
 * @returns {string} the label with the required prefix added
 */
export function annotationLabel(label) {
    return `${TEST_ANNOTATION_SCOPE}${label}`;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVwb3J0ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvbGliL3JlcG9ydGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sYUFBYSxFQUFFLEVBQUUsY0FBYyxFQUFFLE1BQU0sb0JBQW9CLENBQUM7QUFFbkUsT0FBTyxFQUNMLGdCQUFnQixFQUNoQixrQkFBa0IsRUFDbEIsZ0JBQWdCLEVBQ2hCLG1CQUFtQixFQUNuQiw0QkFBNEIsRUFDNUIsb0JBQW9CLEdBQ3JCLE1BQU0sZ0RBQWdELENBQUM7QUFTeEQsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBQ3RELE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxNQUFNLDRCQUE0QixDQUFDO0FBQ2xFLE9BQU8sRUFBRSxJQUFJLElBQUksUUFBUSxFQUFFLE9BQU8sSUFBSSxXQUFXLEVBQUUsTUFBTSxXQUFXLENBQUM7QUFFckUsTUFBTSxxQkFBcUI7SUFDakIsTUFBTSxDQUFhO0lBRW5CLFNBQVMsR0FBOEIsRUFBRSxDQUFDO0lBQzFDLFNBQVMsR0FBOEIsRUFBRSxDQUFDO0lBQzFDLE1BQU0sQ0FBUztJQUV2QjtRQUNFLElBQUksQ0FBQyxNQUFNLEdBQUcsYUFBYSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsUUFBUSxFQUFFLFdBQVcsQ0FBQyxDQUFDO0lBQ3JFLENBQUM7SUFFRCxPQUFPLENBQUMsTUFBa0I7UUFDeEIsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7SUFDdkIsQ0FBQztJQUVELFdBQVcsQ0FBQyxJQUFjLEVBQUUsTUFBa0I7UUFDNUMsTUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsRUFBRTtZQUNyRixTQUFTLEVBQUUsTUFBTSxDQUFDLFNBQVM7U0FDNUIsQ0FBQyxDQUFD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