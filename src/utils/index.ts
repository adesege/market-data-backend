export const enumToArray = (tsEnum: Record<string, string>): string[] => Object.values(tsEnum);

export const toBoolean = (str: string) => JSON.parse(str);
