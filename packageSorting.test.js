const { isBulky, isHeavy, sort, RuleEngine } = require("./packageSorting");

const {
  VOLUME_THRESHOLD,
  DIMENSION_THRESHOLD,
  MASS_THRESHOLD,
  STANDARD,
  SPECIAL,
  REJECTED,
  PRIORITY_HIGH,
  PRIORITY_MEDIUM,
  PRIORITY_LOW,
  CLASSIFICATION_RULES,
} = require("./packageSortingConfig");

const {
  isBulkyTestData,
  isHeavyTestData,
  sortTestData,
} = require("./testData");

describe("isBulky function", () => {
  // Parameterized tests for bulky packages
  describe("should classify as bulky", () => {
    isBulkyTestData.bulkyTestCases.forEach(
      ({ width, height, length, description }) => {
        test(`${description}`, () => {
          expect(isBulky(width, height, length)).toBe(true);
        });
      }
    );
  });

  // Parameterized tests for non-bulky packages
  describe("should NOT classify as bulky", () => {
    isBulkyTestData.nonBulkyTestCases.forEach(
      ({ width, height, length, description }) => {
        test(`${description}`, () => {
          expect(isBulky(width, height, length)).toBe(false);
        });
      }
    );
  });

  // Additional boundary value tests
  describe("boundary value testing", () => {
    isBulkyTestData.boundaryTestCases.forEach(({ testName, cases }) => {
      test(testName, () => {
        cases.forEach(({ width, height, length }) => {
          const expectedResult = testName.includes("just below") ? false : true;
          expect(isBulky(width, height, length)).toBe(expectedResult);
        });
      });
    });
  });
});

describe("isHeavy function", () => {
  // Parameterized tests for heavy packages
  describe("should classify as heavy", () => {
    isHeavyTestData.heavyTestCases.forEach(({ mass, description }) => {
      test(`${description}`, () => {
        expect(isHeavy(mass)).toBe(true);
      });
    });
  });

  // Parameterized tests for non-heavy packages
  describe("should NOT classify as heavy", () => {
    isHeavyTestData.nonHeavyTestCases.forEach(({ mass, description }) => {
      test(`${description}`, () => {
        expect(isHeavy(mass)).toBe(false);
      });
    });
  });

  // Additional boundary value tests
  describe("boundary value testing", () => {
    test("mass exactly at threshold", () => {
      expect(isHeavy(MASS_THRESHOLD)).toBe(true);
    });

    test("mass just below threshold", () => {
      expect(isHeavy(MASS_THRESHOLD - 0.01)).toBe(false);
    });

    test("mass just above threshold", () => {
      expect(isHeavy(MASS_THRESHOLD + 0.01)).toBe(true);
    });
  });
});

