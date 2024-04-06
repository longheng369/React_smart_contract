

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ToDoList {
    struct Task {
        uint id;
        string content;
        bool completed;
        bool deleted; 
       
    }

    event TaskCreated(uint indexed id, string content, bool completed);
    event TaskCompleted(uint indexed id, bool completed);
    event TaskEdited(uint indexed id, string content);
    event TaskDeleted(uint indexed id);

    mapping(uint => Task) public tasks;
    uint public tasksCount;

    constructor() {
        tasksCount = 0;
    }

    function createTask(string memory _content) public {
        require(bytes(_content).length > 0, "Task content cannot be empty.");
        tasksCount++;
        tasks[tasksCount] = Task(tasksCount, _content, false, false); // Initialize 'deleted' as false
        emit TaskCreated(tasksCount, _content, false);
    }

    function toggleCompleted(uint _id) public {
        require(_id > 0 && _id <= tasksCount, "Task does not exist.");
        require(!tasks[_id].deleted, "Task has been deleted.");
        tasks[_id].completed = !tasks[_id].completed;
        emit TaskCompleted(_id, tasks[_id].completed);
    }

    function editTask(uint _id, string memory _newContent) public {
        require(_id > 0 && _id <= tasksCount, "Task does not exist.");
        require(!tasks[_id].deleted, "Task has been deleted.");
        require(bytes(_newContent).length > 0, "Task content cannot be empty.");
        tasks[_id].content = _newContent;
        emit TaskEdited(_id, _newContent);
    }

    function deleteTask(uint _id) public {
        require(_id > 0 && _id <= tasksCount, "Task does not exist.");
        tasks[_id].deleted = true; // Mark the task as deleted
        emit TaskDeleted(_id);
    }

    function getTask(uint _id) public view returns (Task memory) {
        require(_id > 0 && _id <= tasksCount, "Task does not exist.");
        require(!tasks[_id].deleted, "Task has been deleted.");
        return tasks[_id];
    }
}

