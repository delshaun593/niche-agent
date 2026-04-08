export declare function captureLead(params: {
    name: string;
    phone: string;
    email?: string;
    niche?: string;
    notes?: string;
}, userId?: string): Promise<{
    status: string;
    message: string;
    data?: never;
} | {
    status: string;
    data: any[];
    message?: never;
}>;
//# sourceMappingURL=captureLead.d.ts.map