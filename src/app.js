//////////////////////////////////////////
//                                      //
//          MAIN CONTRACT               //
//          thedojo.guru                //
//          stereoIII6                  //
//          stereo@iii6.xyz             //
//                                      //
//                                      //
//                                      //
//////////////////////////////////////////

import { ethers } from "ethers";
import Web3 from "web3";
import detectEthereumProvider from "@metamask/detect-provider";
import "../public/app.scss";
import { sha256 } from "crypto-hash";
import UAuth from "@uauth/js";
import { create } from "underscore";
import { stripZeros } from "ethers/lib/utils";
// import { logo, wallet, btn, app, net, about, team, service, MoBtn, admin, imprint, terms, contact, stage } from "./elements";
// import { mob_toggle, toggle, a, showAdmin, doAdmin, openLanding, openWallet, openApp, openNet, openAbout, openService, openTeam, openImprint, openTerms, openContact, goColor } from "./nav";
import { roll, makeId, doCollection, showRarity } from "./rarity";
import { s0x, Friends, Groups, HiLo, RockPaperScissors, Lottery } from "./web3imports";

const logo = document.getElementById("logo");
const wallet = document.getElementById("wallet");
const btn = document.getElementById("connect");
const app = document.getElementById("app");
const net = document.getElementById("net");
const about = document.getElementById("about");
const service = document.getElementById("service");
const team = document.getElementById("team");
const MoBtn = document.getElementById("mobbtn");
const closeMob = document.getElementById("closemob");
const stage = document.getElementById("stage");
const admin = document.getElementById("admin");
const imprint = document.getElementById("imprint");
const terms = document.getElementById("terms");
const contact = document.getElementById("contact");
let hi = document.getElementById("hi");
let lo = document.getElementById("lo");
let r = document.getElementById("r");
let p = document.getElementById("p");
let s = document.getElementById("s");
let one = document.getElementById("one");
let two = document.getElementById("two");
let four = document.getElementById("four");
let eight = document.getElementById("eight");
let ten = document.getElementById("ten");
let twen = document.getElementById("twen");
let fourty = document.getElementById("fourt");
let eighty = document.getElementById("eighty");
let history = document.getElementById("history");
let lotteryForm = document.getElementById("lotteryForm");
let lotteryList = document.getElementById("lotteryList");
let total = document.getElementById("total");
let maxTickets = document.getElementById("maxTickets");
let winners = document.getElementById("winners");
let make = document.getElementById("make");

// globals
let accounts;
let network;
let balance;
let lottoID = [];
let lottoPRICE = [];
let lottoAMOUNT = [];
let lottoBUY = [];
const client = require("ipfs-http-client");
const ipfs = client.create({
  host: "ipfs.infura.io",
  port: "5001",
  protocol: "https",
});
const provider = new ethers.providers.Web3Provider(window.ethereum);
if (!ethereum.isConnected()) {
  console.log("install https://metamask.io extension to browser");
}
let signer = provider.getSigner();
let user;
console.log("// signer // ", signer);

// CONTRACT IMPORT
const s0xData = async () => {
  let a;
  if (Number(network) === 80001) a = 0;
  if (Number(network) === 137) a = 1;

  if (Number(network) === 43113) a = 0;
  if (Number(network) === 137) a = 1;
  const deploymentKey = await Object.keys(s0x.networks)[a];
  console.log(deploymentKey);
  return new ethers.Contract(s0x.networks[deploymentKey].address, s0x.abi, signer);
};
let S0X;
const s0xLoad = async () => {
  S0X = await s0xData();
};

const HiLoData = async () => {
  let a;
  if (Number(network) === 80001) a = 0;
  if (Number(network) === 137) a = 1;
  if (Number(network) === 43113) a = 0;
  if (Number(network) === 137) a = 1;
  const deploymentKey = await Object.keys(HiLo.networks)[a];
  console.log(deploymentKey);
  return new ethers.Contract(HiLo.networks[deploymentKey].address, HiLo.abi, signer);
};
let HILO;
const HiLoLoad = async () => {
  HILO = await HiLoData();
};
const RockPaperScissorsData = async () => {
  let a;
  if (Number(network) === 80001) a = 0;
  if (Number(network) === 137) a = 1;
  if (Number(network) === 43113) a = 0;
  if (Number(network) === 137) a = 1;
  const deploymentKey = await Object.keys(RockPaperScissors.networks)[a];
  console.log(deploymentKey);
  return new ethers.Contract(RockPaperScissors.networks[deploymentKey].address, RockPaperScissors.abi, signer);
};
let RPS;
const RPSLoad = async () => {
  RPS = await RockPaperScissorsData();
};
const LotteryData = async () => {
  let a;
  if (Number(network) === 80001) a = 0;
  if (Number(network) === 137) a = 1;
  if (Number(network) === 43113) a = 0;
  if (Number(network) === 137) a = 1;
  const deploymentKey = await Object.keys(Lottery.networks)[a];
  console.log(deploymentKey);
  return new ethers.Contract(Lottery.networks[deploymentKey].address, Lottery.abi, signer);
};
let LOTTERY;
const LotteryLoad = async () => {
  LOTTERY = await LotteryData();
};
const doHi = () => {
  console.log("hi");
  goHi();
};
const goHi = async () => {
  console.log("hi");
  await HiLoLoad();
  const goHi = await HILO.setGame(true, { value: BigInt(HILOVAL * 1e16) });
};
const doLo = () => {
  console.log("lo");
  goLo();
};
const goLo = async () => {
  console.log("lo");
  await HiLoLoad();
  const goLo = await HILO.setGame(false, { value: BigInt(HILOVAL * 1e16) });
};

const doRock = () => {
  console.log("rock");
  goRock();
};
const goRock = async () => {
  console.log("rock");
  await RPSLoad();
  const goRock = await RPS.setGame(1, { value: BigInt(RPSVAL * 1e16) });
};

