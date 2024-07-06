#include <iostream>
#include <string>
#include "sqlite3.h"
#include "..\\libs\\httplib\\cpp-httplib\\httplib.h"
#include <sstream>
#include "rapidjson/document.h"
#include "rapidjson/writer.h"
#include "rapidjson/stringbuffer.h"

using namespace rapidjson;

struct TaskDTO {
    std::string id;
    std::string title;
    std::string location;
    std::string due_date;
    int user_id;
};

// Forward declarations
bool getTasksForUser(const std::string& username, std::string& jsonResponse);
bool addTaskForUser(const std::string& username, const TaskDTO& task);
bool deleteTaskForUser(const std::string& username, int taskId);
bool updateTaskForUser(int oldTaskId, const TaskDTO& updatedTask);
void setCorsHeaders(httplib::Response& res);

int main() {
    using namespace httplib;

    Server svr;

    // Handle OPTIONS requests
    svr.Options("/tasks", [](const Request& req, Response& res) {
        setCorsHeaders(res);
    });
    
    // Get Tasks Endpoint
    svr.Get("/tasks", [](const Request& req, Response& res) {
        
        setCorsHeaders(res);

        std::string username = req.get_param_value("username");
        std::string jsonResponse;
        if (getTasksForUser(username, jsonResponse)) {
            res.set_content(jsonResponse, "application/json");
        } else {
            res.status = 404;
            res.set_content("Tasks not found", "text/plain");
        }
    });

    // Add Task Endpoint
    svr.Post("/tasks", [](const Request& req, Response& res) {
        setCorsHeaders(res);

        // Parse JSON body to extract TaskDTO
        Document json;
        json.Parse(req.body.c_str());

        if (!json.IsObject()) {
            res.status = 400;
            res.set_content("Invalid JSON format", "text/plain");
            return;
        }

        if (!json.HasMember("username") || !json.HasMember("task")) {
            res.status = 400;
            res.set_content("Missing required fields in JSON", "text/plain");
            return;
        }

        const Value& taskJson = json["task"];

        if (!taskJson.IsObject() || !taskJson.HasMember("id") || !taskJson.HasMember("title") || !taskJson.HasMember("location") || !taskJson.HasMember("due_date") || !taskJson.HasMember("user_id")) {
            res.status = 400;
            res.set_content("Invalid task format", "text/plain");
            return;
        }

        // Extract TaskDTO from JSON
        std::string username = json["username"].GetString();
        std::string id = taskJson["id"].GetString();
        std::string title = taskJson["title"].GetString();
        std::string location = taskJson["location"].GetString();
        std::string dueDate = taskJson["due_date"].GetString(); // Assume YYYY-MM-DD format
        int userId = taskJson["user_id"].GetInt();

        TaskDTO task;
        task.id = id;
        task.title = title;
        task.location = location;
        task.due_date = dueDate;
        task.user_id = userId;

        // Call addTaskForUser function
        if (addTaskForUser(username, task)) {
            res.status = 200;
            res.set_content("Task added successfully", "text/plain");
        } else {
            res.status = 500;
            res.set_content("Failed to add task", "text/plain");
        }
    });

    // Edit Task Endpoint
    svr.Put("/tasks", [&](const Request& req, Response& res) {
        setCorsHeaders(res);

        // Extract query parameters
        std::string oldTaskIdStr = req.get_param_value("oldTaskId");

        if (oldTaskIdStr.empty()) {
            res.status = 400;
            res.set_content("Missing 'oldTaskId' parameter", "text/plain");
            return;
        }

        int oldTaskId = std::stoi(oldTaskIdStr);

        // Parse JSON body to extract updated TaskDTO
        Document json;
        json.Parse(req.body.c_str());

        if (!json.IsObject()) {
            res.status = 400;
            res.set_content("Invalid JSON format", "text/plain");
            return;
        }

        if (!json.HasMember("task")) {
            res.status = 400;
            res.set_content("Missing 'task' field in JSON", "text/plain");
            return;
        }

        const Value& taskJson = json["task"];

        if (!taskJson.IsObject()) {
            res.status = 400;
            res.set_content("Invalid task format", "text/plain");
            return;
        }

        // Extract updated TaskDTO from JSON
        TaskDTO updatedTask;
        updatedTask.id = taskJson["id"].GetString(); // New ID
        if (taskJson.HasMember("title"))
            updatedTask.title = taskJson["title"].GetString();
        if (taskJson.HasMember("location"))
            updatedTask.location = taskJson["location"].GetString();
        if (taskJson.HasMember("due_date"))
            updatedTask.due_date = taskJson["due_date"].GetString();
        if (taskJson.HasMember("user_id"))
            updatedTask.user_id = taskJson["user_id"].GetInt();

        // Call function to update task
        if (updateTaskForUser(oldTaskId, updatedTask)) {
            res.status = 200;
            res.set_content("Task updated successfully", "text/plain");
        } else {
            res.status = 500;
            res.set_content("Failed to update task", "text/plain");
        }
    });



    // Delete Task Endpoint
    svr.Delete("/tasks", [](const Request& req, Response& res) {

        setCorsHeaders(res);

        std::string username = req.get_param_value("username");
        int taskId = std::stoi(req.get_param_value("taskId"));

        if (deleteTaskForUser(username, taskId)) {
            res.status = 200;
            res.set_content("Task deleted successfully", "text/plain");
        } else {
            res.status = 500;
            res.set_content("Failed to delete task", "text/plain");
        }
    });

    std::cout << "Server started at http://localhost:8080" << std::endl;
    svr.listen("localhost", 8080);

    return 0;
}

