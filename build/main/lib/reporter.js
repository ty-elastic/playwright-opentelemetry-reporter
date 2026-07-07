"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.TEST_ANNOTATION_SCOPE = void 0;
exports.annotationLabel = annotationLabel;
const api_1 = __importStar(require("@opentelemetry/api"));
const incubating_1 = require("@opentelemetry/semantic-conventions/incubating");
const format_test_title_1 = require("./format-test-title");
const get_hash_from_step_title_1 = require("./get-hash-from-step-title");
const version_1 = require("./version");
class OpenTelemetryReporter {
    constructor() {
        this.testSpans = {};
        this.stepSapns = {};
        this.tracer = api_1.default.trace.getTracer(version_1.name, version_1.version);
    }
    onBegin(config) {
        this.config = config;
    }
    onTestBegin(test, result) {
        const testSpan = this.tracer.startSpan((0, format_test_title_1.formatTestTitle)(this.config, test, null, true), {
            startTime: result.startTime,
        });
        this.testSpans[test.id] = testSpan;
    }
    onTestEnd(test, result) {
        var _a;
        const testSpan = this.testSpans[test.id];
        if (testSpan) {
            // Tests which are skipped or whose result status matches the expected
            // status are considered passing.
            const isPassing = result.status === 'skipped' || result.status === test.expectedStatus;
            testSpan.setAttributes({
                [incubating_1.ATTR_TEST_CASE_NAME]: (0, format_test_title_1.formatTestTitle)(this.config, test),
                [incubating_1.ATTR_TEST_CASE_RESULT_STATUS]: isPassing ? 'pass' : 'fail',
                [incubating_1.ATTR_TEST_SUITE_NAME]: test.parent.title,
                [incubating_1.ATTR_CODE_FILEPATH]: test.location.file,
                [incubating_1.ATTR_CODE_LINENO]: test.location.line,
                [incubating_1.ATTR_CODE_COLUMN]: test.location.column,
            });
            test.annotations.forEach((annotation) => {
                if (annotation.type.startsWith(exports.TEST_ANNOTATION_SCOPE)) {
                    const attrLabel = annotation.type.replace(exports.TEST_ANNOTATION_SCOPE, '');
                    testSpan.setAttribute(attrLabel, annotation.description);
                }
            });
            if (!isPassing) {
                testSpan.setStatus({
                    code: api_1.SpanStatusCode.ERROR,
                    message: ((_a = result.error) === null || _a === void 0 ? void 0 : _a.message) || '',
                });
            }
            testSpan.end(result.startTime.getTime() + result.duration);
        }
    }
    onStepBegin(test, _result, step) {
        const parent = step.parent === undefined
            ? this.testSpans[test.id]
            : this.stepSapns[(0, get_hash_from_step_title_1.getHashFromStepTitle)(test, step.parent, this.config)];
        const stepHash = (0, get_hash_from_step_title_1.getHashFromStepTitle)(test, step, this.config);
        const ctx = api_1.default.trace.setSpan(api_1.default.context.active(), parent);
        const stepSpan = this.tracer.startSpan(`Step: ${step.title}`, {
            startTime: step.startTime,
        }, ctx);
        this.stepSapns[stepHash] = stepSpan;
    }
    onStepEnd(test, _result, step) {
        var _a;
        const stepSpan = this.stepSapns[(0, get_hash_from_step_title_1.getHashFromStepTitle)(test, step, this.config)];
        if (stepSpan) {
            stepSpan.setAttributes({
                'test.step.category': step.category,
                'test.step.name': step.title,
            });
            if (step.location) {
                stepSpan.setAttributes({
                    [incubating_1.ATTR_CODE_FILEPATH]: step.location.file,
                    [incubating_1.ATTR_CODE_LINENO]: step.location.line,
                    [incubating_1.ATTR_CODE_COLUMN]: step.location.column,
                });
            }
            if (step.error) {
                stepSpan.setStatus({
                    code: api_1.SpanStatusCode.ERROR,
                    message: ((_a = step.error) === null || _a === void 0 ? void 0 : _a.message) || '',
                });
            }
            stepSpan.end(step.startTime.getTime() + step.duration);
        }
    }
    printsToStdio() {
        return false;
    }
}
exports.default = OpenTelemetryReporter;
/**
 * Prefix required for any annotation to be converted into a span attribute.
 */
exports.TEST_ANNOTATION_SCOPE = 'pw_otel_reporter.';
/**
 * Utility function to generate an annotation label which this reporter will
 * use to tag spans.
 *
 * @param label {string} the label to use
 * @returns {string} the label with the required prefix added
 */
function annotationLabel(label) {
    return `${exports.TEST_ANNOTATION_SCOPE}${label}`;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVwb3J0ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvbGliL3JlcG9ydGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQWtKQSwwQ0FFQztBQXBKRCwwREFBbUU7QUFFbkUsK0VBT3dEO0FBU3hELDJEQUFzRDtBQUN0RCx5RUFBa0U7QUFDbEUsdUNBQXFFO0FBRXJFLE1BQU0scUJBQXFCO0lBT3pCO1FBSlEsY0FBUyxHQUE4QixFQUFFLENBQUM7UUFDMUMsY0FBUyxHQUE4QixFQUFFLENBQUM7UUFJaEQsSUFBSSxDQUFDLE1BQU0sR0FBRyxhQUFhLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxjQUFRLEVBQUUsaUJBQVcsQ0FBQyxDQUFDO0lBQ3JFLENBQUM7SUFFRCxPQUFPLENBQUMsTUFBa0I7UUFDeEIsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7SUFDdkIsQ0FBQztJQUVELFdBQVcsQ0FBQyxJQUFjLEVBQUUsTUFBa0I7UUFDNUMsTUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsSUFBQSxtQ0FBZSxFQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsRUFBRTtZQUNyRixTQUFTLEVBQUUsTUFBTSxDQUFDLFNBQVM7U0FDNUIsQ0FBQyxDQUFDO1FBQ0gsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLEdBQUcsUUFBUSxDQUFDO0lBQ3JDLENBQUM7SUFFRCxTQUFTLENBQUMsSUFBYyxFQUFFLE1BQWtCOztRQUMxQyxNQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUN6QyxJQUFJLFFBQVEsRUFBRSxDQUFDO1lBQ2Isc0VBQXNFO1lBQ3RFLGlDQUFpQztZQUNqQyxNQUFNLFNB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