const doPaper = () => {
  console.log("paper");
  goPaper();
};
const goPaper = async () => {
  console.log("paper");
  await RPSLoad();
  const goPaper = await RPS.setGame(2, { value: BigInt(RPSVAL * 1e16) });
};

const doScissors = () => {
  console.log("scissors");
  goScissors();
};
const goScissors = async () => {
  console.log("scissors");
  await RPSLoad();
  const goScissors = await RPS.setGame(3, { value: BigInt(RPSVAL * 1e16) });
};

const doLotteryMake = () => {
  console.log("make lottery");
  goLotteryMake();
};
const goLotteryMake = async () => {
  console.log("make lottery");
  await LotteryLoad();
  getElements();
  const goLotteryMake = await LOTTERY.makeLottery(total.value, maxTickets.value, BigInt(LOTTERYVAL * 1e16), winners.value);
};

const doBuyTicket = (e) => {
  console.log("scissors");
  goBuyTicket(e.target.name);
};
const goBuyTicket = async (i) => {
  await LotteryLoad();
  console.log("scissors", lottoID[i], lottoPRICE[i], lottoAMOUNT[i].value);
  let amount = Number(lottoAMOUNT[i].value);
  console.log(i, amount);
  const goLotteryMake = await LOTTERY.buyTicket(Number(lottoID[i]), amount, { value: BigInt(amount * Number(lottoPRICE[i])) })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      console.error(err.message);
    });

  // when ticket bought add to my tickets
};
const doClaimTicket = (e) => {
  console.log("lottery claim");
  goClaimTicket();
};
const goClaimTicket = async () => {
  console.log("lottery claim");
};
const setHistory = () => {
  console.log("history");
  getHistory();
};

const getHistory = async () => {
  console.log("history");
  await LotteryLoad();
  await RPSLoad();
  await HiLoLoad();
  const myTicketCount = await LOTTERY.l().then((res) => {
    return Number(res._hex);
  });
  const myHistory = [];
  let h = 0;
  const myTickets = [];
  for (let i = 0; i < myTicketCount; i++) {
    let grab = await LOTTERY.lotterys(i);
    let results = [];
    for (let y = 1; y <= Number(grab[5]._hex); y++) {
      results[y] = await LOTTERY.results(i, y);
      console.log(results[y]);
    }
    myTickets[i] = {
      id: Number(grab[0]._hex),
      owner: grab[1],
      type: "lottery",
      tickets: Number(grab[2]._hex),
      max: Number(grab[3]._hex),
      price: Number(grab[4]._hex),
      winning: Number(grab[5]._hex),
      timestamp: Number(grab[6]._hex),
      sold: Number(grab[7]._hex),
      status: Number(grab[8]._hex),
      results: results,
    };
    // myHistory[h] = myTickets[i];
    console.log(myTickets[i]);
    // h++;
  }
  const myHiLoCount = await HILO.myGames(user).then((res) => {
    return Number(res._hex);
  });
  const myHiLos = [];
  for (let i = 0; i < myHiLoCount; i++) {
    let grab = await HILO.myGame(user, i);
    myHiLos[i] = {
      id: Number(grab[0]._hex),
      type: "hilo",
      value: Number(grab[1]._hex),
      owner: grab[2],
      t0: Number(grab[3]._hex),
      c0: Number(grab[4]._hex),
      opponent: grab[5],
      t1: Number(grab[6]._hex),
      c1: Number(grab[7]._hex),
      state: Number(grab[8]._hex),
      result: Number(grab[9]._hex),
    };
    myHistory[h] = myHiLos[i];
    console.log(myHiLos[i]);
    h++;
  }

  const myRPSCount = await RPS.myGames(user).then((res) => {
    return Number(res._hex);
  });
  const myRPSs = [];
  for (let i = 0; i < myRPSCount; i++) {
    let grab = await RPS.myGame(user, i);
    myRPSs[i] = {
      id: Number(grab[0]._hex),
      type: "rps",
      value: Number(grab[1]._hex),
      owner: grab[2],
      t0: Number(grab[3]._hex),
      c0: Number(grab[4]._hex),
      opponent: grab[5],
      t1: Number(grab[6]._hex),
      c1: Number(grab[7]._hex),
      state: Number(grab[8]._hex),
      result: Number(grab[9]._hex),
    };
    myHistory[h] = myRPSs[i];
    console.log(myRPSs[i]);
    h++;
  }
  // console.log(myHistory);
  writeHistory(myHistory);
  writeLottery(myTickets);
};

const writeHistory = (his) => {
  console.log(his);
  let len = his.length;
  history.innerHTML = "<h2 style='grid-column:1/-1;'>History </h2>";
  for (let i = 0; i < len; i++) {
    history.innerHTML += `<div class="histo" id="his_${i}">
          <div id="lid"><b>ID : </b><b>${his[i].type}-${his[i].id}/${his[i].t0}</b></div>
          <div id="lprice">Price : ${(his[i].value / 1e18).toFixed(2)}</div>
          <div id="lwin">Created : ${his[i].t0}</div>
          <div id="ltotal">Type : ${his[i].type}</div>
          <div id="lmax">Owner : ${his[i].owner.slice(0, 5)}...${his[i].owner.slice(38, 42)} </div>
          <div id="lwin">Status : ${his[i].state}</div>
          <div id="lwin">${his[i].t1 < 10 ? "Pending" : "Finished @" + his[i].t1}</div>
        </div>`;
    console.log("hide", his[i].result);
    let hist = [];
    if (his[i].state > 1) {
      console.log("hide");
      hist[i] = document.getElementById("his_" + i);
      hist[i].style.display = "none";
    }
  }
};

