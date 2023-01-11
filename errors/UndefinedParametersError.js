class UndefinedParametersError extends Error {
    constructor() {
        super('Undefined parameters');
        this.name = 'UndefinedParametersError';
        this.code = 400;
    }
}

module.exports = UndefinedParametersError;