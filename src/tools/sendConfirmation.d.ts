export declare function sendConfirmation(params: {
    name: string;
    email: string;
    appointmentTime: string;
    service?: string;
}): Promise<{
    status: string;
    message: string;
    data?: never;
} | {
    status: string;
    data: import("resend").CreateEmailResponse;
    message?: never;
}>;
//# sourceMappingURL=sendConfirmation.d.ts.map