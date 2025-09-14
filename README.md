# Package Sorting System

A robotic package sorting system that classifies packages into three categories (STANDARD, SPECIAL, REJECTED) based on their dimensions and mass.

## Overview

This system automatically sorts packages for robotic automation by analyzing package dimensions (width, height, length) and mass to determine the appropriate handling stack.

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

### Basic Usage

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

The test suite includes 93 comprehensive test cases covering:

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

## File Structure

```
├── packageSorting.js      # Main sorting logic and helper functions
├── packageSorting.test.js # Comprehensive test suite (93 tests)
├── testData.js           # Organized test data arrays
├── package.json          # Project configuration and dependencies
└── README.md            # This documentation
```

## API Reference

### `sort(width, height, length, mass)`

Main sorting function that classifies packages.

**Parameters:**

- `width` (number): Package width in centimeters
- `height` (number): Package height in centimeters
- `length` (number): Package length in centimeters
- `mass` (number): Package mass in kilograms

**Returns:** String - "STANDARD", "SPECIAL", or "REJECTED"

### `isBulky(width, height, length)`

Determines if a package is bulky based on volume and dimension thresholds.

**Parameters:**

- `width`, `height`, `length` (number): Dimensions in centimeters

**Returns:** Boolean - true if bulky, false otherwise

### `isHeavy(mass)`

Determines if a package is heavy based on mass threshold.

**Parameters:**

- `mass` (number): Package mass in kilograms

**Returns:** Boolean - true if heavy, false otherwise

## Constants

- `VOLUME_THRESHOLD`: 1,000,000 cm³
- `DIMENSION_THRESHOLD`: 150 cm
- `MASS_THRESHOLD`: 20 kg
- `STANDARD`: "STANDARD"
- `SPECIAL`: "SPECIAL"
- `REJECTED`: "REJECTED"

## Development

The system follows test-driven development practices with comprehensive test coverage including:

- Unit tests for individual functions
- Integration tests for complete workflows
- Boundary value analysis
- Edge case testing
- Parameterized testing for systematic coverage

All tests pass and provide confidence in the robustness of the classification logic.