describe("sort function", () => {
  // Parameterized tests for STANDARD classification
  describe("should return STANDARD", () => {
    sortTestData.standardTestCases.forEach(
      ({ width, height, length, mass, description }) => {
        test(`${description}`, () => {
          expect(sort(width, height, length, mass)).toBe(STANDARD);
        });
      }
    );
  });

  // Parameterized tests for SPECIAL classification (bulky only)
  describe("should return SPECIAL for bulky packages", () => {
    sortTestData.specialBulkyTestCases.forEach(
      ({ width, height, length, mass, description }) => {
        test(`${description}`, () => {
          expect(sort(width, height, length, mass)).toBe(SPECIAL);
        });
      }
    );
  });

  // Parameterized tests for SPECIAL classification (heavy only)
  describe("should return SPECIAL for heavy packages", () => {
    sortTestData.specialHeavyTestCases.forEach(
      ({ width, height, length, mass, description }) => {
        test(`${description}`, () => {
          expect(sort(width, height, length, mass)).toBe(SPECIAL);
        });
      }
    );
  });

  // Parameterized tests for REJECTED classification
  describe("should return REJECTED", () => {
    sortTestData.rejectedTestCases.forEach(
      ({ width, height, length, mass, description }) => {
        test(`${description}`, () => {
          expect(sort(width, height, length, mass)).toBe(REJECTED);
        });
      }
    );
  });

  // Additional boundary value tests for decision matrix
  describe("decision matrix boundary testing", () => {
    sortTestData.boundaryTestCases.forEach(
      ({ testName, width, height, length, mass, expected }) => {
        test(testName, () => {
          expect(sort(width, height, length, mass)).toBe(expected);
        });
      }
    );

    sortTestData.dimensionThresholdTestCases.forEach(
      ({ testName, width, height, length, mass, expected }) => {
        test(testName, () => {
          expect(sort(width, height, length, mass)).toBe(expected);
        });
      }
    );
  });

  // Comprehensive boundary value test suite
  describe("comprehensive boundary value testing", () => {
    sortTestData.comprehensiveBoundaryTestCases.forEach(
      ({ testName, width, height, length, mass, expected, description }) => {
        test(`${testName} - ${description}`, () => {
          expect(sort(width, height, length, mass)).toBe(expected);
        });
      }
    );
  });

  // Extreme edge case testing
  describe("extreme edge case testing", () => {
    sortTestData.extremeEdgeCaseTestData.forEach(
      ({ testName, width, height, length, mass, expected, description }) => {
        test(`${testName} - ${description}`, () => {
          expect(sort(width, height, length, mass)).toBe(expected);
        });
      }
    );
  });

  // Integration tests with design document test data - parameterized approach
  describe("integration tests with design document test data", () => {
    // Parameterized tests for STANDARD packages from design document
    describe("should return STANDARD for design document examples", () => {
      sortTestData.designDocumentTestCases.standard.forEach(
        ({ width, height, length, mass }, index) => {
          test(`design document standard case ${
            index + 1
          }: ${width}×${height}×${length} cm, ${mass} kg`, () => {
            expect(sort(width, height, length, mass)).toBe(STANDARD);
          });
        }
      );
    });

    // Parameterized tests for SPECIAL (bulky only) packages from design document
    describe("should return SPECIAL for design document bulky examples", () => {
      sortTestData.designDocumentTestCases.specialBulky.forEach(
        ({ width, height, length, mass }, index) => {
          test(`design document special bulky case ${
            index + 1
          }: ${width}×${height}×${length} cm, ${mass} kg`, () => {
            expect(sort(width, height, length, mass)).toBe(SPECIAL);
          });
        }
      );
    });

    // Parameterized tests for SPECIAL (heavy only) packages from design document
    describe("should return SPECIAL for design document heavy examples", () => {
      sortTestData.designDocumentTestCases.specialHeavy.forEach(
        ({ width, height, length, mass }, index) => {
          test(`design document special heavy case ${
            index + 1
          }: ${width}×${height}×${length} cm, ${mass} kg`, () => {
            expect(sort(width, height, length, mass)).toBe(SPECIAL);
          });
        }
      );
    });

    // Parameterized tests for REJECTED packages from design document
    describe("should return REJECTED for design document examples", () => {
      sortTestData.designDocumentTestCases.rejected.forEach(
        ({ width, height, length, mass }, index) => {
          test(`design document rejected case ${
            index + 1
          }: ${width}×${height}×${length} cm, ${mass} kg`, () => {
            expect(sort(width, height, length, mass)).toBe(REJECTED);
          });
        }
      );
    });

    // Comprehensive integration test verifying all classification paths
    describe("comprehensive classification path verification", () => {
      test("verifies all four classification paths using design document data", () => {
        // Test STANDARD path
        sortTestData.designDocumentTestCases.standard.forEach(
          ({ width, height, length, mass }) => {
            const result = sort(width, height, length, mass);
            expect(result).toBe(STANDARD);
            // Verify the classification logic path
            expect(isBulky(width, height, length)).toBe(false);
            expect(isHeavy(mass)).toBe(false);
          }
        );

        // Test SPECIAL (bulky only) path
        sortTestData.designDocumentTestCases.specialBulky.forEach(
          ({ width, height, length, mass }) => {
            const result = sort(width, height, length, mass);
            expect(result).toBe(SPECIAL);
            // Verify the classification logic path
            expect(isBulky(width, height, length)).toBe(true);
            expect(isHeavy(mass)).toBe(false);
          }
        );

        // Test SPECIAL (heavy only) path
        sortTestData.designDocumentTestCases.specialHeavy.forEach(
          ({ width, height, length, mass }) => {
            const result = sort(width, height, length, mass);
            expect(result).toBe(SPECIAL);
            // Verify the classification logic path
            expect(isBulky(width, height, length)).toBe(false);
            expect(isHeavy(mass)).toBe(true);
          }
        );

        // Test REJECTED path
        sortTestData.designDocumentTestCases.rejected.forEach(
          ({ width, height, length, mass }) => {
            const result = sort(width, height, length, mass);
            expect(result).toBe(REJECTED);
            // Verify the classification logic path
            expect(isBulky(width, height, length)).toBe(true);
            expect(isHeavy(mass)).toBe(true);
          }
        );
      });
    });
  });
});

