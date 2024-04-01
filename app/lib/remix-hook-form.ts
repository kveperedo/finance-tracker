// This was copied from `remix-hook-form` package.
// Remove this code once this PR is merged: https://github.com/Code-Forge-Net/remix-hook-form/pull/90

const tryParseJSON = (jsonString: string) => {
    try {
        const json = JSON.parse(jsonString);

        return json;
    } catch (e) {
        return jsonString;
    }
};

/**
 * Generates an output object from the given form data, where the keys in the output object retain
 * the structure of the keys in the form data. Keys containing integer indexes are treated as arrays.
 *
 * @param {FormData} formData - The form data to generate an output object from.
 * @param {boolean} [preserveStringified=false] - Whether to preserve stringified values or try to convert them
 * @returns {Object} The output object generated from the form data.
 */
export const generateFormData = (formData: FormData | URLSearchParams, preserveStringified = false) => {
    // Initialize an empty output object.
    const outputObject: Record<any, any> = {};

    // Iterate through each key-value pair in the form data.
    for (const [key, value] of formData.entries()) {
        // Try to convert data to the original type, otherwise return the original value
        const data = preserveStringified ? value : tryParseJSON(value.toString());
        // Split the key into an array of parts.
        const keyParts = key.split('.');
        // Initialize a variable to point to the current object in the output object.
        let currentObject = outputObject;

        // Iterate through each key part except for the last one.
        for (let i = 0; i < keyParts.length - 1; i++) {
            // Get the current key part.
            const keyPart = keyParts[i] as string;
            // If the current object doesn't have a property with the current key part,
            // initialize it as an object or array depending on whether the next key part is a valid integer index or not.
            if (!currentObject[keyPart]) {
                currentObject[keyPart] = /^\d+$/.test(keyParts[i + 1] as string) ? [] : {};
            }
            // Move the current object pointer to the next level of the output object.
            currentObject = currentObject[keyPart];
        }

        // Get the last key part.
        const lastKeyPart = keyParts[keyParts.length - 1] as string;
        const lastKeyPartIsArray = /\[\d*\]$|\[\]$/.test(lastKeyPart);

        // Handles array[] or array[0] cases
        if (lastKeyPartIsArray) {
            const key = lastKeyPart.replace(/\[\d*\]$|\[\]$/, '');
            if (!currentObject[key]) {
                currentObject[key] = [];
            }

            currentObject[key].push(data);
        }

        // Handles array.foo.0 cases
        if (!lastKeyPartIsArray) {
            // If the last key part is a valid integer index, push the value to the current array.
            if (/^\d+$/.test(lastKeyPart)) {
                currentObject.push(data);
            }
            // Otherwise, set a property on the current object with the last key part and the corresponding value.
            else {
                currentObject[lastKeyPart] = data;
            }
        }
    }

    // Return the output object.
    return outputObject;
};
