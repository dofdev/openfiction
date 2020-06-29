pragma solidity ^0.5.0;

contract Monolith {
    uint256 public publishCount = 0;

    mapping(uint256 => uint256) public credits;
    mapping(uint256 => string) public metas;
    mapping(uint256 => string) public contents;
    event FictionPublished(uint256 id, string meta);

    constructor() public {
        publish(0, "", "");
        publish(0, "genesis", "In the beginning...");
    }

    function publish(
        uint256 _credit,
        string memory _meta,
        string memory _content
    ) public {
        require(_credit >= 0 && _credit <= publishCount, "invalid credit(from x)");
        credits[publishCount] = _credit;
        metas[publishCount] = _meta;
        contents[publishCount] = _content;
        emit FictionPublished(publishCount, _meta);
        authors[publishCount] = msg.sender;
        publishCount++;
    }

    mapping(uint256 => address payable) authors;

    function payback(uint256 _to) public payable {
      require(_to >= 0 && _to < publishCount, "no payable address at that id");
      // require divisible by 2
      uint256 receiver = _to;
      uint256 value = msg.value;
      while (receiver > 0)
      {
        uint256 piece = value / 2;
        value -= piece;
        authors[receiver].transfer(piece);
        receiver = credits[receiver];
      }
      authors[receiver].transfer(value);
    }
}
