describe("Expectation", function() {
  it(".addMatchers makes matchers available to any expectation", function() {
    var matchers = {
        toFoo: function() {},
        toBar: function() {}
      },
      expectation;

    jasmine.Expectation.addMatchers(matchers);

    expectation = new jasmine.Expectation({});

    expect(expectation.toFoo).toBeDefined();
    expect(expectation.toBar).toBeDefined();
  });

  it("Factory builds", function() {
    var builtExpectation = jasmine.Expectation.Factory();

    expect(builtExpectation instanceof jasmine.Expectation).toBe(true)
    expect(builtExpectation.not instanceof jasmine.Expectation).toBe(true);
    expect(builtExpectation.not.isNot).toBe(true);
  });

  it("wraps matchers's compare functions, passing the actual and expected", function() {
    var fakeCompare = jasmine.createSpy('fake-compare').andReturn({pass: true}),
      matchers = {
        toFoo: function() {
          return {
            compare: fakeCompare
          };
        }
      },
      util = {
        buildFailureMessage: jasmine.createSpy('buildFailureMessage')
      },
      addExpectationResult = jasmine.createSpy("addExpectationResult"),
      expectation;

    jasmine.Expectation.addMatchers(matchers);

    expectation = new jasmine.Expectation({
      util: util,
      actual: "an actual",
      addExpectationResult: addExpectationResult
    });

    expectation.toFoo("hello");

    expect(fakeCompare).toHaveBeenCalledWith("an actual", "hello");
  });

  it("reports a passing result to the spec when the comparison passes", function() {
    var matchers = {
        toFoo: function() {
          return {
            compare: function() { return { pass: true }; }
          };
        }
      },
      util = {
        buildFailureMessage: jasmine.createSpy('buildFailureMessage')
      },
      addExpectationResult = jasmine.createSpy("addExpectationResult"),
      expectation;

    jasmine.Expectation.addMatchers(matchers);

    expectation = new jasmine.Expectation({
      matchers: matchers,
      util: util,
      actual: "an actual",
      addExpectationResult: addExpectationResult
    });

    expectation.toFoo("hello");

    expect(addExpectationResult).toHaveBeenCalledWith(true, {
      matcherName: "toFoo",
      passed: true,
      message: "",
      expected: "hello",
      actual: "an actual"
    });
  });

  it("reports a failing result to the spec when the comparison fails", function() {
    var matchers = {
        toFoo: function() {
          return {
            compare: function() { return { pass: false }; }
          };
        }
      },
      util = {
        buildFailureMessage: function() { return ""; }
      },
      addExpectationResult = jasmine.createSpy("addExpectationResult"),
      expectation;

    jasmine.Expectation.addMatchers(matchers);

    expectation = new jasmine.Expectation({
      matchers: matchers,
      util: util,
      actual: "an actual",
      addExpectationResult: addExpectationResult
    });

    expectation.toFoo("hello");

    expect(addExpectationResult).toHaveBeenCalledWith(false, {
      matcherName: "toFoo",
      passed: false,
      expected: "hello",
      actual: "an actual",
      message: jasmine.any(String)
    });
  });

  it("reports a failing result and a custom fail message to the spec when the comparison fails", function() {
    var matchers = {
        toFoo: function() {
          return {
            compare: function() {
              return {
                pass: false,
                message: "I am a custom message"
              };
            }
          };
        }
      },
      addExpectationResult = jasmine.createSpy("addExpectationResult"),
      expectation;

    jasmine.Expectation.addMatchers(matchers);

    expectation = new jasmine.Expectation({
      matchers: matchers,
      actual: "an actual",
      addExpectationResult: addExpectationResult
    });

    expectation.toFoo("hello");

    expect(addExpectationResult).toHaveBeenCalledWith(false, {
      matcherName: "toFoo",
      passed: false,
      expected: "hello",
      actual: "an actual",
      message: "I am a custom message"
    });
  });

  it("reports a passing result to the spec when the comparison fails for a negative expectation", function() {
    var matchers = {
        toFoo: function() {
          return {
            compare: function() { return { pass: false }; }
          };
        }
      },
      util = {
        buildFailureMessage: function() { return ""; }
      },
      addExpectationResult = jasmine.createSpy("addExpectationResult"),
      actual = "an actual",
      expectation;

    jasmine.Expectation.addMatchers(matchers);

    expectation = new jasmine.Expectation({
      matchers: matchers,
      actual: "an actual",
      addExpectationResult: addExpectationResult,
      isNot: true
    });

    expectation.toFoo("hello");

    expect(addExpectationResult).toHaveBeenCalledWith(true, {
      matcherName: "toFoo",
      passed: true,
      message: "",
      expected: "hello",
      actual: actual
    });
  });

  it("reports a failing result to the spec when the comparison passes for a negative expectation", function() {
    var matchers = {
        toFoo: function() {
          return {
            compare: function() { return { pass: true }; }
          };
        }
      },
      util = {
        buildFailureMessage: function() { return "default messge"; }
      },
      addExpectationResult = jasmine.createSpy("addExpectationResult"),
      actual = "an actual",
      expectation;

    jasmine.Expectation.addMatchers(matchers);

    expectation = new jasmine.Expectation({
      matchers: matchers,
      actual: "an actual",
      util: util,
      addExpectationResult: addExpectationResult,
      isNot: true
    });

    expectation.toFoo("hello");

    expect(addExpectationResult).toHaveBeenCalledWith(false, {
      matcherName: "toFoo",
      passed: false,
      expected: "hello",
      actual: actual,
      message: "default messge"
    });
  });

  it("reports a failing result and a custom fail message to the spec when the comparison passes for a negative expectation", function() {
    var matchers = {
        toFoo: function() {
          return {
            compare: function() {
              return {
                pass: true,
                message: "I am a custom message"
              };
            }
          };
        }
      },
      addExpectationResult = jasmine.createSpy("addExpectationResult"),
      actual = "an actual",
      expectation;

    jasmine.Expectation.addMatchers(matchers);

    expectation = new jasmine.Expectation({
      matchers: matchers,
      actual: "an actual",
      addExpectationResult: addExpectationResult,
      isNot: true
    });

    expectation.toFoo("hello");

    expect(addExpectationResult).toHaveBeenCalledWith(false, {
      matcherName: "toFoo",
      passed: false,
      expected: "hello",
      actual: actual,
      message: "I am a custom message"
    });
  });
});