const writeLottery = (his) => {
  console.log(his);
  let len = his.length;
  lotteryList.innerHTML = "<h2 style='grid-column:1/-1;'>Lotteries </h2>";
  for (let i = 0; i < len; i++) {
    let results = [];
    for (let y = 1; y <= his[i].winning; y++) {
      results[y] = his[i].results[y];
      console.log(results[y]);
    }
    let status = his[i].status;
    console.log(status, "status");
    lotteryList.innerHTML += `<div class="lotto">
          <div id="lottoID_${i}" name="${i}"><b>${his[i].type}::${his[i].id}/${his[i].timestamp}</b></div>
          <div id="lottoPRICE_${i}" name="${his[i].price}">Price : ${(his[i].price / 1e18).toFixed(2)}</div>
          <div id="lottoTotal_${i}">Total Tickets : ${his[i].tickets}</div>
          <div id="lottoMAX_${i}">Max Tickets/User : ${his[i].max}</div>
          <div id="lottoWIN_${i}">Winning Tickets : ${his[i].winning}</div>
          <div id="lottoWIN_${i}">Lottery State : ${his[i].status > 0 ? his[i].status + " Tickets Left" : "Ticket #" + results + " won"}</div>
          ${status != 0 ? '<input id="lottoAMOUNT_' + i + '" type="number" value="1" min="1" max="' + his[i].max + '" style="width:120px;" />' : ""}
          ${status != 0 ? '<button id="lottoBUY_' + i + '}"  name="${i}">Buy Tickets</button>' : '<button id="lottoCLAIM_' + i + '}"  name="${i}">Claim Prize</button>'}
        </div>`;
    // 337 ::
    // if :: lottery result !0 >> if :: user address == ownerOf(constructed -> tokenID) >> only 4 winners :: create claim button
    lottoID[i] = his[i].id;
    lottoPRICE[i] = his[i].price;
  }

  for (let i = 0; i < len; i++) {
    lottoAMOUNT[i] = document.getElementById(`lottoAMOUNT_${i}`);
    lottoBUY[i] = document.getElementById(`lottoBUY_${i}`);
    lottoCLAIM[i] = document.getElementById(`lottoCLAIM_${i}`);
    // console.log(lottoID[i]);
    lottoBUY[i].addEventListener("click", doBuyTicket);
    lottoCLAIM[i].addEventListener("click", doClaimTicket);
  }
};

let a = 0;
const showAdmin = async () => {
  console.log("// start admin");
  let ins;
  let time;
  const leave = () => {
    console.log("// leave called //");
    clearInterval(ins);
    fadeAdmin();
  };
  const stopTime = () => {
    console.log("// stop called //");
    clearTimeout(time);
    clearInterval(ins);
  };
  admin.addEventListener("mouseleave", stopTime);
  time = setTimeout(() => {
    admin.removeEventListener("mouseleave", stopTime);
    admin.addEventListener("mouseleave", leave);
    ins = setInterval(() => {
      if (a < 100) {
        a++;
        console.log("// a val // ", a);
        admin.style.opacity = a / 100;
      } else stopTime();
    }, 10);
  }, 5000);

  admin.removeEventListener("click", showAdmin);
  admin.addEventListener("click", fadeAdmin);
};
const fadeAdmin = () => {
  console.log("// stop admin");
  const outs = setInterval(() => {
    if (a > 0) {
      a--;
      console.log("// stop // ", a);
      admin.style.opacity = a / 100;
    } else {
      clearInterval(outs);
      doAdmin();
    }
  }, 10);
  admin.removeEventListener("click", fadeAdmin);
  admin.addEventListener("click", showAdmin);
};
let mob_toggle = true;
const toggle = () => {
  mob_toggle = !mob_toggle;
  if (mob_toggle == false) {
    MoBtn.style.transform = "rotate(0deg)";
  } else {
    MoBtn.style.transform = "rotate(90deg)";
  }
  console.log(mob_toggle);
};
const doAdmin = () => {
  console.log("// admin //");
  MoBtn.style.transform = "rotate(90deg)";
  stage.innerHTML = document.getElementById("adminProfileTemp").innerHTML;
  const init = document.getElementById("init");
  const eco = document.getElementById("eco");
  const irie = document.getElementById("irie");
  const modern = document.getElementById("modern");
  init.addEventListener("click", goColor);
  irie.addEventListener("click", goColor);
  eco.addEventListener("click", goColor);
  modern.addEventListener("click", goColor);
};
const openLanding = () => {
  MoBtn.style.transform = "rotate(90deg)";
  stage.innerHTML = document.getElementById("landingTemp").innerHTML;
  console.log(mob_toggle);
};
const openWallet = () => {
  toggle();
  stage.innerHTML = document.getElementById("walletTemp").innerHTML;
};
const openApp = () => {
  toggle();
  stage.innerHTML = document.getElementById("appTemp").innerHTML;
};
const openNet = () => {
  toggle();
  stage.innerHTML = document.getElementById("netTemp").innerHTML;
};
let HILOVAL = 0;
const getElements = () => {
  hi = document.getElementById("hi");
  lo = document.getElementById("lo");
  r = document.getElementById("r");
  p = document.getElementById("p");
  s = document.getElementById("s");
  total = document.getElementById("total");
  maxTickets = document.getElementById("maxTickets");
  winners = document.getElementById("winners");
  make = document.getElementById("make");
  one = document.getElementById("one");
  two = document.getElementById("two");
  four = document.getElementById("four");
  eight = document.getElementById("eight");
  ten = document.getElementById("ten");
  twen = document.getElementById("twen");
  fourty = document.getElementById("fourt");
  eighty = document.getElementById("eighty");
  history = document.getElementById("history");
  lotteryList = document.getElementById("lotteryList");
  setHistory();
};

