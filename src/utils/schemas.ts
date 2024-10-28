/**
 * Schemas are used for parsing to make sure the types are accurate
 */
export type Schema =
    | {
          type: "string" | "number" | "boolean" | "null" | "undefined";
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
 * Schema for the list of openTaskIDs
 */
export const openTaskIDsSchema: Schema = {
    type: "array",
    children: {
        type: "string"
    }
};

/**
 * Schema for the list of TaskGroups
 */
export const taskGroupsSchema: Schema = {
    type: "array",
    children: {
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
    }
};

/**
 * Validates an object with the schema, returning if it matches the specified type
 */
export const validateWithSchema = (object: unknown, schema: Schema): boolean => {
    // Object is a basic type, ensure that the type matches
    if (
        schema.type === "string" ||
        schema.type === "number" ||
        schema.type === "boolean"
    ) {
        return typeof object === schema.type;
    } else if (schema.type === "null") {
        return object === null;
    } else if (schema.type === "undefined") {
        return object === undefined;
    } else if (schema.type === "array") {
        // Make sure the object is an array and all its children match the child schema
        if (Array.isArray(object)) {
            for (const child of object) {
                if (!validateWithSchema(child, schema.children)) {
                    return false;
                }
            }

            return true;
        }
    } else if (schema.type === "object") {
        if (object === null || object === undefined) {
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
        }
    }

    return false;
};
