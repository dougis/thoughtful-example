// Test data for package sorting functionality
// This file contains all test cases organized by function and expected outcome

const isBulkyTestData = {
  // Test cases for packages that should be classified as bulky
  bulkyTestCases: [
    // Volume threshold cases (width × height × length >= 1,000,000)
    {
      width: 100,
      height: 100,
      length: 100,
      description: "exactly at volume threshold (1,000,000 cm³)",
    },
    {
      width: 100,
      height: 100,
      length: 101,
      description: "above volume threshold (1,010,000 cm³)",
    },
    {
      width: 200,
      height: 50,
      length: 100,
      description: "above volume threshold (1,000,000 cm³)",
    },

    // Dimension threshold cases (any dimension >= 150 cm)
    {
      width: 150,
      height: 50,
      length: 50,
      description: "width at dimension threshold",
    },
    {
      width: 50,
      height: 150,
      length: 50,
      description: "height at dimension threshold",
    },
    {
      width: 50,
      height: 50,
      length: 150,
      description: "length at dimension threshold",
    },
    {
      width: 200,
      height: 50,
      length: 50,
      description: "width above dimension threshold",
    },
    {
      width: 50,
      height: 200,
      length: 50,
      description: "height above dimension threshold",
    },
    {
      width: 50,
      height: 50,
      length: 200,
      description: "length above dimension threshold",
    },

    // Combined cases (both volume and dimension thresholds met)
    {
      width: 150,
      height: 150,
      length: 150,
      description: "all dimensions at threshold (3,375,000 cm³)",
    },
  ],

  // Test cases for packages that should NOT be classified as bulky
  nonBulkyTestCases: [
    // Below volume threshold and all dimensions below threshold
    {
      width: 50,
      height: 50,
      length: 50,
      description: "small package (125,000 cm³)",
    },
    {
      width: 100,
      height: 100,
      length: 99,
      description: "just below volume threshold (990,000 cm³)",
    },
    {
      width: 149,
      height: 50,
      length: 50,
      description: "width just below dimension threshold",
    },
    {
      width: 50,
      height: 149,
      length: 50,
      description: "height just below dimension threshold",
    },
    {
      width: 50,
      height: 50,
      length: 149,
      description: "length just below dimension threshold",
    },
    {
      width: 149,
      height: 149,
      length: 1,
      description: "large dimensions but below thresholds",
    },

    // Edge cases with very small values
    { width: 1, height: 1, length: 1, description: "minimal package (1 cm³)" },
    {
      width: 10,
      height: 10,
      length: 10,
      description: "very small package (1,000 cm³)",
    },
  ],

  // Boundary value test cases
  boundaryTestCases: [
    {
      testName:
        "volume exactly at threshold with different dimension combinations",
      cases: [
        { width: 100, height: 100, length: 100 }, // 1,000,000
        { width: 125, height: 80, length: 100 }, // 1,000,000
        { width: 200, height: 50, length: 100 }, // 1,000,000
      ],
    },
    {
      testName: "volume just below threshold with no dimension exceeding limit",
      cases: [
        { width: 99, height: 100, length: 100 }, // 990,000 cm³
        { width: 100, height: 99, length: 100 }, // 990,000 cm³
        { width: 100, height: 100, length: 99 }, // 990,000 cm³
      ],
    },
  ],
};

const isHeavyTestData = {
  // Test cases for packages that should be classified as heavy
  heavyTestCases: [
    {
      mass: 20,
      description: "exactly at mass threshold (20 kg)",
    },
    {
      mass: 20.1,
      description: "just above mass threshold (20.1 kg)",
    },
    {
      mass: 25,
      description: "moderately heavy (25 kg)",
    },
    {
      mass: 50,
      description: "very heavy (50 kg)",
    },
    {
      mass: 100,
      description: "extremely heavy (100 kg)",
    },
  ],

  // Test cases for packages that should NOT be classified as heavy
  nonHeavyTestCases: [
    {
      mass: 19.9,
      description: "just below mass threshold (19.9 kg)",
    },
    {
      mass: 15,
      description: "moderately light (15 kg)",
    },
    {
      mass: 10,
      description: "light package (10 kg)",
    },
    {
      mass: 5,
      description: "very light (5 kg)",
    },
    {
      mass: 1,
      description: "extremely light (1 kg)",
    },
    {
      mass: 0.1,
      description: "minimal mass (0.1 kg)",
    },
  ],
};

