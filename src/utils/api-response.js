export class ApiResponse {
    constructor(data = null, message, status) {
        this.data = data;
        this.message = message;
        this.status = status;
    }
}
