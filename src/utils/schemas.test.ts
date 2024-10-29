import { describe, expect, test } from "vitest";
import { validateWithSchema } from "./schemas";

describe("schemas", () => {
    describe("validateWithSchema", () => {
        describe("validate any", () => {
            test("validate any true", () => {
                expect(
                    validateWithSchema("mine", {
                        type: "any"
                    })
                ).toBeTruthy();
            });

            test("validate any within children", () => {
                expect(
                    validateWithSchema([3, "6"], {
                        type: "array",
                        children: {
                            type: "any"
                        }
                    })
                ).toBeTruthy();
            });

            test("validate any within children with wrong parent type", () => {
                expect(
                    validateWithSchema(
                        { 3: 6 },
                        {
                            type: "array",
                            children: {
                                type: "any"
                            }
                        }
                    )
                ).toBeFalsy();
            });
        });

        describe("validate string", () => {
            test("validate string true", () => {
                expect(
                    validateWithSchema("string", {
                        type: "string"
                    })
                ).toBeTruthy();
            });

            test("validate string false with similar type", () => {
                expect(
                    validateWithSchema(5, {
                        type: "string"
                    })
                ).toBeFalsy();
            });

            test("validate string false w/ array", () => {
                expect(
                    validateWithSchema(["string"], {
                        type: "string"
                    })
                ).toBeFalsy();
            });
        });

        describe("validate number", () => {
            test("validate number true", () => {
                expect(
                    validateWithSchema(5, {
                        type: "number"
                    })
                ).toBeTruthy();
            });

            test("validate number false with similar type", () => {
                expect(
                    validateWithSchema(false, {
                        type: "number"
                    })
                ).toBeFalsy();
            });

            test("validate number false w/ array", () => {
                expect(
                    validateWithSchema([5, 3], {
                        type: "number"
                    })
                ).toBeFalsy();
            });
        });

        describe("validate boolean", () => {
            test("validate boolean true", () => {
                expect(
                    validateWithSchema(true, {
                        type: "boolean"
                    })
                ).toBeTruthy();
            });

            test("validate boolean false with similar type", () => {
                expect(
                    validateWithSchema("false", {
                        type: "boolean"
                    })
                ).toBeFalsy();
            });

            test("validate boolean false w/ array", () => {
                expect(
                    validateWithSchema([true], {
                        type: "boolean"
                    })
                ).toBeFalsy();
            });
        });

        describe("validate null", () => {
            test("validate null true", () => {
                expect(
                    validateWithSchema(null, {
                        type: "null"
                    })
                ).toBeTruthy();
            });

            test("validate null false", () => {
                expect(
                    validateWithSchema(undefined, {
                        type: "null"
                    })
                ).toBeFalsy();
            });
        });

        describe("validate undefined", () => {
            test("validate undefined true", () => {
                expect(
                    validateWithSchema(undefined, {
                        type: "undefined"
                    })
                ).toBeTruthy();
            });

            test("validate undefined false", () => {
                expect(
                    validateWithSchema(null, {
                        type: "undefined"
                    })
                ).toBeFalsy();
            });
        });

        describe("validate array", () => {
            test("validate array simple type false", () => {
                expect(
                    validateWithSchema(5, {
                        type: "array",
                        children: {
                            type: "number"
                        }
                    })
                ).toBeFalsy();
            });

            test("validate array object false", () => {
                expect(
                    validateWithSchema(
                        {},
                        {
                            type: "array",
                            children: {
                                type: "number"
                            }
                        }
                    )
                ).toBeFalsy();
            });

            test("validate array true", () => {
                expect(
                    validateWithSchema([3, 5, 6], {
                        type: "array",
                        children: {
                            type: "number"
                        }
                    })
                ).toBeTruthy();
            });

            test("validate array true empty array", () => {
                expect(
                    validateWithSchema([], {
                        type: "array",
                        children: {
                            type: "number"
                        }
                    })
                ).toBeTruthy();
            });

            test("validate array false", () => {
                expect(
                    validateWithSchema(["string", "bool"], {
                        type: "array",
                        children: {
                            type: "number"
                        }
                    })
                ).toBeFalsy();
            });
        });

        describe("validate object", () => {
            test("validate object simple false", () => {
                expect(
                    validateWithSchema("string", {
                        type: "object",
                        properties: []
                    })
                ).toBeFalsy();
            });

            test("validate object array false", () => {
                expect(
                    validateWithSchema([], {
                        type: "object",
                        properties: []
                    })
                ).toBeFalsy();
            });

            test("validate object null false", () => {
                expect(
                    validateWithSchema(null, {
                        type: "object",
                        properties: []
                    })
                ).toBeFalsy();
            });

            test("validate object undefined false", () => {
                expect(
                    validateWithSchema(undefined, {
                        type: "object",
                        properties: []
                    })
                ).toBeFalsy();
            });

            test("validate object wrong number of properties", () => {
                expect(
                    validateWithSchema(
                        { a: 3 },
                        {
                            type: "object",
                            properties: [
                                {
                                    name: "a",
                                    schema: {
                                        type: "number"
                                    }
                                },

                                {
                                    name: "b",
                                    schema: {
                                        type: "number"
                                    }
                                }
                            ]
                        }
                    )
                ).toBeFalsy();
            });

            test("validate object wrong property name", () => {
                expect(
                    validateWithSchema(
                        { a: 3, c: 5 },
                        {
                            type: "object",
                            properties: [
                                {
                                    name: "a",
                                    schema: {
                                        type: "number"
                                    }
                                },

                                {
                                    name: "b",
                                    schema: {
                                        type: "number"
                                    }
                                }
                            ]
                        }
                    )
                ).toBeFalsy();
            });

            test("validate object wrong property type", () => {
                expect(
                    validateWithSchema(
                        { a: 3, b: "string" },
                        {
                            type: "object",
                            properties: [
                                {
                                    name: "a",
                                    schema: {
                                        type: "number"
                                    }
                                },

                                {
                                    name: "b",
                                    schema: {
                                        type: "number"
                                    }
                                }
                            ]
                        }
                    )
                ).toBeFalsy();
            });

            test("validate object correct", () => {
                expect(
                    validateWithSchema(
                        { a: 3, b: 7 },
                        {
                            type: "object",
                            properties: [
                                {
                                    name: "a",
                                    schema: {
                                        type: "number"
                                    }
                                },

                                {
                                    name: "b",
                                    schema: {
                                        type: "number"
                                    }
                                }
                            ]
                        }
                    )
                ).toBeTruthy();
            });

            test("validate object correct nested", () => {
                expect(
                    validateWithSchema(
                        { b: [{ c: 5 }, { c: 6 }], a: 3 },
                        {
                            type: "object",
                            properties: [
                                {
                                    name: "a",
                                    schema: {
                                        type: "number"
                                    }
                                },

                                {
                                    name: "b",
                                    schema: {
                                        type: "array",
                                        children: {
                                            type: "object",
                                            properties: [
                                                {
                                                    name: "c",
                                                    schema: {
                                                        type: "number"
                                                    }
                                                }
                                            ]
                                        }
                                    }
                                }
                            ]
                        }
                    )
                ).toBeTruthy();
            });
        });
    });
});
