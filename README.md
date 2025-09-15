# Package Sorting System

A flexible, rule-based robotic package sorting system that classifies packages into categories based on their dimensions and mass. The system has been refactored to use a configurable rule engine while maintaining full backward compatibility.

## Overview

This system automatically sorts packages for robotic automation by analyzing package dimensions (width, height, length) and mass to determine the appropriate handling stack. The system now uses a flexible rule-based architecture that separates classification logic from rule definitions, making it easy to extend and maintain.

### Key Features

- **Rule-Based Architecture**: Configurable classification rules defined as data structures
- **Backward Compatibility**: Existing API remains unchanged
- **Extensible Design**: Easy to add new classification rules without modifying core logic
- **Dynamic Rule Management**: Add and remove rules at runtime
- **Comprehensive Testing**: 140+ test cases ensuring reliability

### Classification Rules

- **STANDARD**: Neither bulky nor heavy packages
- **SPECIAL**: Packages that are either bulky OR heavy (but not both)
- **REJECTED**: Packages that are both bulky AND heavy

### Thresholds

- **Bulky Package**: Volume ≥ 1,000,000 cm³ OR any dimension ≥ 150 cm
- **Heavy Package**: Mass ≥ 20 kg

## Installation

1. Clone or download the project files
2. Install dependencies:

```bash
npm install
```

## Usage

### Basic Usage (Backward Compatible)

```javascript
const { sort, isBulky, isHeavy } = require("./packageSorting");

// Sort a package
const result = sort(100, 50, 75, 15); // width, height, length, mass
console.log(result); // "STANDARD"

// Check if package is bulky
const bulky = isBulky(200, 50, 50); // true (width exceeds 150 cm)

// Check if package is heavy
const heavy = isHeavy(25); // true (mass exceeds 20 kg)
```

### Advanced Usage with Rule Engine

```javascript
const { RuleEngine, CLASSIFICATION_RULES } = require("./packageSorting");
const { CLASSIFICATION_RULES } = require("./packageSortingConfig");

// Create a rule engine with default rules
const engine = new RuleEngine(CLASSIFICATION_RULES);

// Evaluate a package
const packageData = {
  width: 100,
  height: 50,
  length: 30,
  mass: 25,
  bulky: false,
  heavy: true,
};
const result = engine.evaluate(packageData); // "SPECIAL"
```

### Custom Classification Rules

```javascript
const { RuleEngine } = require("./packageSorting");

// Define custom rules
const customRules = [
  {
    name: "fragile-packages",
    condition: (pkg) => pkg.fragile === true,
    result: "FRAGILE_HANDLING",
    priority: 1, // Highest priority
  },
  {
    name: "express-packages",
    condition: (pkg) => pkg.express === true,
    result: "EXPRESS",
    priority: 2,
  },
  {
    name: "standard-packages",
    condition: (pkg) => true, // Default case
    result: "STANDARD",
    priority: 3,
  },
];

const customEngine = new RuleEngine(customRules);

// Test with extended package data
const expressPackage = {
  width: 50,
  height: 30,
  length: 20,
  mass: 10,
  bulky: false,
  heavy: false,
  express: true,
};
console.log(customEngine.evaluate(expressPackage)); // "EXPRESS"
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
  priority: 0.5, // Higher priority than existing rules
});

// Remove a rule to make system more restrictive
engine.removeRule("standard-packages");

// Test the modified engine
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
```

### Example Classifications

```javascript
// STANDARD: Small and light
sort(50, 50, 50, 10); // "STANDARD"

// SPECIAL: Bulky but not heavy
sort(100, 100, 100, 10); // "SPECIAL" (volume = 1,000,000 cm³)
sort(150, 50, 50, 15); // "SPECIAL" (width = 150 cm)

// SPECIAL: Heavy but not bulky
sort(50, 50, 50, 20); // "SPECIAL" (mass = 20 kg)

// REJECTED: Both bulky and heavy
sort(150, 150, 150, 25); // "REJECTED"
```

## Running Tests

Execute the comprehensive test suite:

```bash
npm test
```

## Test Coverage

The test suite includes 140+ comprehensive test cases covering:

### 1. Bulky Classification Tests (`isBulky` function)

- **Volume Threshold Tests**: Packages at and above 1,000,000 cm³
- **Dimension Threshold Tests**: Packages with any dimension ≥ 150 cm
- **Boundary Value Tests**: Edge cases around thresholds
- **Non-Bulky Tests**: Packages below both thresholds

### 2. Heavy Classification Tests (`isHeavy` function)

- **Mass Threshold Tests**: Packages at and above 20 kg
- **Boundary Value Tests**: Precise threshold testing
- **Non-Heavy Tests**: Packages below mass threshold

