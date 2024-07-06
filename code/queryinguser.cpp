#include <iostream>
#include "sqlite3.h"

int main(int argc, char* argv[]) {
    if (argc != 2) {
        std::cerr << "Usage: " << argv[0] << " <user_id>" << std::endl;
        return 1;
    }

    // Extract user ID from command-line argument
    int user_id = std::stoi(argv[1]);

    // Open SQLite database
    sqlite3* db;
    int rc = sqlite3_open("..\\libs\\sqlite3\\sqlite-tools-win-x64-3450100\\planner.db", &db);

    if (rc) {
        std::cerr << "Error opening SQLite database: " << sqlite3_errmsg(db) << std::endl;
        return 1;
    }

    // Prepare SQL statement to select tasks for the specified user ID
    sqlite3_stmt* stmt;
    const char* query = "SELECT * FROM tasks WHERE user_id = ?";
    rc = sqlite3_prepare_v2(db, query, -1, &stmt, nullptr);
    if (rc != SQLITE_OK) {
        std::cerr << "Error preparing SQL statement: " << sqlite3_errmsg(db) << std::endl;
        sqlite3_close(db);
        return 1;
    }

    // Bind user ID parameter to the prepared statement
    sqlite3_bind_int(stmt, 1, user_id);

    // Execute the query and iterate through results
    while (sqlite3_step(stmt) == SQLITE_ROW) {
        int task_id = sqlite3_column_int(stmt, 0);
        const unsigned char* title = sqlite3_column_text(stmt, 1);
        // Retrieve other columns as needed

        // Print task details
        std::cout << "Task ID: " << task_id << ", Title: " << title << std::endl;
        // Print other task details if necessary
    }

    // Finalize the statement and close the database
    sqlite3_finalize(stmt);
    sqlite3_close(db);

    return 0;
}
