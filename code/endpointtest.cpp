#include "..\\libs\\httplib\\cpp-httplib\\httplib.h"
#include <iostream>

int main() {
    using namespace httplib;

    Server svr;

    svr.set_pre_routing_handler([](const Request&, Response& res) {
        res.set_header("Access-Control-Allow-Origin", "*");
        res.set_header("Access-Control-Allow-Headers", "Content-Type, Authorization");
        res.set_header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
        return Server::HandlerResponse::Unhandled;
    });

    svr.Options(".*", [](const Request&, Response& res) {
        res.set_header("Allow", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
        res.set_content("", "text/plain");
    });

    svr.Get("/", [](const Request&, Response& res) {
        res.set_content("Hello, World!", "text/plain");
    });

    // Add your other endpoints here

    std::cout << "Server started at http://localhost:8080" << std::endl;
    svr.listen("localhost", 8080);

    return 0;
}