### 3. Package Sorting Tests (`sort` function)

#### STANDARD Classification

- Small and light packages
- Packages just below volume/dimension thresholds
- Minimal packages with very small dimensions and mass

#### SPECIAL Classification

- **Bulky Only**: Large volume or dimensions but light weight
- **Heavy Only**: High mass but small dimensions
- Boundary cases where only one threshold is met

#### REJECTED Classification

- Packages exceeding both bulky and heavy thresholds
- Various combinations of large dimensions and high mass

### 4. Boundary Value Testing

- **Decision Matrix Tests**: All threshold combinations
- **Precision Tests**: High-precision decimal values
- **Comprehensive Boundary Tests**: Exact threshold values

### 5. Extreme Edge Case Testing

- **Minimal Values**: Extremely small packages (0.1 cm dimensions)
- **Maximum Standard**: Largest possible standard packages
- **Extreme Dimensions**: Very wide, tall, or long packages
- **Extreme Mass**: Very heavy but tiny packages
- **Precision Edge Cases**: High-precision threshold testing

### 6. Integration Tests with Design Document Data

- **Parameterized Tests**: Each design document example tested individually
- **Classification Path Verification**: Validates all four decision paths
- **End-to-End Testing**: Complete workflow validation

### 7. Rule Engine Testing

- **Rule Validation**: Tests for rule structure and property validation
- **Priority Ordering**: Ensures rules are evaluated in correct priority order
- **Dynamic Rule Management**: Tests for adding and removing rules at runtime
- **Error Handling**: Comprehensive error condition testing
- **Custom Rule Integration**: Tests with various custom rule configurations

## File Structure

```
├── packageSorting.js         # Main sorting logic, RuleEngine class, and helper functions
├── packageSortingConfig.js   # Configuration constants and default classification rules
├── packageSorting.test.js    # Comprehensive test suite (140+ tests)
├── testData.js              # Organized test data arrays
├── package.json             # Project configuration and dependencies
└── README.md               # This documentation
```

## API Reference

### Core Functions (Backward Compatible)

#### `sort(width, height, length, mass)`

Main sorting function that classifies packages using the rule-based system.

**Parameters:**

- `width` (number): Package width in centimeters
- `height` (number): Package height in centimeters
- `length` (number): Package length in centimeters
- `mass` (number): Package mass in kilograms

**Returns:** String - "STANDARD", "SPECIAL", or "REJECTED"

#### `isBulky(width, height, length)`

Determines if a package is bulky based on volume and dimension thresholds.

**Parameters:**

- `width`, `height`, `length` (number): Dimensions in centimeters

**Returns:** Boolean - true if bulky, false otherwise

#### `isHeavy(mass)`

Determines if a package is heavy based on mass threshold.

**Parameters:**

- `mass` (number): Package mass in kilograms

**Returns:** Boolean - true if heavy, false otherwise

### Rule Engine API

#### `new RuleEngine(rules)`

Creates a new rule engine instance with the provided classification rules.

**Parameters:**

- `rules` (Array): Array of rule objects with `name`, `condition`, `result`, and `priority` properties

**Returns:** RuleEngine instance

**Example:**

```javascript
const engine = new RuleEngine([
  {
    name: "heavy-packages",
    condition: (pkg) => pkg.mass > 50,
    result: "HEAVY",
    priority: 1,
  },
]);
```

#### `engine.evaluate(packageData)`

Evaluates package data against all rules and returns the first match.

**Parameters:**

- `packageData` (Object): Package data with dimensions, mass, and computed flags

**Returns:** String - Classification result from the first matching rule

#### `engine.addRule(rule)`

Adds a new rule to the engine dynamically.

**Parameters:**

- `rule` (Object): Rule object with required properties

**Throws:** Error if rule is invalid or name conflicts

#### `engine.removeRule(ruleName)`

Removes a rule from the engine by name.

**Parameters:**

- `ruleName` (String): Name of the rule to remove

**Throws:** Error if rule name is not found

### Rule Object Structure

```javascript
{
  name: "rule-name",           // Unique identifier
  condition: (pkg) => boolean, // Function that evaluates package data
  result: "CLASSIFICATION",    // Result to return if condition matches
  priority: 1                  // Priority (lower = higher priority)
}
```

### Package Data Structure

```javascript
{
  width: 100,     // Package width in cm
  height: 50,     // Package height in cm
  length: 30,     // Package length in cm
  mass: 15,       // Package mass in kg
  bulky: false,   // Computed bulky flag
  heavy: false    // Computed heavy flag
  // ... additional custom properties
}
```

## Configuration Constants