const openAbout = () => {
  toggle();
  stage.innerHTML = document.getElementById("aboutTemp").innerHTML;
  console.log(hi, lo);
  getElements();
  hi.addEventListener("click", doHi);
  lo.addEventListener("click", doLo);
  one.addEventListener("click", setVal);
  two.addEventListener("click", setVal);
  four.addEventListener("click", setVal);
  eight.addEventListener("click", setVal);
  ten.addEventListener("click", setVal);
  twen.addEventListener("click", setVal);
  fourty.addEventListener("click", setVal);
  eighty.addEventListener("click", setVal);
};
let RPSVAL = 0;
const openService = () => {
  toggle();
  stage.innerHTML = document.getElementById("serviceTemp").innerHTML;
  getElements();
  r.addEventListener("click", doRock);
  p.addEventListener("click", doPaper);
  s.addEventListener("click", doScissors);
  one.addEventListener("click", setVal);
  two.addEventListener("click", setVal);
  four.addEventListener("click", setVal);
  eight.addEventListener("click", setVal);
  ten.addEventListener("click", setVal);
  twen.addEventListener("click", setVal);
  fourty.addEventListener("click", setVal);
  eighty.addEventListener("click", setVal);
};
let LOTTERYVAL = 0;
const openTeam = () => {
  toggle();
  stage.innerHTML = document.getElementById("teamTemp").innerHTML;
  getElements();
  // setHistory();
  make.addEventListener("click", doLotteryMake);
  one.addEventListener("click", setVal);
  two.addEventListener("click", setVal);
  four.addEventListener("click", setVal);
  eight.addEventListener("click", setVal);
  ten.addEventListener("click", setVal);
  twen.addEventListener("click", setVal);
  fourty.addEventListener("click", setVal);
  eighty.addEventListener("click", setVal);
};
const setVal = (e) => {
  if (e.target.parentElement.id == "one") {
    RPSVAL = 1;
    HILOVAL = 1;
    LOTTERYVAL = 1;
  }
  if (e.target.parentElement.id == "two") {
    RPSVAL = 2;
    HILOVAL = 2;
    LOTTERYVAL = 2;
  }
  if (e.target.parentElement.id == "four") {
    RPSVAL = 4;
    HILOVAL = 4;
    LOTTERYVAL = 4;
  }
  if (e.target.parentElement.id == "eight") {
    RPSVAL = 8;
    HILOVAL = 8;
    LOTTERYVAL = 8;
  }
  if (e.target.parentElement.id == "ten") {
    RPSVAL = 10;
    HILOVAL = 10;
    LOTTERYVAL = 10;
  }
  if (e.target.parentElement.id == "twen") {
    RPSVAL = 20;
    HILOVAL = 20;
    LOTTERYVAL = 20;
  }
  if (e.target.parentElement.id == "fourt") {
    RPSVAL = 40;
    HILOVAL = 40;
    LOTTERYVAL = 40;
  }
  if (e.target.parentElement.id == "eighty") {
    RPSVAL = 80;
    HILOVAL = 80;
    LOTTERYVAL = 80;
  }
  console.log(e.target.parentElement.id, HILOVAL);
  chipGlow();
};
const chipGlow = () => {
  getElements();
  one.style.background = (HILOVAL || RPSVAL || LOTTERYVAL) == 1 ? "orange" : "white";
  two.style.background = (HILOVAL || RPSVAL || LOTTERYVAL) == 2 ? "orange" : "white";
  four.style.background = (HILOVAL || RPSVAL || LOTTERYVAL) == 4 ? "orange" : "white";
  eight.style.background = (HILOVAL || RPSVAL || LOTTERYVAL) == 8 ? "orange" : "white";
  ten.style.background = (HILOVAL || RPSVAL || LOTTERYVAL) == 10 ? "orange" : "white";
  twen.style.background = (HILOVAL || RPSVAL || LOTTERYVAL) == 20 ? "orange" : "white";
  fourty.style.background = (HILOVAL || RPSVAL || LOTTERYVAL) == 40 ? "orange" : "white";
  eighty.style.background = (HILOVAL || RPSVAL || LOTTERYVAL) == 80 ? "orange" : "white";
};
const openImprint = () => {
  toggle();
  stage.innerHTML = document.getElementById("imprintTemp").innerHTML;
};
const openTerms = () => {
  toggle();
  stage.innerHTML = document.getElementById("termsTemp").innerHTML;
};
const openContact = () => {
  toggle();
  stage.innerHTML = document.getElementById("contactTemp").innerHTML;
};
const goColor = (e) => {
  console.log("// go color // ", e.target.id);
  document.body.id = e.target.value + "go";
};

// const url = "https://gateway.pinata.cloud/ipfs/QmamRUaez9fyXpeuTuiKCNvrKSsLxid4hzyKKkJXSi67LL/";

admin.style.opacity = 0;

admin.addEventListener("click", showAdmin);
MoBtn.addEventListener("click", toggle);
wallet.addEventListener("click", openWallet);
app.addEventListener("click", openApp);
net.addEventListener("click", openNet);
about.addEventListener("click", openAbout);
service.addEventListener("click", openService);
team.addEventListener("click", openTeam);

contact.addEventListener("click", openContact);
terms.addEventListener("click", openTerms);
imprint.addEventListener("click", openImprint);

logo.addEventListener("click", openLanding);

