pragma solidity ^0.5.10;

contract Monolith {

    struct User {
        string name;
        string[] fiction;
        uint[] hidden;

        uint bookmark;
    }


    mapping (address => User) public users;
    
    // Self Publish
    // Subscribe?

    // When receiving an new piece of fiction it is delivered in an edittable way
    // you now own it, and can modify and redistribute as you see fit
    // there is however an history of addresses
    // for a variety of systems to play off of

    function publish(address _address, string memory _content) public {
        users[_address].fiction.push(_content);
        users[_address].bookmark = users[_address].fiction.length - 1;
        // emit event so subscribers to the tags and or publisher can know
    }

    function turn(address _address, uint _by) public returns(uint) {
        users[_address].bookmark += _by;

        if (users[_address].bookmark < 0)
        {
            users[_address].bookmark = users[_address].fiction.length - 1;
        }

        if (users[_address].bookmark > users[_address].fiction.length - 1)
        {
            users[_address].bookmark = 0;
        }

        return users[_address].bookmark;
    }

    function read(address _address) public view returns (string memory) {
        return users[_address].fiction[users[_address].bookmark];
    }

    function bookmarkPlace(address _address) public view returns (uint) {
        return users[_address].bookmark;
    }

    constructor() public {

    }
}