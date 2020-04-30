pragma solidity ^0.5.0;

contract Monolith {
    uint public publishCount = 0;

    struct Fiction {
        uint from;
        address publisher;
        string meta;
        string content;
    }

    mapping(uint => Fiction) public fictions;
    mapping(address => uint) public tokens;

    event FictionPublished(uint id, string meta);

    constructor() public {
        fictions[0] = Fiction(0, msg.sender, "", "");
        publish(0, msg.sender, "for ray", "<3");
    }

    function publish(uint _from, address _publisher, string memory _meta, string memory _content) public {
        publishCount++;
        fictions[publishCount] = Fiction(_from, _publisher, _meta, _content);
        emit FictionPublished(publishCount, _meta);
        tokens[fictions[_from].publisher]++;
    }
}