describe("Individual Rule Condition Functions", () => {
  // Test individual rule conditions from CLASSIFICATION_RULES
  describe("rejected-packages rule condition", () => {
    const rejectedCondition = CLASSIFICATION_RULES.find(
      (rule) => rule.name === "rejected-packages"
    ).condition;

    test("should return true when package is both bulky and heavy", () => {
      const packageData = { bulky: true, heavy: true };
      expect(rejectedCondition(packageData)).toBe(true);
    });

    test("should return false when package is bulky but not heavy", () => {
      const packageData = { bulky: true, heavy: false };
      expect(rejectedCondition(packageData)).toBe(false);
    });

    test("should return false when package is heavy but not bulky", () => {
      const packageData = { bulky: false, heavy: true };
      expect(rejectedCondition(packageData)).toBe(false);
    });

    test("should return false when package is neither bulky nor heavy", () => {
      const packageData = { bulky: false, heavy: false };
      expect(rejectedCondition(packageData)).toBe(false);
    });
  });

  describe("special-packages rule condition", () => {
    const specialCondition = CLASSIFICATION_RULES.find(
      (rule) => rule.name === "special-packages"
    ).condition;

    test("should return true when package is bulky but not heavy", () => {
      const packageData = { bulky: true, heavy: false };
      expect(specialCondition(packageData)).toBe(true);
    });

    test("should return true when package is heavy but not bulky", () => {
      const packageData = { bulky: false, heavy: true };
      expect(specialCondition(packageData)).toBe(true);
    });

    test("should return true when package is both bulky and heavy", () => {
      const packageData = { bulky: true, heavy: true };
      expect(specialCondition(packageData)).toBe(true);
    });

    test("should return false when package is neither bulky nor heavy", () => {
      const packageData = { bulky: false, heavy: false };
      expect(specialCondition(packageData)).toBe(false);
    });
  });

  describe("standard-packages rule condition", () => {
    const standardCondition = CLASSIFICATION_RULES.find(
      (rule) => rule.name === "standard-packages"
    ).condition;

    test("should always return true (default case)", () => {
      expect(standardCondition({ bulky: true, heavy: true })).toBe(true);
      expect(standardCondition({ bulky: true, heavy: false })).toBe(true);
      expect(standardCondition({ bulky: false, heavy: true })).toBe(true);
      expect(standardCondition({ bulky: false, heavy: false })).toBe(true);
      expect(standardCondition({})).toBe(true);
    });
  });
});

