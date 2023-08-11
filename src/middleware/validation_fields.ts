export function validationFields<T>(obj: T): (keyof T)[] {
    const emptyFields: (keyof T)[] = [];

    for (const key in obj) {
        const value = obj[key];

        if (typeof value === 'string' && value.trim() === '') {
            emptyFields.push(key as keyof T);
        }

        if (value instanceof Date && (value == null || isNaN(value.getTime()))) {
            emptyFields.push(key as keyof T);
        }

        if (typeof value === 'number' && (value == null || isNaN(value))) {
            emptyFields.push(key as keyof T);
        }
    }

    return emptyFields;
}