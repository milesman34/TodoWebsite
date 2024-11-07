/**
 * Schemas are used for parsing to make sure the types are accurate
 */
export type Schema =
    | {
          type: "string" | "number" | "boolean" | "null" | "undefined" | "any";
      }
    | {
          type: "array";
          children: Schema;
      }
    | {
          type: "object";
          properties: {
              name: string;
              schema: Schema;
          }[];
      };

/**
 * Schema for a list of task IDs
 */
export const taskIDsSchema: Schema = {
    type: "array",
    children: {
        type: "string"
    }
};

/**
 * Schema for the list of TaskGroups
 */
export const taskGroupSchema: Schema = {
    type: "object",
    properties: [
        {
            name: "name",
            schema: {
                type: "string"
            }
        },

        {
            name: "description",
            schema: {
                type: "string"
            }
        },

        {
            name: "id",
            schema: {
                type: "string"
            }
        }
    ]
};

/**
 * Schema for a Task in storage
 */
export const taskSchema: Schema = {
    type: "object",
    properties: [
        {
            name: "name",
            schema: {
                type: "string"
            }
        },

        {
            name: "description",
            schema: {
                type: "string"
            }
        },

        {
            name: "id",
            schema: {
                type: "string"
            }
        },

        {
            name: "taskGroupID",
            schema: {
                type: "string"
            }
        },

        {
            name: "priority",
            schema: {
                type: "number"
            }
        },

        {
            name: "tags",
            schema: {
                type: "array",
                children: {
                    type: "string"
                }
            }
        }
    ]
};

/**
 * Schema for the list of Tasks in storage
 */
export const tasksSchema: Schema = {
    type: "array",
    children: taskSchema
};

/**
 * Schema for a list of tags to filter by
 */
export const filterTagsSchema: Schema = {
    type: "array",
    children: {
        type: "string"
    }
};

/**
 * Validates an object with the schema, returning if it matches the specified type
 */
export const validateWithSchema = (object: unknown, schema: Schema): boolean => {
    switch (schema.type) {
        case "any":
            // This is mainly used for if we just want to make sure that certain parts of the schema work
            return true;

        case "string":
        case "number":
        case "boolean":
            // Object is a basic type, ensure that the type matches
            return typeof object === schema.type;

        case "null":
            return object === null;

        case "undefined":
            return object === undefined;

        case "array":
            // Make sure the object is an array and all its children match the child schema
            if (Array.isArray(object)) {
                for (const child of object) {
                    if (!validateWithSchema(child, schema.children)) {
                        return false;
                    }
                }

                return true;
            }

            return false;

        case "object":
        default:
            if (object === null || object === undefined) {
                return false;
            }

            // Arrays do not count
            if (Array.isArray(object)) {
                return false;
            }

            // Make sure the object is an Object and has all the needed properties
            if (typeof object === "object") {
                // Make sure the object has the exact number of properties
                if (Object.keys(object).length !== schema.properties.length) {
                    return false;
                }

                for (const property of schema.properties) {
                    if (!(property.name in object)) {
                        return false; // Property doesn't exist
                    }

                    if (
                        !validateWithSchema(
                            object[property.name as keyof typeof object],
                            property.schema
                        )
                    ) {
                        return false; // Property value doesn't match the schema
                    }
                }

                return true;
            }

            return false;
    }
};