// User Login System
const onClickConnect = async () => {
  try {
    btn.innerHTML = "SIGNUP";
    // set eventlistener for profile button
    // get wallet address and account data of client and store in main state accounts
    accounts = await ethereum.request({ method: "eth_requestAccounts" });
    user = accounts[0];
    // get network data
    network = await ethereum.request({ method: "net_version" });
    balance = await provider.getBalance(user);
    wallet.innerHTML = (balance / 1e18).toFixed(2);
    // mwallet.innerHTML = (balance / 1e18).toFixed(2);
    if (Number(network) === 137 || Number(network) === 80001) {
      net.innerHTML = "<img src='https://cdn.iconscout.com/icon/free/png-256/polygon-token-4086724-3379854.png' id='micro' />";
      // mnet.innerHTML = "<img src='https://cdn.iconscout.com/icon/free/png-256/polygon-token-4086724-3379854.png' id='micro' /> POLYGON";
    } else if (Number(network) === 9001 || Number(network) === 9000) {
      net.innerHTML = "<img src='https://assets.coingecko.com/coins/images/24023/large/evmos.png' id='micro' />";
      // mnet.innerHTML = "<img src='https://assets.coingecko.com/coins/images/24023/large/evmos.png' id='micro' /> EVMOS";
    } else if (Number(network) === 1 || Number(network) === 4) {
      net.innerHTML = "<img src='https://cdn.worldvectorlogo.com/logos/ethereum-eth.svg' id='micro' />";
      // mnet.innerHTML = "<img src='https://cdn.worldvectorlogo.com/logos/ethereum-eth.svg' id='micro' /> ETH";
    } else if (Number(network) === 43114 || Number(network) === 43113) {
      net.innerHTML = "<img src='https://cdn.worldvectorlogo.com/logos/ethereum-eth.svg' id='micro' />";
      // mnet.innerHTML = "<img src='https://cdn.worldvectorlogo.com/logos/ethereum-eth.svg' id='micro' /> ETH";
    } else {
      net.innerHTML = "SWITCH";
      // mnet.innerHTML = "SWITCH";
    }
    await s0xLoad();
    await HiLoLoad();
    await RPSLoad();
    await LotteryLoad();

    let uData = await checkUser();
    console.log("// Check User // ", uData);
    let role = uData;
    if (role === 0) {
      goCatch();
      goSignUp();
    }
    // else if user is known
    else {
      if (role === 99) {
        goAdmin();
      } else {
        if (role === 1) {
          goSignUp();
        }
        // Normal User Accounts role 2 - 12
        // 0 catch user
        // 1 new user
        // 2 affily8
        // 3
        if (role === 2 || role === 3 || role === 5 || role === 7 || role === 9 || role === 12) {
          goProfile();
        } else if (role <= 12 || role === 0) {
          // user has blocked or invalid //
          goError();
        }
      }
    }
  } catch (error) {
    console.error("connect error", error);
    btn.innerText = "LOG";
  }
  toggle();
};

