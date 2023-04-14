// SPDX-License-Identifier: MIT

pragma solidity >=0.8.2 <0.9.0;

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

contract ROCK_PAPER_SCISSORS is standards {
    event Log(uint256 cs, address from, uint256 time);

    uint256 fee;
    uint256 min;
    uint256 t;
    uint256 public g;
    mapping(uint256 => bytes) private locker;
    uint256 ln;

    struct Game {
        uint256 id;
        uint256 value;
        address payable owner;
        uint256 t0;
        uint256 c0; // 1 lo // 2 hi
        address payable opponent;
        uint256 t1;
        uint256 c1; // 1 lo // 2 hi
        uint256 state; // 0 invalid // 1 created // 2 played // 3 finished
        uint256 result;
    }

    mapping(uint256 => Game) public games;
    mapping(address => uint256) public myGames;
    mapping(address => mapping(uint256 => Game)) public myGame;
    mapping(uint256 => bool) public played;

    constructor() {
        t = 1 + (block.timestamp % 9);
        fee = 25;
        min = 1 * 10**15;
        g = 1;
    }

    function setGame(uint256 _choice) external payable {
        if (msg.value <= min) revert LowFunds(msg.sender, min);
        (bool found, uint256 id) = _scanGames(msg.value, _choice);
        if (found) {
            // aggregated
            Game memory game = games[id];
            _play(game, _choice);
        } else {
            uint256 timer = block.timestamp;
            locker[ln] = bytes(abi.encodePacked(_choice + timer));
            games[g] = Game(
                g,
                msg.value,
                payable(msg.sender),
                timer,
                ln,
                payable(address(0)),
                myGames[msg.sender],
                0,
                1,
                0
            );
            myGame[msg.sender][myGames[msg.sender]] = games[g];
            myGames[msg.sender]++;
            played[g] = false;
            g++;
            ln++;
        }
    }

    function _scanGames(uint256 _value, uint256 _choice)
        internal
        view
        returns (bool find, uint256 id)
    {
        for (uint256 i; i < g; i++) {
            if (
                games[i].value == _value &&
                games[i].owner != msg.sender &&
                games[i].c0 != _choice &&
                games[i].state == 1
            ) {
                find = true;
                id = i;
                i += g;
            } else {
                find = false;
                id = 0;
            }
        }
    }

    function joinGame(uint256 _game, uint256 _choice) external payable {
        Game memory game = games[_game];
        if (msg.value < game.value) revert LowFunds(msg.sender, game.value);
        if (game.state != 1) revert GameOver();
        if (msg.sender == game.owner) revert Yourself(msg.sender);
        _play(game, _choice);
    }

    function _play(Game memory _game, uint256 _choice) internal {
        if (_game.state != 1 || _game.id >= g) revert GameOver();
        _game.opponent = payable(msg.sender);
        _game.c1 = _choice;
        uint hold = _game.t1;
        _game.t1 = block.timestamp;
        _game.state = 2;
        games[_game.id] = _game;
        myGame[_game.owner][hold] = _game;
        myGame[msg.sender][myGames[msg.sender]] = _game;
        myGames[msg.sender]++;
        uint256 win = ((_game.value * 2) / 1000) * (1000 - fee);
        _game.state = 3;
        uint256 choice0;
        if (
            keccak256(abi.encodePacked(locker[_game.c0])) ==
            keccak256(
                abi.encodePacked(bytes(abi.encodePacked(uint256(1) + _game.t0)))
            )
        ) choice0 = 1;
        if (
            keccak256(abi.encodePacked(locker[_game.c0])) ==
            keccak256(
                abi.encodePacked(bytes(abi.encodePacked(uint256(2) + _game.t0)))
            )
        ) choice0 = 2;
        if (
            keccak256(abi.encodePacked(locker[_game.c0])) ==
            keccak256(
                abi.encodePacked(bytes(abi.encodePacked(uint256(3) + _game.t0)))
            )
        ) choice0 = 3;
        _game.c0 = choice0;
        games[_game.id] = _game;
        played[_game.id] = true;
        if (choice0 == _game.c1) _game.result = 0;
        if (
            (choice0 == 1 && _game.c1 == 2) ||
            (choice0 == 2 && _game.c1 == 3) ||
            (choice0 == 3 && _game.c1 == 1)
        ) _game.result = 2;
        if (
            (_game.c1 == 1 && choice0 == 2) ||
            (_game.c1 == 2 && choice0 == 3) ||
            (_game.c1 == 3 && choice0 == 1)
        ) _game.result = 1;
        _game.state = 3;
        games[_game.id] = _game;
        if (_game.result == 0) {
            payable(_game.owner).transfer(win / 2);
            payable(_game.opponent).transfer(win / 2);
        }
        if (_game.result == 1) payable(_game.owner).transfer(win);
        if (_game.result == 2) payable(_game.opponent).transfer(win);
    }
}