Available from `packageSortingConfig.js`:

### Thresholds

- `VOLUME_THRESHOLD`: 1,000,000 cm³
- `DIMENSION_THRESHOLD`: 150 cm
- `MASS_THRESHOLD`: 20 kg

### Classification Results

- `STANDARD`: "STANDARD"
- `SPECIAL`: "SPECIAL"
- `REJECTED`: "REJECTED"

### Rule Priorities

- `PRIORITY_HIGH`: 1 (for rejected packages)
- `PRIORITY_MEDIUM`: 2 (for special packages)
- `PRIORITY_LOW`: 3 (for standard packages)

### Default Rules

- `CLASSIFICATION_RULES`: Array of default classification rules

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
```

## Extending the System

### Adding New Classification Types

The rule-based architecture makes it easy to add new classification types:

```javascript
const { RuleEngine } = require("./packageSorting");

// Define rules for a multi-tier classification system
const tieredRules = [
  {
    name: "premium-express",
    condition: (pkg) => pkg.express && pkg.premium,
    result: "PREMIUM_EXPRESS",
    priority: 1,
  },
  {
    name: "hazardous-materials",
    condition: (pkg) => pkg.hazardous === true,
    result: "HAZMAT",
    priority: 2,
  },
  {
    name: "international-shipping",
    condition: (pkg) => pkg.international === true,
    result: "INTERNATIONAL",
    priority: 3,
  },
  {
    name: "bulk-discount",
    condition: (pkg) => pkg.quantity > 100,
    result: "BULK",
    priority: 4,
  },
  {
    name: "standard-processing",
    condition: (pkg) => true,
    result: "STANDARD",
    priority: 5,
  },
];

const tieredEngine = new RuleEngine(tieredRules);
```

### Complex Multi-Criteria Rules

Rules can implement complex logic with multiple conditions:

```javascript
const complexRules = [
  {
    name: "high-value-fragile",
    condition: (pkg) => pkg.value > 1000 && pkg.fragile && !pkg.bulky,
    result: "SECURE_HANDLING",
    priority: 1,
  },
  {
    name: "temperature-sensitive-bulk",
    condition: (pkg) => pkg.temperatureSensitive && (pkg.bulky || pkg.heavy),
    result: "CLIMATE_CONTROLLED_SPECIAL",
    priority: 2,
  },
];
```

### Integration with External Systems

Load rules from configuration files or databases:

```javascript
// Load from JSON configuration
function loadRulesFromConfig(configPath) {
  const config = JSON.parse(fs.readFileSync(configPath, "utf8"));
  return config.rules.map((rule) => ({
    ...rule,
    condition: new Function("pkg", `return ${rule.condition}`),
  }));
}

// Load from database (pseudo-code)
async function loadRulesFromDatabase() {
  const rules = await db.query(
    "SELECT * FROM classification_rules ORDER BY priority"
  );
  return rules.map((rule) => ({
    name: rule.name,
    condition: new Function("pkg", rule.condition_code),
    result: rule.result,
    priority: rule.priority,
  }));
}
```

## Migration Guide

### From Version 1.x to 2.x

The refactored system maintains full backward compatibility. No changes are required for existing code:

```javascript
// This code continues to work unchanged
const { sort, isBulky, isHeavy } = require("./packageSorting");
const result = sort(100, 50, 30, 15); // Still returns "STANDARD"
```

### Adopting the Rule Engine

To take advantage of the new rule-based system:

1. **Start with default rules:**

```javascript
const { RuleEngine, CLASSIFICATION_RULES } = require("./packageSorting");
const engine = new RuleEngine(CLASSIFICATION_RULES);
```

2. **Gradually add custom rules:**

```javascript
engine.addRule({
  name: "priority-handling",
  condition: (pkg) => pkg.priority === "high",
  result: "PRIORITY",
  priority: 0, // Higher than existing rules
});
```

3. **Replace direct function calls:**

```javascript
// Old approach
const result = sort(width, height, length, mass);

// New approach with more flexibility
const packageData = {
  width,
  height,
  length,
  mass,
  bulky: isBulky(width, height, length),
  heavy: isHeavy(mass),
  // Add custom properties
  priority: "high",
  fragile: true,
};
const result = engine.evaluate(packageData);
```

## Development

The system follows test-driven development practices with comprehensive test coverage including:

- Unit tests for individual functions and rule engine components
- Integration tests for complete workflows
- Rule engine testing with various configurations
- Boundary value analysis and edge case testing
- Parameterized testing for systematic coverage
- Backward compatibility verification

All 140+ tests pass and provide confidence in the robustness of both the original classification logic and the new rule-based architecture.