const checkUser = async () => {
  // Is User
  console.log(S0X, user);
  const isUser = await S0X.isUser(user);
  if (isUser === true) {
    const role = await S0X.roles(user)
      .then((res) => {
        console.log("// roles response : ", Number(res._hex));
        // action

        return Number(res._hex);
      })
      .catch((err) => {
        console.error(err);
        return err;
      });
    return isUser, role;
  } else return isUser, 0;
};
const goSignUp = () => {
  // open modal
  console.log("// sign up //  : ");
  stage.innerHTML = document.getElementById("userFormTemp").innerHTML;
  const avtUp = document.getElementById("upBox");
  const nftUp = document.getElementById("nftBox");
  const socioUp = document.getElementById("socioBox");
  const pfpUp = document.getElementById("pfpBox");
  const picUp = document.getElementById("picBox");
  const avtBox = document.getElementById("avtBox");
  const avtType = document.getElementById("avtTypeBox");
  const submit = document.getElementById("submit_create");
  avtType.style.margin = "1em 0 1em 0";
  avtUp.style.display = "none";
  nftUp.style.display = "none";
  pfpUp.style.display = "none";
  picUp.style.display = "none";
  const btnUp = document.getElementById("btnUp");
  const btnNFT = document.getElementById("btnNFT");
  const btnSocio = document.getElementById("btnSocio");
  const btnPic = document.getElementById("btnPic");
  btnUp.addEventListener("click", onAvtTypeChange);
  btnNFT.addEventListener("click", onAvtTypeChange);
  btnSocio.addEventListener("click", onAvtTypeChange);
  btnPic.addEventListener("click", onAvtTypeChange);
  submit.addEventListener("click", onSubmitSignup);
  const uName = document.getElementById("userName");
  const uEmail = document.getElementById("userEmail");
  const uWWW = document.getElementById("userWWW");
  const uCountry = document.getElementById("userCountry");
  const uStatus = document.getElementById("userStatus");
  uName.addEventListener("change", checkInput);
  uEmail.addEventListener("change", checkInput);
  uWWW.addEventListener("change", checkInput);
  uStatus.addEventListener("change", checkInput);
  uName.addEventListener("keyup", checkInput);
  uEmail.addEventListener("keyup", checkInput);
  uWWW.addEventListener("keyup", checkInput);
  uStatus.addEventListener("keyup", checkInput);
  const uTwitter = document.getElementById("userTwitter");
  const uTel = document.getElementById("userTel");
  const uGithub = document.getElementById("userGithub");
  const uInsta = document.getElementById("userInsta");
  const uMedium = document.getElementById("userMedium");
  const uLinked = document.getElementById("userLinked");
  uTwitter.addEventListener("change", checkInput);
  uTel.addEventListener("change", checkInput);
  uGithub.addEventListener("change", checkInput);
  uInsta.addEventListener("change", checkInput);
  uMedium.addEventListener("change", checkInput);
  uLinked.addEventListener("change", checkInput);
  uTwitter.addEventListener("keyup", checkInput);
  uTel.addEventListener("keyup", checkInput);
  uGithub.addEventListener("keyup", checkInput);
  uInsta.addEventListener("keyup", checkInput);
  uMedium.addEventListener("keyup", checkInput);
  uLinked.addEventListener("keyup", checkInput);
  const init = document.getElementById("init");
  const eco = document.getElementById("eco");
  const irie = document.getElementById("irie");
  const modern = document.getElementById("modern");
  init.addEventListener("click", goColor);
  irie.addEventListener("click", goColor);
  eco.addEventListener("click", goColor);
  modern.addEventListener("click", goColor);
};
const onAvtTypeChange = (e) => {
  const avtUp = document.getElementById("upBox");
  const nftUp = document.getElementById("nftBox");
  const socioUp = document.getElementById("socioBox");
  const pfpUp = document.getElementById("pfpBox");
  const picUp = document.getElementById("picBox");
  console.log(e.target.value);
  avtUp.style.display = "none";
  nftUp.style.display = "none";
  pfpUp.style.display = "none";
  picUp.style.display = "none";
  if (e.target.value === "upload") {
    avtUp.style.display = "block";
  }
  if (e.target.value === "nft") {
    nftUp.style.display = "block";
    const uContract = document.getElementById("contract");
    const uTokId = document.getElementById("tokid");
    uContract.addEventListener("change", checkInput);
    uTokId.addEventListener("change", checkInput);
    uContract.addEventListener("keyup", checkInput);
    uTokId.addEventListener("keyup", checkInput);
  }
  if (e.target.value === "social") {
    pfpUp.style.display = "block";

    let run = 0;
    console.log("social // ", document.getElementById("userTel").value.length);
    if (document.getElementById("userTwitter").value.length < 4) {
      document.getElementById("twtPfp").style.display = "none";
      console.log("no twitter");
      run++;
    } else document.getElementById("twtPfp").style.display = "block";
    if (document.getElementById("userTel").value.length < 4) {
      document.getElementById("telPfp").style.display = "none";
      console.log("no tme");
      run++;
    } else document.getElementById("telPfp").style.display = "block";
    if (document.getElementById("userGithub").value.length < 4) {
      document.getElementById("gitPfp").style.display = "none";
      console.log("no github");
      run++;
    } else document.getElementById("gitPfp").style.display = "block";
    if (document.getElementById("userInsta").value.length < 4) {
      document.getElementById("insPfp").style.display = "none";
      console.log("no insta");
      run++;
    } else document.getElementById("insPfp").style.display = "block";
    if (document.getElementById("userLinked").value.length < 4) {
      document.getElementById("lnkPfp").style.display = "none";
      console.log("no linked");
      run++;
    } else document.getElementById("lnkPfp").style.display = "block";
    if (document.getElementById("userMedium").value.length < 4) {
      document.getElementById("mdmPfp").style.display = "none";
      console.log("no medium");
      run++;
    } else document.getElementById("mdmPfp").style.display = "block";
  }
  if (e.target.value === "photo") {
    picUp.style.display = "block";
  }
};
const checkInput = (e) => {
  e.preventDefault();
  console.log("// check //");
  if (e.target.id == "userName") {
    if (e.target.value.length) {
      let store = "";
      for (let j = 0; j < e.target.value.length; j++) {
        let chr = e.target.value.charCodeAt(j);
        if ((chr >= 65 && chr <= 90) || (chr >= 97 && chr <= 122) || (chr >= 48 && chr <= 57) || chr === 45 || chr === 95) {
          console.log("ok");
          store += e.target.value[j];
        } else {
          console.log("del");
        }
      }
      e.target.value = store;
    }
  }
  if (e.target.id == "userEmail") {
    if (e.target.value.length) {
      let store = "";
      for (let j = 0; j < e.target.value.length; j++) {
        let chr = e.target.value.charCodeAt(j);
        if ((chr >= 65 && chr <= 90) || (chr >= 97 && chr <= 122) || (chr >= 48 && chr <= 57) || chr === 64 || chr === 45 || chr === 95 || chr === 46) {
          console.log("ok");
          store += e.target.value[j];
        } else {
          console.log("del");
        }
      }
      e.target.value = store;
    }
  }
  if (e.target.id == "userWWW") {
    if (e.target.value.length) {
      let store = "";
      for (let j = 0; j < e.target.value.length; j++) {
        let chr = e.target.value.charCodeAt(j);
        if ((chr >= 65 && chr <= 90) || (chr >= 97 && chr <= 122) || (chr >= 48 && chr <= 57) || chr === 45 || chr === 95 || chr === 46 || chr === 47 || chr === 58) {
          console.log("ok");
          store += e.target.value[j];
        } else {
          console.log("del");
        }
      }
      e.target.value = store;
    }
  }
  if (e.target.id == "userStatus") {
    if (e.target.value.length) {
      let store = "";
      for (let j = 0; j < e.target.value.length; j++) {
        let chr = e.target.value.charCodeAt(j);
        if ((chr >= 65 && chr <= 90) || (chr >= 97 && chr <= 122) || (chr >= 48 && chr <= 57) || chr === 45 || chr === 46 || chr === 32) {
          console.log("ok");
          store += e.target.value[j];
          e.target.style.border = "1px solid mediumseagreen";
        } else {
          console.log("del");
          e.target.style.border = "1px solid tomato";
        }
      }
      e.target.value = store;
    }
  }
  if (e.target.id == "userTwitter" || e.target.id == "userGithub" || e.target.id == "userTel" || e.target.id == "userInsta" || e.target.id == "userMedium" || e.target.id == "userLinked") {
    if (e.target.value.length) {
      let store = "";
      for (let j = 0; j < e.target.value.length; j++) {
        let chr = e.target.value.charCodeAt(j);
        if ((chr >= 65 && chr <= 90) || (chr >= 97 && chr <= 122) || (chr >= 48 && chr <= 57) || chr === 45 || chr === 95 || chr === 64) {
          console.log("ok");
          store += e.target.value[j];
        } else {
          console.log("del");
        }
      }
      e.target.value = store;
    }
  }
  if (e.target.id == "contract") {
    if (e.target.value.length) {
      let store = "";
      for (let j = 0; j < e.target.value.length; j++) {
        let chr = e.target.value.charCodeAt(j);
        if ((chr >= 48 && chr <= 57) || (chr >= 97 && chr <= 102) || (chr >= 65 && chr <= 70) || chr === 120) {
          console.log("ok");
          store += e.target.value[j];
        } else {
          console.log("del");
        }
      }
      e.target.value = store;
    }
  }
  if (e.target.id == "tokid") {
    if (e.target.value.length) {
      let store = "";
      for (let j = 0; j < e.target.value.length; j++) {
        let chr = e.target.value.charCodeAt(j);
        if (chr >= 48 && chr <= 57) {
          console.log("ok");
          store += e.target.value[j];
        } else {
          console.log("del");
        }
      }
      e.target.value = store;
    }
  }
};
const checkForm = () => {
  const uName = document.getElementById("userName");
  const uEmail = document.getElementById("userEmail");
  const uWWW = document.getElementById("userWWW");
  const uCountry = document.getElementById("userCountry");
  const uStatus = document.getElementById("userStatus");
  const uTwitter = document.getElementById("userTwitter");
  const uTel = document.getElementById("userTel");
  const uGithub = document.getElementById("userGithub");
  const uInsta = document.getElementById("userInsta");
  const uMedium = document.getElementById("userMedium");
  const uLinked = document.getElementById("userLinked");
  const uAvtUrl = document.getElementById("avatarImage");
  const submit = document.getElementById("submit_create");
  let goSub = false;
  if (uName.value.length > 4 && uEmail.value.length > 10 && uCountry.value !== "default" && uStatus.value.length > 4) {
    console.log(uStatus.value, uStatus.value.length, "check 1");
    if (uName.value.length < 22 && uEmail.value.length < 44 && uWWW.value.length < 22 && uStatus.value.length < 257) {
      console.log(uStatus.value, "check 2");
      if ((uTwitter.value.length > 4 && uTwitter.value.length < 22) || (uTel.value.length > 4 && uTel.value.length < 22) || (uGithub.value.length > 4 && uGithub.value.length < 22) || (uInsta.value.length > 4 && uInsta.value.length < 22) || (uMedium.value.length > 4 && uMedium.value.length < 22) || (uLinked.value.length > 4 && uLinked.value.length < 22)) {
        console.log(uTwitter.value, uTel.value, "go");
        goSub = true;
      } else {
        // no social selected at leat one social connection needed
        console.log("no social");
        goSub = false;
        // submit.disabled = true;
      }
    } else {
      // personal form fields input too long
      console.log("no too long");
      goSub = false;
      // submit.disabled = true;
    }
  } else {
    // personal form fields not filled out
    console.log("no input", uName.value, uEmail.value);
    goSub = false;
    // submit.disabled = true;
  }
  return goSub;
};
const goCreateUser = async (e) => {
  console.log("// go create // ");
};
const onReadUserInfo = async () => {
  const userDIAS = await S0X.showUser(user);
  console.log(userDIAS);
  return JSON.parse(userDIAS);
};
const onSubmitSignup = async (e) => {
  e.preventDefault();
  const submit = document.getElementById("submit_create");

  let goSubNow = checkForm();
  console.log("// submit signup //", goSubNow);

  if (goSubNow) {
    submit.innerHTML = "<div id='loader'><div id='square'></div></div>In Progress";
    const loader = document.getElementById("loader");
    const uName = document.getElementById("userName");
    const uEmail = document.getElementById("userEmail");
    const uWWW = document.getElementById("userWWW");
    const uCountry = document.getElementById("userCountry");
    const uStatus = document.getElementById("userStatus");
    const uTwitter = document.getElementById("userTwitter");
    const uTel = document.getElementById("userTel");
    const uGithub = document.getElementById("userGithub");
    const uInsta = document.getElementById("userInsta");
    const uMedium = document.getElementById("userMedium");
    const uLinked = document.getElementById("userLinked");
    const uAvt = document.getElementById("avatarImage");

    loader.style.display = "block";
    let diasFTCH = await fetch("./json/dojo_dias_base.json")
      .then((response) => response.json())
      .then((json) => {
        console.log(json);
        return json;
      })
      .catch((err) => {
        console.log(err.message);
      });

    diasFTCH.profileObject.diasId = 0;
    diasFTCH.profileObject.traits.uName = uName.value;
    diasFTCH.profileObject.traits.uAvt = uAvt.src;
    diasFTCH.profileObject.traits.uEmail = uEmail.value;
    diasFTCH.profileObject.traits.uWWW = uWWW.value;
    diasFTCH.profileObject.traits.uCountry = uCountry.value;
    diasFTCH.profileObject.traits.uStatus = uStatus.value;
    diasFTCH.profileObject.traits.uCountry = uCountry.value;
    diasFTCH.profileObject.traits.uSocial.twitter = uTwitter.value;
    diasFTCH.profileObject.traits.uSocial.tele = uTel.value;
    diasFTCH.profileObject.traits.uSocial.insta = uInsta.value;
    diasFTCH.profileObject.traits.uSocial.github = uGithub.value;
    diasFTCH.profileObject.traits.uSocial.linked = uLinked.value;
    diasFTCH.profileObject.traits.uSocial.medium = uMedium.value;
    console.log(diasFTCH);
    let name = uName.value;
    const id = await S0X.isUser(user);
    // rotate();

    const makeUser = await S0X.createUserAccount(JSON.stringify(diasFTCH), user, name)
      .then((res) => {
        console.log(res);
        return res;
      })
      .catch((err) => {
        console.error(err);
      });
    makeUser.wait().then((res) => {
      console.log(res);
      goProfile();
      return res;
    });
  } else {
    giveHints();
  }
};
const giveHints = () => {
  console.log("// hints //");
  const uName = document.getElementById("userName");
  const uEmail = document.getElementById("userEmail");
  const uWWW = document.getElementById("userWWW");
  const uCountry = document.getElementById("userCountry");
  const uStatus = document.getElementById("userStatus");
  const uTwitter = document.getElementById("userTwitter");
  const uTel = document.getElementById("userTel");
  const uGithub = document.getElementById("userGithub");
  const uInsta = document.getElementById("userInsta");
  const uMedium = document.getElementById("userMedium");
  const uLinked = document.getElementById("userLinked");
  if (uName.value.length <= 4 || uName.value.length >= 22) uName.style.border = "1px solid tomato";
  if (uEmail.value.length <= 10 || uEmail.value.length >= 22) uEmail.style.border = "1px solid tomato";
  if (uWWW.value.length >= 44) uWWW.style.border = "1px solid tomato";
  if (uCountry.value === "default") uCountry.style.border = "1px solid tomato";
  if (uStatus.value.length <= 12 || uStatus.value.length >= 22) uStatus.style.border = "1px solid tomato";
  if (uTwitter.value.length <= 4 || uTwitter.value.length >= 22) uTwitter.style.border = "1px solid tomato";
  if (uTel.value.length <= 4 || uTel.value.length >= 22) uTel.style.border = "1px solid tomato";
  if (uGithub.value.length <= 4 || uGithub.value.length >= 22) uGithub.style.border = "1px solid tomato";
  if (uInsta.value.length <= 4 || uInsta.value.length >= 22) uInsta.style.border = "1px solid tomato";
  if (uMedium.value.length <= 4 || uMedium.value.length >= 22) uMedium.style.border = "1px solid tomato";
  if (uLinked.value.length <= 4 || uLinked.value.length >= 22) uLinked.style.border = "1px solid tomato";
};
const goEditUser = () => {};
const goDelUser = () => {};
const goProfile = async () => {
  const userOBJ = await onReadUserInfo();
  console.log(userOBJ);
  btn.innerHTML = "<img id='micro' src='" + userOBJ.profileObject.traits.uAvt + "'/>";
  // mbtn.innerHTML = "<img id='micro' src='" + userOBJ.profileObject.traits.uAvt + "'/>" + userOBJ.profileObject.traits.uName;
  stage.innerHTML = document.getElementById("userProfileTemp").innerHTML;
  const uName = document.getElementById("userName");
  const uEmail = document.getElementById("userEmail");
  const uWWW = document.getElementById("userWWW");
  const uCountry = document.getElementById("userCountry");
  const uStatus = document.getElementById("userStatus");
  const uTwitter = document.getElementById("userTwitter");
  const uTel = document.getElementById("userTel");
  const uGithub = document.getElementById("userGithub");
  const uInsta = document.getElementById("userInsta");
  const uMedium = document.getElementById("userMedium");
  const uLinked = document.getElementById("userLinked");
  const uAvt = document.getElementById("avatarImage");
  uName.value = userOBJ.profileObject.traits.uName;
  uEmail.value = userOBJ.profileObject.traits.uEmail;
  uWWW.value = userOBJ.profileObject.traits.uWWW;
  uCountry.value = userOBJ.profileObject.traits.uCountry;
  uStatus.value = userOBJ.profileObject.traits.uStatus;
  uTwitter.value = userOBJ.profileObject.traits.uSocial.twitter;
  uTel.value = userOBJ.profileObject.traits.uSocial.tele;
  uInsta.value = userOBJ.profileObject.traits.uSocial.insta;
  uGithub.value = userOBJ.profileObject.traits.uSocial.github;
  uLinked.value = userOBJ.profileObject.traits.uSocial.linked;
  uMedium.value = userOBJ.profileObject.traits.uSocial.medium;
  uAvt.src = userOBJ.profileObject.traits.uAvt;
  const avtUp = document.getElementById("upBox");
  const nftUp = document.getElementById("nftBox");
  const socioUp = document.getElementById("socioBox");
  const pfpUp = document.getElementById("pfpBox");
  const picUp = document.getElementById("picBox");
  const avtBox = document.getElementById("avtBox");
  const avtType = document.getElementById("avtTypeBox");
  const submit = document.getElementById("submit_edit");
  avtType.style.margin = "1em 0 1em 0";
  avtUp.style.display = "none";
  nftUp.style.display = "none";
  pfpUp.style.display = "none";
  picUp.style.display = "none";
  btnUp.addEventListener("click", onAvtTypeChange);
  btnNFT.addEventListener("click", onAvtTypeChange);
  btnSocio.addEventListener("click", onAvtTypeChange);
  btnPic.addEventListener("click", onAvtTypeChange);
  const init = document.getElementById("init");
  const eco = document.getElementById("eco");
  const irie = document.getElementById("irie");
  const modern = document.getElementById("modern");
  init.addEventListener("click", goColor);
  irie.addEventListener("click", goColor);
  eco.addEventListener("click", goColor);
  modern.addEventListener("click", goColor);
};
const goAffily = () => {};
const goPromote = () => {};
const goError = () => {};
const goAdmin = async () => {
  console.log("// admin // ");
  const userOBJ = await onReadUserInfo();
  btn.innerHTML = "@" + userOBJ.name;
  // mbtn.innerHTML = "@" + userOBJ.name;

  doAdmin();
};
const goCatch = () => {};
const checkAdmin = () => {};

