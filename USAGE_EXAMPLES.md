# Package Sorting System - Usage Examples

This document provides comprehensive examples of how to use the refactored package sorting system with its new rule-based architecture.

## Basic Usage (Backward Compatible)

The main `sort` function maintains the same API as before:

```javascript
const { sort } = require("./packageSorting");

// Standard package
console.log(sort(50, 30, 20, 10)); // "STANDARD"

// Special package (bulky)
console.log(sort(200, 50, 30, 15)); // "SPECIAL"

// Special package (heavy)
console.log(sort(50, 30, 20, 25)); // "SPECIAL"

// Rejected package (both bulky and heavy)
console.log(sort(200, 100, 50, 25)); // "REJECTED"
```

## Advanced Usage with Custom Rules

### Creating a Custom Classification System

```javascript
const { RuleEngine } = require("./packageSorting");

// Define custom rules for a specialized warehouse
const warehouseRules = [
  {
    name: "priority-express",
    condition: (pkg) => pkg.express === true,
    result: "EXPRESS_LANE",
    priority: 1,
  },
  {
    name: "fragile-handling",
    condition: (pkg) => pkg.fragile === true,
    result: "FRAGILE_CARE",
    priority: 2,
  },
  {
    name: "bulk-processing",
    condition: (pkg) => pkg.quantity > 50,
    result: "BULK_HANDLING",
    priority: 3,
  },
  {
    name: "standard-processing",
    condition: (pkg) => true, // default case
    result: "STANDARD",
    priority: 4,
  },
];

const customEngine = new RuleEngine(warehouseRules);

// Test with extended package data
const packageData = {
  width: 100,
  height: 50,
  length: 30,
  mass: 15,
  bulky: false,
  heavy: false,
  express: true,
  fragile: false,
  quantity: 1,
};

console.log(customEngine.evaluate(packageData)); // "EXPRESS_LANE"
```

### Dynamic Rule Management

```javascript
const { RuleEngine, CLASSIFICATION_RULES } = require("./packageSorting");

// Start with default rules
const engine = new RuleEngine([...CLASSIFICATION_RULES]);

// Add a new rule for temperature-sensitive packages
engine.addRule({
  name: "temperature-controlled",
  condition: (pkg) => pkg.temperatureSensitive === true,
  result: "CLIMATE_CONTROLLED",
  priority: 0, // Highest priority
});

// Test the new rule
const tempSensitivePackage = {
  width: 50,
  height: 30,
  length: 20,
  mass: 10,
  bulky: false,
  heavy: false,
  temperatureSensitive: true,
};

console.log(engine.evaluate(tempSensitivePackage)); // "CLIMATE_CONTROLLED"

// Remove a rule if needed
engine.removeRule("standard-packages");
```

### Complex Multi-Criteria Rules

```javascript
const { RuleEngine } = require("./packageSorting");

const complexRules = [
  {
    name: "hazmat-oversized",
    condition: (pkg) => pkg.hazardous && (pkg.bulky || pkg.heavy),
    result: "HAZMAT_SPECIAL",
    priority: 1,
  },
  {
    name: "high-value-secure",
    condition: (pkg) => pkg.value > 1000 && !pkg.bulky,
    result: "SECURE_HANDLING",
    priority: 2,
  },
  {
    name: "international-customs",
    condition: (pkg) => pkg.international && pkg.requiresCustoms,
    result: "CUSTOMS_PROCESSING",
    priority: 3,
  },
  {
    name: "default",
    condition: (pkg) => true,
    result: "STANDARD",
    priority: 4,
  },
];

const complexEngine = new RuleEngine(complexRules);

// Test complex package
const complexPackage = {
  width: 200,
  height: 100,
  length: 50,
  mass: 30,
  bulky: true,
  heavy: true,
  hazardous: true,
  value: 500,
  international: false,
  requiresCustoms: false,
};

console.log(complexEngine.evaluate(complexPackage)); // "HAZMAT_SPECIAL"
```

## Helper Functions

The original helper functions are still available for custom rule development:

```javascript
const { isBulky, isHeavy } = require("./packageSorting");

// Check if package is bulky
console.log(isBulky(200, 50, 30)); // true (width >= 150cm)
console.log(isBulky(100, 100, 100)); // true (volume = 1,000,000 cm³)

// Check if package is heavy
console.log(isHeavy(25)); // true (>= 20kg)
console.log(isHeavy(15)); // false
```

## Configuration Access

Access configuration constants for custom rules:

```javascript
const {
  VOLUME_THRESHOLD,
  DIMENSION_THRESHOLD,
  MASS_THRESHOLD,
  STANDARD,
  SPECIAL,
  REJECTED,
  CLASSIFICATION_RULES,
} = require("./packageSortingConfig");

console.log("Volume threshold:", VOLUME_THRESHOLD); // 1000000
console.log("Dimension threshold:", DIMENSION_THRESHOLD); // 150
console.log("Mass threshold:", MASS_THRESHOLD); // 20

// Use default rules as a starting point
const engine = new RuleEngine([...CLASSIFICATION_RULES]);
```

## Error Handling

The system provides comprehensive error handling:

```javascript
const { RuleEngine } = require("./packageSorting");

try {
  // Invalid rule - missing required properties
  const invalidRules = [{ name: "incomplete" }];
  const engine = new RuleEngine(invalidRules);
} catch (error) {
  console.log("Error:", error.message); // "Rule is missing required property: condition"
}

try {
  // Duplicate rule names
  const engine = new RuleEngine([
    { name: "test", condition: () => true, result: "A", priority: 1 },
    { name: "test", condition: () => false, result: "B", priority: 2 },
  ]);
} catch (error) {
  console.log("Error:", error.message); // "Rule with name "test" already exists"
}
```

## Migration from Original System

If you're migrating from the original if-else based system, the new system is a drop-in replacement:

```javascript
// Old way (still works)
const { sort } = require("./packageSorting");
const result = sort(width, height, length, mass);

// New way (for custom rules)
const { RuleEngine, CLASSIFICATION_RULES } = require("./packageSorting");
const engine = new RuleEngine(CLASSIFICATION_RULES);
const packageData = {
  width,
  height,
  length,
  mass,
  bulky: isBulky(width, height, length),
  heavy: isHeavy(mass),
};
const result = engine.evaluate(packageData);
```

Both approaches produce identical results for the standard classification logic.
