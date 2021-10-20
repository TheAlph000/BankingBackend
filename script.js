'use strict';

// Data

const account1 = {
  owner: 'Ashutosh',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2021-02-27T17:01:17.194Z',
    '2021-05-14T23:36:17.929Z',
    '2021-05-18T10:51:36.790Z',
  ],
  currency: 'INR',
  locale: 'en-IN', // de-DE
};

const account2 = {
  owner: 'Samarpit',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2021-05-14T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const account3 = {
  owner: 'Anshuman',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 3333,

  movementsDates: [
    '2019-11-05T13:15:33.035Z',
    '2019-11-20T09:48:16.867Z',
    '2020-12-27T06:04:23.907Z',
    '2021-01-14T14:18:46.235Z',
    '2021-05-18T16:33:06.386Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const account4 = {
  owner: 'Saniya',
  movements: [330, 1000, 800, -50, -90],
  interestRate: 1,
  pin: 4444,

  movementsDates: [
    '2020-04-14T14:43:26.374Z',
    '2020-06-27T18:49:59.371Z',
    '2020-07-11T12:01:20.894Z',
    '2021-01-19T14:18:46.235Z',
    '2021-05-17T16:33:06.386Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const account5 = {
  owner: 'Polo',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 5555,

  movementsDates: [
    '2019-11-27T21:31:17.178Z',
    '2019-12-21T07:42:02.383Z',
    '2020-01-18T09:15:04.904Z',
    '2020-04-05T10:17:24.185Z',
    '2020-05-24T14:11:59.604Z',
    '2020-05-23T17:01:17.194Z',
    '2021-02-21T23:36:17.929Z',
    '2021-05-16T10:51:36.790Z',
  ],
  currency: 'USD',
  locale: 'pt-PT', // de-DE
};

const accounts = [account1, account2, account3, account4, account5];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

let now = new Date();
let dateNow = `${now.getDate()}`.padStart(2, 0);
let monthNow = `${now.getMonth()}`.padStart(2, 0);
let yearNow = `${now.getFullYear()}`;
let hourNow = `${now.getHours()}`.padStart(2, 0);
let minuteNow = `${now.getMinutes()}`.padStart(2, 0);

labelWelcome.addEventListener('click', function (e) {
  e.preventDefault();
  updateUI();
});

btnLogin.addEventListener('click', function (event) {
  event.preventDefault();
  loginUser(inputLoginUsername.value, +inputLoginPin.value);
  inputLoginUsername.value = '';
  inputLoginPin.value = '';
});

let user;
//Confirm Login credentials
let confirmLogin = function () {
  user = accounts.find(function (acc) {
    return (
      acc.owner === inputLoginUsername.value && acc.pin === +inputLoginPin.value
    );
  });
};

let updateDateLabel = function () {
  // const dateTimeNowLabel = new Date();
  const formattedDateTimeNowLabel = new Intl.DateTimeFormat(user.locale, {
    hour: 'numeric',
    minute: 'numeric',
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
  }).format(new Date());

  labelDate.textContent = `${formattedDateTimeNowLabel}`;
};
let updateUI = function () {
  displayTransactions(user.movements);
  sorted = false;
  calculateBalance();
  calculateCredit();
  calculateDebit();
  calculateInterest();
  updateDateLabel();
};

let loginUser = function () {
  confirmLogin();
  if (user) {
    labelWelcome.textContent = `Welcome back, ${user?.owner}`;
    console.log(`logged in as ${user.owner}`);
    containerApp.style.opacity = 100;
    updateUI();
    setTimer();
  } else console.log(`Wrong username or pin`);
};

//Transaction front end list
let displayTransactions = function (transactionArr) {
  containerMovements.innerHTML = '';

  //Transaction looping over every movement
  transactionArr.forEach(function (transaction, index) {
    let transactionDate = new Date(user.movementsDates[index]);
    let dateTimeOfTransaction = new Intl.DateTimeFormat(user.locale, {
      day: 'numeric',
      month: 'numeric',
      year: '2-digit',
    }).format(transactionDate);
    let transactionAmountFormatted = new Intl.NumberFormat(user.locale, {
      style: 'currency',
      currency: `${user.currency}`,
    }).format(transaction);
    console.log(user.currency);
    //date format decision
    let daysAgo =
      ((Date.now() - transactionDate.getTime()) / 86400000).toFixed(0) < 7
        ? moment(transactionDate).fromNow()
        : `${dateTimeOfTransaction}`;
    //transaction type
    let transactionType = transaction > 0 ? 'credit' : 'debit';

    let htmltransaction = `<div class="movements__row">
                  <div class="movements__type movements__type--${transactionType}">${transactionType}</div>
                  <div class="movements__date">${daysAgo}</div>
                  <div class="movements__value">${transactionAmountFormatted}</div>
                </div>`;

    containerMovements.insertAdjacentHTML('afterbegin', htmltransaction);
  });
};

//BALANCE
let balance;
let calculateBalance = function () {
  let total = user.movements.reduce(function (acc, curr) {
    return acc + curr;
  });
  let totalFormatted = new Intl.NumberFormat(user.locale, {
    style: 'currency',
    currency: `${user.currency}`,
  }).format(total);
  labelBalance.textContent = `${totalFormatted}`;
  balance = total;
};

//CREDIT

let calculateCredit = function () {
  let totalCred = user.movements
    .filter(function (mov) {
      return mov > 0;
    })
    .reduce(function (acc, curr) {
      return acc + curr;
    }, 0);
  let totalCredFormatted = new Intl.NumberFormat(user.locale, {
    style: 'currency',
    currency: `${user.currency}`,
  }).format(totalCred);
  labelSumIn.textContent = `${totalCredFormatted}`;
};

//debit

let calculateDebit = function () {
  let totalDeb = user.movements
    .filter(function (mov) {
      return mov < 0;
    })
    .reduce(function (acc, curr) {
      return acc + curr;
    }, 0);

  let totalDebFormatted = new Intl.NumberFormat(user.locale, {
    style: 'currency',
    currency: `${user.currency}`,
  }).format(totalDeb);

  labelSumOut.textContent = `${totalDebFormatted}`;
};

//INTEREST
let calculateInterest = function () {
  let totalInterest = user.movements
    .filter(function (mov) {
      return mov > 0;
    })
    .map(function (mov) {
      return mov * 0.062; //interest rate = 6.2%
    })
    .reduce(function (acc, curr) {
      return acc + curr;
    }, 0);

  let totalInterestFormatted = new Intl.NumberFormat(user.locale, {
    style: 'currency',
    currency: `${user.currency}`,
  }).format(totalInterest);
  labelSumInterest.textContent = `${totalInterestFormatted}`;
};

//Transfer Money
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  if (balance > inputTransferAmount.value) {
    transferToUser();
    inputTransferTo.value = '';
    inputTransferAmount.value = '';
    setTimer();
  }
});

let transferToUser = function () {
  console.log('0110');
  let transferToUserAcc = accounts.find(function (acc) {
    return acc.owner === inputTransferTo.value;
  });

  const amount = +inputTransferAmount.value;
  if (transferToUserAcc && amount > 0) {
    //Sending the amount from current user
    user.movements.push(-amount);
    user.movementsDates.push(new Date().toISOString());
    updateUI();

    //Amount being recieved by transferToAcc user
    transferToUserAcc.movements.push(amount);
    transferToUserAcc.movementsDates.push(new Date().toISOString());
  }
};

//CLOSE ACCOUNT
btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  updateUI();
  if (
    inputCloseUsername.value === user.owner &&
    +inputClosePin.value === user.pin
  ) {
    let indexOfAccountToRemove = accounts.findIndex(function (curr) {
      return curr === user;
    });
    accounts.splice(indexOfAccountToRemove, 1);
  }
  inputClosePin.value = '';
  inputCloseUsername.value = '';
  logoutUser();
});

