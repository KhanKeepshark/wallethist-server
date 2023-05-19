class ApiError extends Error {
    constructor(status, message) {
        super()
        this.status = status
        this.message = message
    }

    static badReq(code, message) {
        return new ApiError(code, message)
    }

    static internal(message) {
        return new ApiError(500, message)
    }
}

export default ApiError