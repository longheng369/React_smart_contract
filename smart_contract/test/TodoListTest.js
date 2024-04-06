const ToDoList = artifacts.require("./ToDoList.sol");

contract("ToDoList", (accounts) => {
    before(async () => {
        this.toDoList = await ToDoList.deployed();
    });

    it("deploys successfully", async () => {
        const address = await this.toDoList.address;
        assert.notEqual(address, 0x0);
        assert.notEqual(address, "");
        assert.notEqual(address, null);
        assert.notEqual(address, undefined);
    });

    it("lists tasks", async () => {
        const taskCount = await this.toDoList.tasksCount();
        assert.equal(taskCount.toNumber(), 0);
    });

    it("creates tasks", async () => {
        await this.toDoList.createTask("A new task");
        const taskCount = await this.toDoList.tasksCount();
        assert.equal(taskCount.toNumber(), 1); // This should be 1 now after adding the first task
    });

    it("toggles task completion", async () => {
        const result = await this.toDoList.toggleCompleted(1);
        const task = await this.toDoList.tasks(1);
        assert.equal(task.completed, true);
        const event = result.logs[0].args;
        assert.equal(event.id.toNumber(), 1);
        assert.equal(event.completed, true);
    });
});