bool getTasksForUser(const std::string& username, std::string& jsonResponse) {
    sqlite3* db;
    if (sqlite3_open("..\\libs\\sqlite3\\sqlite-tools-win-x64-3450100\\planner.db", &db) != SQLITE_OK) {
        std::cerr << "Error opening database" << std::endl;
        return false;
    }

    std::string query = "SELECT tasks.id, tasks.title, tasks.location, tasks.due_date, tasks.user_id FROM tasks JOIN users ON tasks.user_id = users.id WHERE users.username = ?";
    sqlite3_stmt* stmt;

    if (sqlite3_prepare_v2(db, query.c_str(), -1, &stmt, nullptr) != SQLITE_OK) {
        std::cerr << "Error preparing statement: " << sqlite3_errmsg(db) << std::endl;
        sqlite3_close(db);
        return false;
    }

    sqlite3_bind_text(stmt, 1, username.c_str(), -1, SQLITE_TRANSIENT);

    Document d;
    d.SetObject();
    Document::AllocatorType& allocator = d.GetAllocator();
    Value tasks(kArrayType);

    while (sqlite3_step(stmt) == SQLITE_ROW) {
        TaskDTO task;
        task.id = reinterpret_cast<const char*>(sqlite3_column_text(stmt, 0));
        task.title = reinterpret_cast<const char*>(sqlite3_column_text(stmt, 1));
        task.location = reinterpret_cast<const char*>(sqlite3_column_text(stmt, 2));
        task.due_date = reinterpret_cast<const char*>(sqlite3_column_text(stmt, 3));
        task.user_id = sqlite3_column_int(stmt, 4);

        Value taskJSON(kObjectType);
        taskJSON.AddMember("id", Value().SetString(task.id.c_str(), task.id.length(), allocator), allocator);
        taskJSON.AddMember("title", Value().SetString(task.title.c_str(), task.title.length(), allocator), allocator);
        taskJSON.AddMember("location", Value().SetString(task.location.c_str(), task.location.length(), allocator), allocator);
        taskJSON.AddMember("due_date", Value().SetString(task.due_date.c_str(), task.due_date.length(), allocator), allocator);
        taskJSON.AddMember("user_id", task.user_id, allocator);

        tasks.PushBack(taskJSON, allocator);
    }

    d.AddMember("tasks", tasks, allocator);

    StringBuffer buffer;
    Writer<StringBuffer> writer(buffer);
    d.Accept(writer);

    jsonResponse = buffer.GetString();

    sqlite3_finalize(stmt);
    sqlite3_close(db);

    return true;
}