describe("Rule Engine Integration with Different Rule Combinations", () => {
  describe("custom rule combinations", () => {
    test("should handle rules with different priority orders", () => {
      const customRules = [
        {
          name: "high-priority",
          condition: (pkg) => pkg.mass > 50,
          result: "ULTRA_HEAVY",
          priority: 1,
        },
        {
          name: "medium-priority",
          condition: (pkg) => pkg.bulky && pkg.heavy,
          result: REJECTED,
          priority: 2,
        },
        {
          name: "low-priority",
          condition: () => true,
          result: STANDARD,
          priority: 3,
        },
      ];

      const engine = new RuleEngine(customRules);

      // Test ultra heavy package (should match first rule)
      expect(engine.evaluate({ mass: 60, bulky: true, heavy: true })).toBe(
        "ULTRA_HEAVY"
      );

      // Test bulky and heavy but not ultra heavy (should match second rule)
      expect(engine.evaluate({ mass: 30, bulky: true, heavy: true })).toBe(
        REJECTED
      );

      // Test standard package (should match third rule)
      expect(engine.evaluate({ mass: 10, bulky: false, heavy: false })).toBe(
        STANDARD
      );
    });

    test("should handle overlapping rule conditions correctly", () => {
      const overlappingRules = [
        {
          name: "specific-rule",
          condition: (pkg) => pkg.width > 200 && pkg.mass > 30,
          result: "SPECIFIC",
          priority: 1,
        },
        {
          name: "general-rule",
          condition: (pkg) => pkg.width > 200,
          result: "GENERAL",
          priority: 2,
        },
        {
          name: "default-rule",
          condition: () => true,
          result: "DEFAULT",
          priority: 3,
        },
      ];

      const engine = new RuleEngine(overlappingRules);

      // Should match specific rule (higher priority)
      expect(engine.evaluate({ width: 250, mass: 35 })).toBe("SPECIFIC");

      // Should match general rule (specific rule doesn't match)
      expect(engine.evaluate({ width: 250, mass: 25 })).toBe("GENERAL");

      // Should match default rule
      expect(engine.evaluate({ width: 150, mass: 25 })).toBe("DEFAULT");
    });

    test("should handle complex multi-criteria rules", () => {
      const complexRules = [
        {
          name: "complex-rejection",
          condition: (pkg) =>
            (pkg.width > 200 || pkg.height > 200 || pkg.length > 200) &&
            pkg.mass > 25 &&
            pkg.width * pkg.height * pkg.length > 2000000,
          result: "COMPLEX_REJECTED",
          priority: 1,
        },
        {
          name: "simple-default",
          condition: () => true,
          result: "SIMPLE_DEFAULT",
          priority: 2,
        },
      ];

      const engine = new RuleEngine(complexRules);

      // Should match complex rule
      expect(
        engine.evaluate({
          width: 250,
          height: 100,
          length: 100,
          mass: 30,
        })
      ).toBe("COMPLEX_REJECTED");

      // Should not match complex rule (volume too small)
      expect(
        engine.evaluate({
          width: 250,
          height: 50,
          length: 50,
          mass: 30,
        })
      ).toBe("SIMPLE_DEFAULT");
    });
  });

  describe("rule engine with empty and invalid configurations", () => {
    test("should handle single rule configuration", () => {
      const singleRule = [
        {
          name: "only-rule",
          condition: () => true,
          result: "ONLY",
          priority: 1,
        },
      ];

      const engine = new RuleEngine(singleRule);
      expect(engine.evaluate({ test: "data" })).toBe("ONLY");
    });

    test("should handle rules with zero priority", () => {
      const zeroPriorityRules = [
        {
          name: "zero-priority",
          condition: () => true,
          result: "ZERO",
          priority: 0,
        },
        {
          name: "higher-priority",
          condition: () => true,
          result: "HIGHER",
          priority: 1,
        },
      ];

      const engine = new RuleEngine(zeroPriorityRules);
      expect(engine.evaluate({})).toBe("ZERO");
    });

    test("should handle rules with floating point priorities", () => {
      const floatPriorityRules = [
        {
          name: "float-low",
          condition: () => true,
          result: "FLOAT_LOW",
          priority: 1.5,
        },
        {
          name: "float-high",
          condition: () => true,
          result: "FLOAT_HIGH",
          priority: 1.2,
        },
      ];

      const engine = new RuleEngine(floatPriorityRules);
      expect(engine.evaluate({})).toBe("FLOAT_HIGH");
    });
  });
});

