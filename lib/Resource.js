"use strict";

module.exports = class Resource {
    supported_verbs() { return ["checkout", "connect", "copy", "delete", "get", "head", "lock", "merge", "mkactivity",
                                "mkcol", "move", "m-search", "notify", "options", "patch", "post", "propfind",
                                "proppatch", "purge", "put", "report", "search", "subscribe", "trace", "unlock",
                                "unsubscribe"]; }

    constructor(name, route, handlers, sub_resources) {
        this.name = name;
        this.route = route;
        this.handlers = handlers;
        this.sub_resources = sub_resources;
        if (!sub_resources) this.sub_resources = [];
    }

    register(app, prefix) {
        let temp_route = prefix + this.route;
        for (var verb of this.supported_verbs()){
            if (this.handlers[verb]) {
                app[verb](temp_route, this.handlers[verb]);
            }
        }
        for (var sub_resource of this.sub_resources) {
            sub_resource.register(app, temp_route);
        }
    }
};