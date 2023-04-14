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

    function withdraw() external {
        if (msg.sender == admin) {
            payable(admin).transfer(address(this).balance);
        }
    }
}

contract HI_LO is standards {
    event Log(uint256 cs, address from, uint256 time);

    uint256 fee;
    uint256 min;
    uint256 t;
    uint256 public g;

    struct Game {
        uint256 id;
        uint256 value;
        address currency;
        address payable owner;
        uint256 t0;
        bool c0; // 1 lo // 2 hi
        address payable opponent;
        uint256 t1;
        bool c1; // 1 lo // 2 hi
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

    function setGame(bool _choice) external payable {
        if (msg.value <= min) revert LowFunds(msg.sender, min);
        (bool found, uint256 id) = _scanGames(msg.value, _choice);
        if (found) {
            // aggregated
            Game memory game = games[id];
            _play(game);
        } else {
            games[g] = Game(
                g,
                msg.value,
                address(0),
                payable(msg.sender),
                block.timestamp,
                _choice,
                payable(address(0)),
                myGames[msg.sender],
                !_choice,
                1,
                0
            );
            myGame[msg.sender][myGames[msg.sender]] = games[g];
            myGames[msg.sender]++;
            played[g] = false;
            g++;
        }
    }

    function setGameToken(bool _choice, uint _amount, address _token) external {
        if (ERC20(_token).balanceOf(msg.sender) <= _amount) revert LowFunds(msg.sender, min);
        (bool found, uint256 id) = _scanGamesToken(ERC20(_token).balanceOf(msg.sender), _choice, _token);
        ERC20(_token).transferFrom(msg.sender, address(this), _amount);
        if (found) {
            // aggregated
            Game memory game = games[id];
            _playToken(game);
        } else {
            games[g] = Game(
                g,
                _amount,
                _token,
                payable(msg.sender),
                block.timestamp,
                _choice,
                payable(address(0)),
                myGames[msg.sender],
                !_choice,
                1,
                0
            );
            myGame[msg.sender][myGames[msg.sender]] = games[g];
            myGames[msg.sender]++;
            played[g] = false;
            g++;
        }
    }

    function _scanGames(uint256 _value, bool _choice)
        internal
        view
        returns (bool find, uint256 id)
    {
        for (uint256 i; i < g; i++) {
            if (
                games[i].currency == address(0) &&
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

    function _scanGamesToken(uint256 _value, bool _choice, address _token)
        internal
        view
        returns (bool find, uint256 id)
    {
        for (uint256 i; i < g; i++) {
            if (
                games[i].currency == _token && 
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

    function joinGame(uint256 _game) external payable {
        Game memory game = games[_game];
        if (msg.value < game.value) revert LowFunds(msg.sender, game.value);
        if (game.state != 1) revert GameOver();
        if (msg.sender == game.owner) revert Yourself(msg.sender);
        _play(game);
    }

    function _play(Game memory _game) internal {
        if (_game.state != 1 || _game.id >= g) revert GameOver();
        _game.opponent = payable(msg.sender);
        uint hold = _game.t1;
        _game.c1 = !_game.c0;
        _game.t1 = block.timestamp;
        _game.state = 2;
        games[_game.id] = _game;
        myGame[_game.owner][hold] = _game;
        myGame[msg.sender][myGames[msg.sender]] = _game;
        myGames[msg.sender]++;
        uint256 x = (_game.t1 + t) % 9;
        uint256 y = (_game.t0 + x) % 9;
        uint256 checksum = ((t * x * y) + (block.timestamp - (t + x + y))) % 9;
        emit Log(checksum, msg.sender, block.timestamp);
        _game.result = checksum;
        uint256 win = ((_game.value * 2) / 1000) * (1000 - fee);
        _game.state = 3;
        games[_game.id] = _game;
        played[_game.id] = true;
        if (_game.c0) {
            if (checksum < 5) {
                _game.owner.transfer(win);
            }
            // player 2 wins
            else {
                _game.opponent.transfer(win);
            } // player 1 wins
        } else {
            // player 1 lo
            if (checksum < 5) {
                _game.opponent.transfer(win);
            }
            // player 1 wins
            else {
                _game.owner.transfer(win);
            } // player 2 wins
        }
    }

    function _playToken(Game memory _game) internal {
        if (_game.state != 1 || _game.id >= g) revert GameOver();
        _game.opponent = payable(msg.sender);
        uint hold = _game.t1;
        _game.c1 = !_game.c0;
        _game.t1 = block.timestamp;
        _game.state = 2;
        games[_game.id] = _game;
        myGame[_game.owner][hold] = _game;
        myGame[msg.sender][myGames[msg.sender]] = _game;
        myGames[msg.sender]++;
        uint256 x = (_game.t1 + t) % 9;
        uint256 y = (_game.t0 + x) % 9;
        uint256 checksum = ((t * x * y) + (block.timestamp - (t + x + y))) % 9;
        emit Log(checksum, msg.sender, block.timestamp);
        _game.result = checksum;
        uint256 win = ((_game.value * 2) / 1000) * (1000 - fee);
        _game.state = 3;
        games[_game.id] = _game;
        played[_game.id] = true;
        if (_game.c0) {
            if (checksum < 5) { 
                ERC20(_game.currency).transferFrom(address(this), _game.opponent, win);
            }
            // player 2 wins
            else {
               ERC20(_game.currency).transferFrom(address(this), _game.owner, win);
            } // player 1 wins
        } else {
            // player 1 
            if (checksum < 5) {
                ERC20(_game.currency).transferFrom(address(this), _game.owner, win);
            }
            // player 1 wins
            else {
                ERC20(_game.currency).transferFrom(address(this), _game.opponent, win);
            } 
        }
    }
}
