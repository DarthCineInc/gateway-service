export class GatewayException extends Error {
    public status: number;
    constructor(message, status: number) {
        super(message);
        this.status = status;
        this.name = "GatewayException";
    }
}