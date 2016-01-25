module.exports = class Resource {
    constructor(name, app, route, get_handler) {
        this.name = name;
        this.app = app;
        this.get_handler = get_handler;
        this.route = route;
    }

    register() {
        this.app.get(this.route, this.get_handler);
    }
};