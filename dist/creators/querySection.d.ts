export declare const select: (fields: any[]) => string;
export declare const from: (tables: any, join: any[]) => string;
export declare const where: (where: {
    [x: string]: any;
}, start: number, user_id: string) => {
    query: string;
    values: string[];
};
export declare const order: (order: any[]) => string;
export declare const set: (fields: {
    [x: string]: any;
}, start: any, user_id: string) => {
    query: string;
    values: string[];
};