describe("RuleEngine class", () => {
  // Test data for rule engine testing
  const validRules = [
    {
      name: "test-rule-1",
      condition: (pkg) => pkg.bulky && pkg.heavy,
      result: REJECTED,
      priority: PRIORITY_HIGH,
    },
    {
      name: "test-rule-2",
      condition: (pkg) => pkg.bulky || pkg.heavy,
      result: SPECIAL,
      priority: PRIORITY_MEDIUM,
    },
    {
      name: "test-rule-3",
      condition: (pkg) => true,
      result: STANDARD,
      priority: PRIORITY_LOW,
    },
  ];

  const testPackageData = {
    width: 100,
    height: 100,
    length: 100,
    mass: 15,
    bulky: false,
    heavy: false,
  };

  describe("constructor", () => {
    test("should create RuleEngine with valid rules", () => {
      const engine = new RuleEngine(validRules);
      expect(engine).toBeInstanceOf(RuleEngine);
      expect(engine.rules).toHaveLength(3);
    });

    test("should sort rules by priority", () => {
      const unsortedRules = [
        { name: "low", condition: () => true, result: "LOW", priority: 3 },
        { name: "high", condition: () => true, result: "HIGH", priority: 1 },
        {
          name: "medium",
          condition: () => true,
          result: "MEDIUM",
          priority: 2,
        },
      ];
      const engine = new RuleEngine(unsortedRules);
      expect(engine.rules[0].priority).toBe(1);
      expect(engine.rules[1].priority).toBe(2);
      expect(engine.rules[2].priority).toBe(3);
    });

    test("should throw error for non-array rules", () => {
      expect(() => new RuleEngine("not an array")).toThrow(
        "Rules must be an array"
      );
      expect(() => new RuleEngine(null)).toThrow("Rules must be an array");
      expect(() => new RuleEngine(undefined)).toThrow("Rules must be an array");
    });

    test("should throw error for empty rules array", () => {
      expect(() => new RuleEngine([])).toThrow("Rules array cannot be empty");
    });

    test("should throw error for invalid rule objects", () => {
      expect(() => new RuleEngine([null])).toThrow("Rule must be an object");
      expect(() => new RuleEngine(["string"])).toThrow(
        "Rule must be an object"
      );
      expect(() => new RuleEngine([123])).toThrow("Rule must be an object");
    });

    test("should throw error for rules missing required properties", () => {
      const incompleteRule = { name: "test" };
      expect(() => new RuleEngine([incompleteRule])).toThrow(
        "Rule is missing required property: condition"
      );

      const ruleWithoutName = {
        condition: () => true,
        result: "TEST",
        priority: 1,
      };
      expect(() => new RuleEngine([ruleWithoutName])).toThrow(
        "Rule is missing required property: name"
      );
    });

    test("should throw error for invalid rule property types", () => {
      const invalidNameRule = {
        name: "",
        condition: () => true,
        result: "TEST",
        priority: 1,
      };
      expect(() => new RuleEngine([invalidNameRule])).toThrow(
        "Rule name must be a non-empty string"
      );

      const invalidConditionRule = {
        name: "test",
        condition: "not a function",
        result: "TEST",
        priority: 1,
      };
      expect(() => new RuleEngine([invalidConditionRule])).toThrow(
        "Rule condition must be a function"
      );

      const invalidResultRule = {
        name: "test",
        condition: () => true,
        result: "",
        priority: 1,
      };
      expect(() => new RuleEngine([invalidResultRule])).toThrow(
        "Rule result must be a non-empty string"
      );

      const invalidPriorityRule = {
        name: "test",
        condition: () => true,
        result: "TEST",
        priority: -1,
      };
      expect(() => new RuleEngine([invalidPriorityRule])).toThrow(
        "Rule priority must be a non-negative number"
      );
    });
  });

  describe("evaluate method", () => {
    let engine;

    beforeEach(() => {
      engine = new RuleEngine(validRules);
    });

    test("should return result from first matching rule", () => {
      const bulkyAndHeavyPackage = {
        ...testPackageData,
        bulky: true,
        heavy: true,
      };
      expect(engine.evaluate(bulkyAndHeavyPackage)).toBe(REJECTED);

      const bulkyOnlyPackage = {
        ...testPackageData,
        bulky: true,
        heavy: false,
      };
      expect(engine.evaluate(bulkyOnlyPackage)).toBe(SPECIAL);

      const heavyOnlyPackage = {
        ...testPackageData,
        bulky: false,
        heavy: true,
      };
      expect(engine.evaluate(heavyOnlyPackage)).toBe(SPECIAL);

      const standardPackage = {
        ...testPackageData,
        bulky: false,
        heavy: false,
      };
      expect(engine.evaluate(standardPackage)).toBe(STANDARD);
    });

    test("should evaluate rules in priority order", () => {
      // Create rules with same conditions but different priorities
      const testRules = [
        {
          name: "low-priority",
          condition: () => true,
          result: "LOW",
          priority: 3,
        },
        {
          name: "high-priority",
          condition: () => true,
          result: "HIGH",
          priority: 1,
        },
      ];
      const testEngine = new RuleEngine(testRules);

      // Should return result from high priority rule (priority 1)
      expect(testEngine.evaluate(testPackageData)).toBe("HIGH");
    });

    test("should throw error for invalid package data", () => {
      expect(() => engine.evaluate(null)).toThrow(
        "Package data must be an object"
      );
      expect(() => engine.evaluate(undefined)).toThrow(
        "Package data must be an object"
      );
      expect(() => engine.evaluate("string")).toThrow(
        "Package data must be an object"
      );
    });

    test("should handle condition function errors", () => {
      const errorRule = {
        name: "error-rule",
        condition: () => {
          throw new Error("Condition error");
        },
        result: "ERROR",
        priority: 1,
      };
      const errorEngine = new RuleEngine([errorRule]);

      expect(() => errorEngine.evaluate(testPackageData)).toThrow(
        'Error evaluating rule "error-rule": Condition error'
      );
    });

    test("should throw error when no rules match", () => {
      const noMatchRules = [
        {
          name: "never-match",
          condition: () => false,
          result: "NEVER",
          priority: 1,
        },
      ];
      const noMatchEngine = new RuleEngine(noMatchRules);

      expect(() => noMatchEngine.evaluate(testPackageData)).toThrow(
        "No matching rule found for package data"
      );
    });
  });

  describe("addRule method", () => {
    let engine;

    beforeEach(() => {
      engine = new RuleEngine(validRules);
    });

    test("should add valid rule and maintain priority order", () => {
      const newRule = {
        name: "new-rule",
        condition: (pkg) => pkg.width > 200,
        result: "NEW",
        priority: 0, // Highest priority
      };

      engine.addRule(newRule);
      expect(engine.rules).toHaveLength(4);
      expect(engine.rules[0].name).toBe("new-rule"); // Should be first due to priority 0
    });

    test("should throw error for duplicate rule names", () => {
      const duplicateRule = {
        name: "test-rule-1", // Same name as existing rule
        condition: () => true,
        result: "DUPLICATE",
        priority: 5,
      };

      expect(() => engine.addRule(duplicateRule)).toThrow(
        'Rule with name "test-rule-1" already exists'
      );
    });

    test("should throw error for invalid rule", () => {
      const invalidRule = { name: "invalid" }; // Missing required properties
      expect(() => engine.addRule(invalidRule)).toThrow(
        "Rule is missing required property: condition"
      );
    });
  });

  describe("removeRule method", () => {
    let engine;

    beforeEach(() => {
      engine = new RuleEngine(validRules);
    });

    test("should remove existing rule", () => {
      expect(engine.rules).toHaveLength(3);
      engine.removeRule("test-rule-2");
      expect(engine.rules).toHaveLength(2);
      expect(
        engine.rules.find((rule) => rule.name === "test-rule-2")
      ).toBeUndefined();
    });

    test("should throw error for non-existent rule", () => {
      expect(() => engine.removeRule("non-existent")).toThrow(
        'Rule with name "non-existent" not found'
      );
    });

    test("should throw error for invalid rule name", () => {
      expect(() => engine.removeRule("")).toThrow(
        "Rule name must be a non-empty string"
      );
      expect(() => engine.removeRule(null)).toThrow(
        "Rule name must be a non-empty string"
      );
    });
  });

  describe("integration with CLASSIFICATION_RULES", () => {
    test("should work with predefined classification rules", () => {
      const engine = new RuleEngine(CLASSIFICATION_RULES);

      // Test with various package configurations
      const testCases = [
        { packageData: { bulky: true, heavy: true }, expected: REJECTED },
        { packageData: { bulky: true, heavy: false }, expected: SPECIAL },
        { packageData: { bulky: false, heavy: true }, expected: SPECIAL },
        { packageData: { bulky: false, heavy: false }, expected: STANDARD },
      ];

      testCases.forEach(({ packageData, expected }) => {
        expect(engine.evaluate(packageData)).toBe(expected);
      });
    });

    test("should maintain same behavior as original sort function", () => {
      const engine = new RuleEngine(CLASSIFICATION_RULES);

      // Test with actual package dimensions and mass
      const testPackages = [
        { width: 100, height: 100, length: 100, mass: 15 }, // Standard
        { width: 200, height: 100, length: 100, mass: 15 }, // Special (bulky)
        { width: 100, height: 100, length: 100, mass: 25 }, // Special (heavy)
        { width: 200, height: 100, length: 100, mass: 25 }, // Rejected (both)
      ];

      testPackages.forEach(({ width, height, length, mass }) => {
        const packageData = {
          width,
          height,
          length,
          mass,
          bulky: isBulky(width, height, length),
          heavy: isHeavy(mass),
        };

        const engineResult = engine.evaluate(packageData);
        const sortResult = sort(width, height, length, mass);

        expect(engineResult).toBe(sortResult);
      });
    });
  });

  describe("edge cases and error handling", () => {
    test("should handle rules with complex conditions", () => {
      const complexRules = [
        {
          name: "complex-rule",
          condition: (pkg) =>
            pkg.width > 100 && pkg.height < 50 && pkg.mass >= 10,
          result: "COMPLEX",
          priority: 1,
        },
        {
          name: "default-rule",
          condition: () => true,
          result: "DEFAULT",
          priority: 2,
        },
      ];

      const engine = new RuleEngine(complexRules);

      const matchingPackage = {
        width: 150,
        height: 40,
        mass: 15,
        bulky: false,
        heavy: false,
      };
      expect(engine.evaluate(matchingPackage)).toBe("COMPLEX");

      const nonMatchingPackage = {
        width: 50,
        height: 40,
        mass: 15,
        bulky: false,
        heavy: false,
      };
      expect(engine.evaluate(nonMatchingPackage)).toBe("DEFAULT");
    });

    test("should handle rules with same priority", () => {
      const samePriorityRules = [
        { name: "rule-1", condition: () => true, result: "FIRST", priority: 1 },
        {
          name: "rule-2",
          condition: () => true,
          result: "SECOND",
          priority: 1,
        },
      ];

      const engine = new RuleEngine(samePriorityRules);
      // Should return result from first rule in array (stable sort)
      expect(engine.evaluate(testPackageData)).toBe("FIRST");
    });

    test("should handle empty package data object", () => {
      const engine = new RuleEngine(validRules);
      const emptyPackage = {};

      // Should still work with default rule
      expect(engine.evaluate(emptyPackage)).toBe(STANDARD);
    });

    test("should handle package data with extra properties", () => {
      const engine = new RuleEngine(validRules);
      const packageWithExtraProps = {
        width: 100,
        height: 100,
        length: 100,
        mass: 15,
        bulky: false,
        heavy: false,
        extraProp: "should be ignored",
        anotherProp: 123,
      };

      expect(engine.evaluate(packageWithExtraProps)).toBe(STANDARD);
    });

    test("should handle package data with missing optional properties", () => {
      const engine = new RuleEngine(validRules);
      const minimalPackage = {
        bulky: true,
        heavy: false,
      };

      expect(engine.evaluate(minimalPackage)).toBe(SPECIAL);
    });

    test("should handle rules that access undefined package properties", () => {
      const ruleWithUndefinedAccess = [
        {
          name: "undefined-access",
          condition: (pkg) => pkg.nonExistentProp === undefined,
          result: "UNDEFINED_HANDLED",
          priority: 1,
        },
        {
          name: "default",
          condition: () => true,
          result: "DEFAULT",
          priority: 2,
        },
      ];

      const engine = new RuleEngine(ruleWithUndefinedAccess);
      expect(engine.evaluate({ bulky: false, heavy: false })).toBe(
        "UNDEFINED_HANDLED"
      );
    });

    test("should handle rules with null/undefined values in conditions", () => {
      const nullHandlingRules = [
        {
          name: "null-check",
          condition: (pkg) => pkg.nullProp === null,
          result: "NULL_HANDLED",
          priority: 1,
        },
        {
          name: "undefined-check",
          condition: (pkg) => pkg.undefinedProp === undefined,
          result: "UNDEFINED_HANDLED",
          priority: 2,
        },
        {
          name: "default",
          condition: () => true,
          result: "DEFAULT",
          priority: 3,
        },
      ];

      const engine = new RuleEngine(nullHandlingRules);

      expect(engine.evaluate({ nullProp: null })).toBe("NULL_HANDLED");
      expect(engine.evaluate({ undefinedProp: undefined })).toBe(
        "UNDEFINED_HANDLED"
      );
      expect(engine.evaluate({})).toBe("UNDEFINED_HANDLED"); // undefined property
    });
  });

  describe("comprehensive rule validation edge cases", () => {
    test("should throw error for rule with whitespace-only name", () => {
      const whitespaceNameRule = {
        name: "   ",
        condition: () => true,
        result: "TEST",
        priority: 1,
      };
      expect(() => new RuleEngine([whitespaceNameRule])).toThrow(
        "Rule name must be a non-empty string"
      );
    });

    test("should throw error for rule with whitespace-only result", () => {
      const whitespaceResultRule = {
        name: "test",
        condition: () => true,
        result: "   ",
        priority: 1,
      };
      expect(() => new RuleEngine([whitespaceResultRule])).toThrow(
        "Rule result must be a non-empty string"
      );
    });

    test("should throw error for rule with non-integer priority", () => {
      const stringPriorityRule = {
        name: "test",
        condition: () => true,
        result: "TEST",
        priority: "1",
      };
      expect(() => new RuleEngine([stringPriorityRule])).toThrow(
        "Rule priority must be a non-negative number"
      );
    });

    test("should throw error for rule with NaN priority", () => {
      const nanPriorityRule = {
        name: "test",
        condition: () => true,
        result: "TEST",
        priority: NaN,
      };
      expect(() => new RuleEngine([nanPriorityRule])).toThrow(
        "Rule priority must be a non-negative number"
      );
    });

    test("should throw error for rule with Infinity priority", () => {
      const infinityPriorityRule = {
        name: "test",
        condition: () => true,
        result: "TEST",
        priority: Infinity,
      };
      expect(() => new RuleEngine([infinityPriorityRule])).toThrow(
        "Rule priority must be a non-negative number"
      );
    });
  });
});