//Request Loan

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  let approval = user.movements.some(function (curr) {
    return inputLoanAmount.value < curr / 10;
  });

  if (approval) {
    const amount = inputLoanAmount.value;
    inputLoanAmount.value = '';
    updateUI();
    setTimeout(function () {
      user.movements.push(+amount);
      user.movementsDates.push(new Date().toISOString());
      updateUI();
    }, 5000);
  } else console.log(`loan not approved`);
  setTimer();
});

//SORT movements
let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  sortTransactions(user.movements, sorted);
  sorted = !sorted;
});

let sortTransactions = function (arr, isSorted = false) {
  let sortedArr = arr.slice();
  sortedArr.sort(function (a, b) {
    return a - b;
  });
  console.log(sortedArr);
  if (!isSorted) {
    console.log('sorting...');
    displayTransactions(sortedArr);
    btnSort.style.color = 'white';
  } else {
    console.log('unsorting...');
    displayTransactions(user.movements);
    btnSort.style.color = '';
  }
};

//LOG OUT TIMER

let timer, timerDurationInSec;
let timerFormat = function () {
  let minute = String(Math.trunc(timerDurationInSec / 60)).padStart(2, 0);
  let seconds = String(timerDurationInSec % 60).padStart(2, 0);
  labelTimer.textContent = `${minute}:${seconds}`;
  if (timerDurationInSec === 0) {
    clearInterval(timer);
    logoutUser();
  }
  timerDurationInSec--;
};

let setTimer = function () {
  timerDurationInSec = 300;
  if (timer) clearInterval(timer);
  timer = setInterval(timerFormat, 1000);
};
//LOGOUT USER

let logoutUser = function () {
  user = '';
  labelWelcome.textContent = 'Log in to get started';
  containerApp.style.opacity = 0;
};
