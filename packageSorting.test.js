const {
  isBulky,
  isHeavy,
  sort,
  VOLUME_THRESHOLD,
  DIMENSION_THRESHOLD,
  MASS_THRESHOLD,
  STANDARD,
  SPECIAL,
  REJECTED,
} = require("./packageSorting");

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
