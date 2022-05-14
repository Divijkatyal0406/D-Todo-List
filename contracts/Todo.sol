pragma solidity >=0.4.22 <0.9.0;

contract TodoList{

    uint taskCount=0;
    struct Task{
        uint id;
        string content;
        uint time;
        uint priority;
    }
    mapping(uint=>Task) tasks;

    function createTask(string memory content,uint time) public{
        tasks[taskCount]=Task(taskCount,content,block.timestamp,block.timestamp-time);
        taskCount++;
    }

    function deleteTask(uint id) public{
        delete tasks[id];
        taskCount--;
    }
}