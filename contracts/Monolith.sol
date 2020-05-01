pragma solidity ^0.5.0;


contract Monolith {
    uint256 public publishCount = 0;

    struct Fiction {
        uint256 from;
        string meta;
        string content;
    }

    mapping(uint256 => Fiction) public fictions;
    event FictionPublished(uint256 id, string meta); // content?

    constructor() public {
        fictions[0] = Fiction(0, "", "");
        credit[0] = msg.sender;
    }

    function publish(
        uint256 _from,
        string memory _meta,
        string memory _content
    ) public {
        require(_from >= 0 && _from <= publishCount, "invalid credit(from id)");
        publishCount++;
        fictions[publishCount] = Fiction(_from, _meta, _content);
        emit FictionPublished(publishCount, _meta);

        credit[publishCount] = msg.sender;
        // VERY incomplete
        // reward for how much?
        // credit[_from].transfer(1000);
    }

    mapping(uint256 => address payable) credit;
}
