pragma solidity ^0.5.0;

contract Monolith {
    uint256 public publishCount = 0;

    struct Fiction {
        uint256 from;
        string meta;
        string content;
    }

    mapping(uint256 => Fiction) public fictions;
    event FictionPublished(uint256 id, string meta);

    constructor() public {
        fictions[0] = Fiction(0, "", "");
        credit[0] = msg.sender;
        publish(0, "", "for ray ^-^");
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
    }

    mapping(uint256 => address payable) credit;

    function payback(uint256 _to) public payable {
      require(_to >= 0 && _to <= publishCount, "no payable address at that id");
      uint256 receiver = _to;
      uint256 value = msg.value;
      while (receiver > 0)
      {
        uint256 piece = value / 2;
        value -= piece;
        credit[receiver].transfer(piece);
        receiver = fictions[receiver].from;
      }
      credit[receiver].transfer(value);
    }
}