const web3init = async () => {
  const isMetaMaskInstalled = () => {
    //Have to check the ethereum binding on the window object to see if it's installed
    const { ethereum } = window;
    return Boolean(ethereum && ethereum.isMetaMask);
  };
  const clickInstall = (e) => {
    e.preventDefault();

    alert("You are being redirected to the official download of Metamask.io ... Please Follow their installation instructions.");
    window.open("https://metamask.io");
  };
  const MetaMaskClientCheck = () => {
    console.log(isMetaMaskInstalled());
    //Now we check to see if MetaMask is installed
    if (!isMetaMaskInstalled()) {
      //If it isn't installed we ask the user to click to install it
      btn.innerText = "install metamask!";
      btn.addEventListener("click", clickInstall);
      // mbtn.innerText = "install metamask!";
      // mbtn.addEventListener("click", clickInstall);
    } else {
      //If it is installed we change our button text
      btn.innerText = "LOG";
      btn.addEventListener("click", onClickConnect);
      // mbtn.innerText = "LOG";
      // mbtn.addEventListener("click", onClickConnect);
    }
  };
  MetaMaskClientCheck();
};
// IMPRTANT INITIAL FUNCTION CALL
web3init();
// IMPORTANT FUNCTION WEB3INIT DO NOT EDIT END
