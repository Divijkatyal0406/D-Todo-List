pragma solidity >=0.4.22 <0.9.0;

contract TodoList{

    uint public taskCount=0;
    struct Task{
        uint id;
        string content;
        uint time;
        uint priority;
        bool completed;
    }

    event TaskEvent(string _content,uint time);


    mapping(uint=>Task) public tasks;

    constructor() public{
        createTask("Test todo", block.timestamp);
    }

    function createTask(string memory _content,uint time) public{
        taskCount++;
        uint priority=block.timestamp-time;
        tasks[taskCount]=Task(taskCount,_content,block.timestamp,priority,false);
        emit TaskEvent(_content,tasks[taskCount].time);
    }

    function deleteTask(uint id) public{
        delete tasks[id];
        taskCount--;
    }
}