const sortTestData = {
  // Test cases for STANDARD packages (neither bulky nor heavy)
  standardTestCases: [
    {
      width: 50,
      height: 50,
      length: 50,
      mass: 10,
      description: "small and light package (125,000 cm³, 10 kg)",
    },
    {
      width: 100,
      height: 100,
      length: 99,
      mass: 15,
      description: "just below volume threshold, light (990,000 cm³, 15 kg)",
    },
    {
      width: 149,
      height: 50,
      length: 50,
      mass: 19.9,
      description: "just below dimension threshold, just below mass threshold",
    },
    {
      width: 80,
      height: 80,
      length: 80,
      mass: 5,
      description: "moderate size, very light (512,000 cm³, 5 kg)",
    },
    {
      width: 1,
      height: 1,
      length: 1,
      mass: 0.1,
      description: "minimal package (1 cm³, 0.1 kg)",
    },
  ],

  // Test cases for SPECIAL packages (bulky but not heavy)
  specialBulkyTestCases: [
    {
      width: 100,
      height: 100,
      length: 100,
      mass: 10,
      description: "exactly at volume threshold, light (1,000,000 cm³, 10 kg)",
    },
    {
      width: 150,
      height: 50,
      length: 50,
      mass: 15,
      description: "width at dimension threshold, light",
    },
    {
      width: 50,
      height: 150,
      length: 50,
      mass: 19.9,
      description: "height at dimension threshold, just below mass threshold",
    },
    {
      width: 50,
      height: 50,
      length: 200,
      mass: 5,
      description: "length above dimension threshold, very light",
    },
    {
      width: 200,
      height: 50,
      length: 100,
      mass: 1,
      description:
        "above volume threshold, extremely light (1,000,000 cm³, 1 kg)",
    },
  ],

  // Test cases for SPECIAL packages (heavy but not bulky)
  specialHeavyTestCases: [
    {
      width: 50,
      height: 50,
      length: 50,
      mass: 20,
      description: "small but exactly at mass threshold (125,000 cm³, 20 kg)",
    },
    {
      width: 100,
      height: 100,
      length: 99,
      mass: 25,
      description: "just below volume threshold, heavy (990,000 cm³, 25 kg)",
    },
    {
      width: 149,
      height: 50,
      length: 50,
      mass: 50,
      description: "just below dimension threshold, very heavy",
    },
    {
      width: 80,
      height: 80,
      length: 80,
      mass: 20.1,
      description:
        "moderate size, just above mass threshold (512,000 cm³, 20.1 kg)",
    },
    {
      width: 10,
      height: 10,
      length: 10,
      mass: 100,
      description: "very small but extremely heavy (1,000 cm³, 100 kg)",
    },
  ],

  // Test cases for REJECTED packages (both bulky and heavy)
  rejectedTestCases: [
    {
      width: 150,
      height: 150,
      length: 150,
      mass: 25,
      description: "all dimensions at threshold, heavy (3,375,000 cm³, 25 kg)",
    },
    {
      width: 100,
      height: 100,
      length: 100,
      mass: 20,
      description: "exactly at volume threshold, exactly at mass threshold",
    },
    {
      width: 200,
      height: 50,
      length: 50,
      mass: 50,
      description: "width above dimension threshold, very heavy",
    },
    {
      width: 50,
      height: 200,
      length: 50,
      mass: 20.1,
      description:
        "height above dimension threshold, just above mass threshold",
    },
    {
      width: 50,
      height: 50,
      length: 150,
      mass: 100,
      description: "length at dimension threshold, extremely heavy",
    },
    {
      width: 200,
      height: 100,
      length: 100,
      mass: 30,
      description: "above volume threshold, heavy (2,000,000 cm³, 30 kg)",
    },
  ],

  // Boundary value test cases for decision matrix
  boundaryTestCases: [
    {
      testName: "exactly at both thresholds should be REJECTED",
      width: 100,
      height: 100,
      length: 100,
      mass: 20,
      expected: "REJECTED",
    },
    {
      testName:
        "just below volume threshold, exactly at mass threshold should be SPECIAL",
      width: 100,
      height: 100,
      length: 99,
      mass: 20,
      expected: "SPECIAL",
    },
    {
      testName:
        "exactly at volume threshold, just below mass threshold should be SPECIAL",
      width: 100,
      height: 100,
      length: 100,
      mass: 19.9,
      expected: "SPECIAL",
    },
    {
      testName: "just below both thresholds should be STANDARD",
      width: 100,
      height: 100,
      length: 99,
      mass: 19.9,
      expected: "STANDARD",
    },
  ],

  // Dimension threshold with various mass values
  dimensionThresholdTestCases: [
    {
      testName: "dimension threshold with mass just below threshold",
      width: 150,
      height: 50,
      length: 50,
      mass: 19.9,
      expected: "SPECIAL",
    },
    {
      testName: "dimension threshold with mass at threshold",
      width: 150,
      height: 50,
      length: 50,
      mass: 20,
      expected: "REJECTED",
    },
  ],

  // Comprehensive boundary value test cases for exact thresholds
  comprehensiveBoundaryTestCases: [
    // Volume threshold boundary tests (exactly 1,000,000 cm³)
    {
      testName: "volume exactly at 1,000,000 cm³ with light mass",
      width: 100,
      height: 100,
      length: 100,
      mass: 19.99,
      expected: "SPECIAL",
      description: "exactly at volume threshold, just below mass threshold",
    },
    {
      testName: "volume exactly at 1,000,000 cm³ with heavy mass",
      width: 100,
      height: 100,
      length: 100,
      mass: 20,
      expected: "REJECTED",
      description: "exactly at volume threshold, exactly at mass threshold",
    },
    {
      testName: "volume just below 1,000,000 cm³ with light mass",
      width: 99.99,
      height: 100,
      length: 100,
      mass: 19.99,
      expected: "STANDARD",
      description: "just below volume threshold, just below mass threshold",
    },
    {
      testName: "volume just below 1,000,000 cm³ with heavy mass",
      width: 99.99,
      height: 100,
      length: 100,
      mass: 20,
      expected: "SPECIAL",
      description: "just below volume threshold, exactly at mass threshold",
    },

    // Dimension threshold boundary tests (exactly 150 cm)
    {
      testName: "width exactly at 150 cm with light mass",
      width: 150,
      height: 50,
      length: 50,
      mass: 19.99,
      expected: "SPECIAL",
      description:
        "width exactly at dimension threshold, just below mass threshold",
    },
    {
      testName: "width exactly at 150 cm with heavy mass",
      width: 150,
      height: 50,
      length: 50,
      mass: 20,
      expected: "REJECTED",
      description:
        "width exactly at dimension threshold, exactly at mass threshold",
    },
    {
      testName: "width just below 150 cm with light mass",
      width: 149.99,
      height: 50,
      length: 50,
      mass: 19.99,
      expected: "STANDARD",
      description:
        "width just below dimension threshold, just below mass threshold",
    },
    {
      testName: "width just below 150 cm with heavy mass",
      width: 149.99,
      height: 50,
      length: 50,
      mass: 20,
      expected: "SPECIAL",
      description:
        "width just below dimension threshold, exactly at mass threshold",
    },

    // Mass threshold boundary tests (exactly 20 kg)
    {
      testName: "mass exactly at 20 kg with small dimensions",
      width: 50,
      height: 50,
      length: 50,
      mass: 20,
      expected: "SPECIAL",
      description: "small dimensions, exactly at mass threshold",
    },
    {
      testName: "mass just below 20 kg with small dimensions",
      width: 50,
      height: 50,
      length: 50,
      mass: 19.99,
      expected: "STANDARD",
      description: "small dimensions, just below mass threshold",
    },
    {
      testName: "mass just above 20 kg with small dimensions",
      width: 50,
      height: 50,
      length: 50,
      mass: 20.01,
      expected: "SPECIAL",
      description: "small dimensions, just above mass threshold",
    },
  ],

  // Extreme edge case test data
  extremeEdgeCaseTestData: [
    // Minimal values
    {
      testName: "minimal package dimensions and mass",
      width: 0.1,
      height: 0.1,
      length: 0.1,
      mass: 0.01,
      expected: "STANDARD",
      description: "extremely small package (0.001 cm³, 0.01 kg)",
    },
    {
      testName: "minimal dimensions with maximum light mass",
      width: 1,
      height: 1,
      length: 1,
      mass: 19.99,
      expected: "STANDARD",
      description: "minimal dimensions, just below mass threshold",
    },

    // Maximum values that still result in STANDARD
    {
      testName: "maximum standard package",
      width: 149.99,
      height: 149.99,
      length: 29.63, // Results in volume just under 1,000,000
      mass: 19.99,
      expected: "STANDARD",
      description: "largest possible standard package",
    },

    // Extreme bulky cases
    {
      testName: "extremely wide package",
      width: 1000,
      height: 1,
      length: 1,
      mass: 1,
      expected: "SPECIAL",
      description: "extremely wide but light package",
    },
    {
      testName: "extremely tall package",
      width: 1,
      height: 1000,
      length: 1,
      mass: 1,
      expected: "SPECIAL",
      description: "extremely tall but light package",
    },
    {
      testName: "extremely long package",
      width: 1,
      height: 1,
      length: 1000,
      mass: 1,
      expected: "SPECIAL",
      description: "extremely long but light package",
    },

    // Extreme heavy cases
    {
      testName: "extremely heavy but tiny package",
      width: 1,
      height: 1,
      length: 1,
      mass: 1000,
      expected: "SPECIAL",
      description: "tiny but extremely heavy package",
    },

    // Extreme rejected cases
    {
      testName: "extremely large and heavy package",
      width: 1000,
      height: 1000,
      length: 1000,
      mass: 1000,
      expected: "REJECTED",
      description: "extremely large and heavy package",
    },
    {
      testName: "cube at dimension threshold with extreme mass",
      width: 150,
      height: 150,
      length: 150,
      mass: 1000,
      expected: "REJECTED",
      description: "cube at dimension threshold with extreme mass",
    },

    // Precision edge cases
    {
      testName: "volume threshold with high precision",
      width: 100.0001,
      height: 100,
      length: 100,
      mass: 19.9999,
      expected: "SPECIAL",
      description: "just above volume threshold with high precision",
    },
    {
      testName: "dimension threshold with high precision",
      width: 150.0001,
      height: 1,
      length: 1,
      mass: 19.9999,
      expected: "SPECIAL",
      description: "just above dimension threshold with high precision",
    },
    {
      testName: "mass threshold with high precision",
      width: 1,
      height: 1,
      length: 1,
      mass: 20.0001,
      expected: "SPECIAL",
      description: "just above mass threshold with high precision",
    },
  ],

  // Design document test cases
  designDocumentTestCases: {
    standard: [
      { width: 50, height: 50, length: 50, mass: 10 }, // 125,000 cm³, 10 kg
      { width: 100, height: 100, length: 99, mass: 15 }, // 990,000 cm³, 15 kg
    ],
    specialBulky: [
      { width: 100, height: 100, length: 100, mass: 10 }, // 1,000,000 cm³, 10 kg
      { width: 150, height: 50, length: 50, mass: 15 }, // dimension threshold, 15 kg
    ],
    specialHeavy: [
      { width: 50, height: 50, length: 50, mass: 20 }, // 125,000 cm³, 20 kg
      { width: 100, height: 100, length: 99, mass: 25 }, // 990,000 cm³, 25 kg
    ],
    rejected: [
      { width: 150, height: 150, length: 150, mass: 25 }, // 3,375,000 cm³, 25 kg
      { width: 100, height: 100, length: 100, mass: 20 }, // 1,000,000 cm³, 20 kg
    ],
  },
};

module.exports = {
  isBulkyTestData,
  isHeavyTestData,
  sortTestData,
};