// Modify addTaskForUser function to accept TaskDTO and insert task into SQLite database
bool addTaskForUser(const std::string& username, const TaskDTO& task) {
    sqlite3* db;
    if (sqlite3_open("..\\libs\\sqlite3\\sqlite-tools-win-x64-3450100\\planner.db", &db) != SQLITE_OK) {
        std::cerr << "Error opening database" << std::endl;
        return false;
    }

    std::string query = "INSERT INTO tasks (id, title, location, due_date, user_id) VALUES (?, ?, ?, ?, ?)";
    sqlite3_stmt* stmt;

    if (sqlite3_prepare_v2(db, query.c_str(), -1, &stmt, nullptr) != SQLITE_OK) {
        std::cerr << "Error preparing statement: " << sqlite3_errmsg(db) << std::endl;
        sqlite3_close(db);
        return false;
    }

    // Bind parameters to prepared statement
    sqlite3_bind_text(stmt, 1, task.id.c_str(), -1, SQLITE_TRANSIENT);
    sqlite3_bind_text(stmt, 2, task.title.c_str(), -1, SQLITE_TRANSIENT);
    sqlite3_bind_text(stmt, 3, task.location.c_str(), -1, SQLITE_TRANSIENT);
    sqlite3_bind_text(stmt, 4, task.due_date.c_str(), -1, SQLITE_TRANSIENT);
    sqlite3_bind_int(stmt, 5, task.user_id);

    // Execute the statement
    if (sqlite3_step(stmt) != SQLITE_DONE) {
        std::cerr << "Error executing statement: " << sqlite3_errmsg(db) << std::endl;
        sqlite3_finalize(stmt);
        sqlite3_close(db);
        return false;
    }

    // Finalize and close
    sqlite3_finalize(stmt);
    sqlite3_close(db);

    return true;
}

bool deleteTaskForUser(const std::string& username, int taskId) {
    sqlite3* db;
    if (sqlite3_open("..\\libs\\sqlite3\\sqlite-tools-win-x64-3450100\\planner.db", &db) != SQLITE_OK) {
        std::cerr << "Error opening database: " << sqlite3_errmsg(db) << std::endl;
        return false;
    }

    std::string query = "DELETE FROM tasks WHERE id = ? AND user_id = (SELECT id FROM users WHERE username = ?)";
    sqlite3_stmt* stmt;

    if (sqlite3_prepare_v2(db, query.c_str(), -1, &stmt, nullptr) != SQLITE_OK) {
        std::cerr << "Error preparing statement: " << sqlite3_errmsg(db) << std::endl;
        sqlite3_close(db);
        return false;
    }

    sqlite3_bind_int(stmt, 1, taskId);
    sqlite3_bind_text(stmt, 2, username.c_str(), -1, SQLITE_TRANSIENT);

    if (sqlite3_step(stmt) != SQLITE_DONE) {
        std::cerr << "Error deleting task: " << sqlite3_errmsg(db) << std::endl;
        sqlite3_finalize(stmt);
        sqlite3_close(db);
        return false;
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);

    return true;
}

// Modify function to update task in the database
bool updateTaskForUser(int oldTaskId, const TaskDTO& updatedTask) {
    sqlite3* db;
    if (sqlite3_open("..\\libs\\sqlite3\\sqlite-tools-win-x64-3450100\\planner.db", &db) != SQLITE_OK) {
        std::cerr << "Error opening database" << std::endl;
        return false;
    }

    std::string query = "UPDATE tasks SET id = ?, title = ?, location = ?, due_date = ?, user_id = ? WHERE id = ?";
    sqlite3_stmt* stmt;

    if (sqlite3_prepare_v2(db, query.c_str(), -1, &stmt, nullptr) != SQLITE_OK) {
        std::cerr << "Error preparing statement: " << sqlite3_errmsg(db) << std::endl;
        sqlite3_close(db);
        return false;
    }

    // Bind parameters to prepared statement
    sqlite3_bind_text(stmt, 1, updatedTask.id.c_str(), -1, SQLITE_TRANSIENT);
    sqlite3_bind_text(stmt, 2, updatedTask.title.c_str(), -1, SQLITE_TRANSIENT);
    sqlite3_bind_text(stmt, 3, updatedTask.location.c_str(), -1, SQLITE_TRANSIENT);
    sqlite3_bind_text(stmt, 4, updatedTask.due_date.c_str(), -1, SQLITE_TRANSIENT);
    sqlite3_bind_int(stmt, 5, updatedTask.user_id);
    sqlite3_bind_int(stmt, 6, oldTaskId);

    // Execute the statement
    if (sqlite3_step(stmt) != SQLITE_DONE) {
        std::cerr << "Error executing statement: " << sqlite3_errmsg(db) << std::endl;
        sqlite3_finalize(stmt);
        sqlite3_close(db);
        return false;
    }

    // Finalize and close
    sqlite3_finalize(stmt);
    sqlite3_close(db);

    return true;
}


void setCorsHeaders(httplib::Response& res) {
        res.set_header("Access-Control-Allow-Origin", "http://localhost:3000");
        res.set_header("Access-Control-Allow-Methods", "GET, POST, DELETE, PUT");
        res.set_header("Access-Control-Allow-Headers", "Content-Type");
    }