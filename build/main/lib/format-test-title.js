"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatTestTitle = formatTestTitle;
exports.relativeFilePath = relativeFilePath;
exports.stepSuffix = stepSuffix;
const path_1 = __importDefault(require("path"));
function formatTestTitle(config, test, step, omitLocation = false) {
    // root, project, file, ...describes, test
    const [, projectName, , ...titles] = test.titlePath();
    let location;
    if (omitLocation)
        location = `${relativeTestPath(config, test)}`;
    else
        location = `${relativeTestPath(config, test)}:${test.location.line}:${test.location.column}`;
    const projectTitle = projectName ? `[${projectName}] › ` : '';
    const testTitle = `${projectTitle}${location} › ${titles.join(' › ')}`;
    const extraTags = test.tags.filter((t) => !testTitle.includes(t));
    return `${testTitle}${stepSuffix(step)}${extraTags.length ? ' ' + extraTags.join(' ') : ''}`;
}
function relativeFilePath(config, file) {
    return path_1.default.relative(config.rootDir, file) || path_1.default.basename(file);
}
function relativeTestPath(config, test) {
    return relativeFilePath(config, test.location.file);
}
function stepSuffix(step) {
    const stepTitles = step ? step.titlePath() : [];
    return stepTitles
        .map((t) => t.split('\n')[0])
        .map((t) => ' › ' + t)
        .join('');
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9ybWF0LXRlc3QtdGl0bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvbGliL2Zvcm1hdC10ZXN0LXRpdGxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBS0EsMENBb0JDO0FBRUQsNENBRUM7QUFNRCxnQ0FNQztBQXpDRCxnREFBd0I7QUFLeEIsU0FBZ0IsZUFBZSxDQUM3QixNQUFrQixFQUNsQixJQUFjLEVBQ2QsSUFBZSxFQUNmLFlBQVksR0FBRyxLQUFLO0lBRXBCLDBDQUEwQztJQUMxQyxNQUFNLENBQUMsRUFBRSxXQUFXLEVBQUUsQUFBRCxFQUFHLEdBQUcsTUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDO0lBQ3RELElBQUksUUFBUSxDQUFDO0lBQ2IsSUFBSSxZQUFZO1FBQUUsUUFBUSxHQUFHLEdBQUcsZ0JBQWdCLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxFQUFFLENBQUM7O1FBRS9ELFFBQVEsR0FBRyxHQUFHLGdCQUFnQixDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksSUFDaEUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUNoQixFQUFFLENBQUM7SUFDTCxNQUFNLFlBQVksR0FBRyxXQUFXLENBQUMsQ0FBQyxDQUFDLElBQUksV0FBVyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztJQUM5RCxNQUFNLFNBQVMsR0FBRyxHQUFHLFlBQVksR0FBRyxRQUFRLE1BQU0sTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDO0lBQ3ZFLE1BQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNsRSxPQUFPLEdBQUcsU0FBUyxHQUFHLFVBQVUsQ0FBQyxJQUFJLENBQUMsR0FDcEMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLFNBQVMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQ2pELEVBQUUsQ0FBQztBQUNMLENBQUM7QUFFRCxTQUFnQixnQkFBZ0IsQ0FBQyxNQUFrQixFQUFFLElBQVk7SUFDL0QsT0FBTyxjQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLElBQUksY0FBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUNwRSxDQUFDO0FBRUQsU0FBUyxnQkFBZ0IsQ0FBQyxNQUFrQixFQUFFLElBQWM7SUFDMUQsT0FBTyxnQkFBZ0IsQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUN0RCxDQUFDO0FBRUQsU0FBZ0IsVUFBVSxDQUFDLElBQTBCO0lBQ25ELE1BQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7SUFDaEQsT0FBTyxVQUFVO1NBQ2QsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQzVCLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQztTQUNyQixJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDZCxDQUFDIn0=