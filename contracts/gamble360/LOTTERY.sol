// SPDX-License-Identifier: MIT

pragma solidity >=0.8.2 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

error LowFunds(address adr, uint256 balance);
error NotAdmin(address adr);
error GameOver();
error Yourself(address adr);
error Check(uint256 num);

contract standards {
    address private admin;
    ERC20[] public tokens;
    uint toks;
    constructor() {
        admin = msg.sender;
    }
    
    function addToken(address _erc20) external {
        if(admin != msg.sender) revert NotAdmin(msg.sender);
        tokens[toks] = ERC20(_erc20);
        toks++;
    }

    function withdraw() external {
        if (msg.sender == admin) {
            payable(admin).transfer(address(this).balance);
        }
    }
}

contract LOTTERY is ERC721, standards {
    event Log(uint256 cs, string txt, address usr);
    uint256 fee;
    uint256 min;
    struct Lottery {
        uint256 id;
        address owner;
        uint256 tickets;
        uint256 max;
        uint256 price;
        uint256 winning;
        uint256 timestamp;
        uint256 sold;
        uint256 status;
    }
    Lottery[] public lotterys;
    uint256 public l;
    uint256 rand;
    uint256 t;
    mapping(uint256 => uint256) public count;
    mapping(uint256 => uint256) public dias;
    mapping(address => uint256) public myTickets;
    mapping(address => mapping(uint256 => Lottery)) public myTicket;
    mapping(uint256 => mapping(uint256 => uint256)) public results;
    mapping(uint256 => mapping(uint256 => mapping(uint256 => uint256))) public claims;

    constructor() ERC721("Gamble360 Lottery Ticket", "gLOTTO") {
        fee = 25;
        min = 1 * 10**15;
        l = 0;
        t = 1;
        _makeLottery(3, 1, 10000000000000000, 1);
    }

    function makeLottery(
        uint256 _tick,
        uint256 _max,
        uint256 _price,
        uint256 _win
    ) external {
        _makeLottery(_tick, _max, _price, _win);
    }

    function _makeLottery(
        uint256 _tick,
        uint256 _max,
        uint256 _price,
        uint256 _win
    ) internal {
        if (_max <= 0 || _max * _win * 2 > _tick) revert GameOver();
        // uint total = _tick * _price;
        // if(total / _tick < min) revert GameOver();
        lotterys.push(
            Lottery(
                l,
                msg.sender,
                _tick,
                _max,
                _price,
                _win,
                block.timestamp,
                0,
                _tick
            )
        );
        l++;
        rand += block.timestamp % _win;
    }

    function _baseURI() internal pure override returns (string memory) {
        return "ipfs://QmS15h8bKG6AEGTd7BbLnSXE4ndJSN48tKzW71HTrXeZ4T";
    }

    // 10000000000000000000
    function buyTicket(uint256 _id, uint256 _amount) external payable {
        Lottery memory lottery;
        lottery = lotterys[_id];
        if (msg.value < lottery.price * _amount)
            revert LowFunds(msg.sender, lottery.price * _amount);
        if (_amount > lottery.status || _amount > lottery.max)
            revert Check(lottery.status);
        for (uint256 i = 1; i < _amount + 1; i++) {
            uint256 tid = (lottery.id * 10**12) + lottery.sold + 1;
            count[t] = tid;
            dias[tid] = t;
            myTicket[msg.sender][myTickets[msg.sender]] = lottery;
            _mint(msg.sender, tid);
            myTickets[msg.sender]++;
            t++;
            lottery.sold++;
        }
        lottery.status = lottery.tickets - lottery.sold;
        lotterys[_id] = lottery;
        rand += block.timestamp % (lottery.tickets - 1);
        if (lottery.sold == lottery.tickets) _playLottery(lottery);
    }

    function rollLottery(uint256 _id) external {
        Lottery memory lottery;
        lottery = lotterys[_id];
        _playLottery(lottery);
    }

    function _playLottery(Lottery memory lottery) internal {
        if (lottery.tickets - lottery.sold != 0) revert Check(lottery.status);
        uint256 win = lottery.tickets * lottery.price;
        emit Log(win, "lottery win", msg.sender);
        uint256 permil = 1000 - fee;
        uint256 winsub = (win / 1000) * permil;
        uint256 winpart = winsub / lottery.winning;
        for (uint256 i = 1; i <= lottery.winning; i++) {
            // 1 000 000 000 000
            // 2 925 000 000 000
            emit Log(winpart, "lottery win part", msg.sender);
            uint256 r = 1 + ((rand) % (lottery.tickets - 1));
            emit Log(r, "lottery result", msg.sender);
            uint256 res = (lottery.id * 10**12) + r;
            emit Log(res, "lottery combo", msg.sender);
            results[lottery.id][i] = res;
            claims[lottery.id][i][res] = winpart;
        }
        rand +=
            ((rand * block.timestamp) * (lottery.winning * rand)) %
            lottery.tickets;
    }

    function claim(uint256 _lid, uint256 _res) external {
        Lottery memory lottery;
        lottery = lotterys[_lid];
        for (uint256 i; i <= lottery.winning; i++) {
            if (results[_lid][i] == _res) {
                emit Log(_res, "id", ownerOf(_res));
                if (msg.sender == ownerOf(_res)) {
                    uint256 win = claims[_lid][i][_res];
                    emit Log(win, "prize", msg.sender);
                    claims[_lid][i][_res] = 0;
                    payable(msg.sender).transfer(win);
                }
            }
        }
    }
}
