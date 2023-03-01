
class ComponentError extends Error {
    componentName?: string;
    constructor(name:string|undefined, msg: string) {
        super(msg);
        // Set the prototype explicitly.
        Object.setPrototypeOf(this, ComponentError.prototype);
        this.componentName = name;
    }
}

export default ComponentError;