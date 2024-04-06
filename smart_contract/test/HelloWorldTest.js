const HelloWorld = artifacts.require("HelloWorld");

contract("HelloWorld", (accounts) => {
    it("should return the initial message", async () => {
        const helloWorldInstance = await HelloWorld.deployed();
        const message = await helloWorldInstance.message.call();
        assert.equal(message, "Hello, Truffle!", "The initial message should be 'Hello, Truffle!'");
    });

    it("should update the message correctly", async () => {
        const helloWorldInstance = await HelloWorld.deployed();
        await helloWorldInstance.updateMessage("New message", { from: accounts[0] });
        const updatedMessage = await helloWorldInstance.message.call();
        assert.equal(updatedMessage, "New message", "The message was not updated correctly");
    });
});
