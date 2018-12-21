# Bank

A simple banking API server.

## What to do?
Follow these steps to set up the server

### Prerequisites
* [NodeJS](https://nodejs.org/)

### Installing
First clone this repository somewhere nice. Then download and install all dependencies by going to the App directory and running
```
npm install package.json
```

### Starting the Bank
To start the bank in the App directory run the following command
```
node app.js
```

## What it do?
It's a simple server that allows for keeping track of a weirdly specific type of banking. You can talk to it with the API described below.

### API
All of the input and results are done in JSON format. No inputs are optional or can be left empty.

#### POST /account
This POST will create a new account for you to use with the name you supplied. The name cannot be empty.

##### Request
Variable | Type | Purpose
--- | --- | ---
name | String | The name you want for the new banking account

##### Response
Variable | Type | Value
--- | --- | ---
id | Number | A unique number describing the banking account
name | String | The name of the new banking account
balance | Number | The balance on the account, 0 from start


#### GET /account/:id
This GET will return the state of the banking account that is described by the given id.

##### URL Parameter
Variable | Purpose
--- | ---
:id | id describing the banking account

##### Response
Variable | Type | Value
--- | --- | ---
id | Number | account's id
name | String | name of the banking account
balance | Number | balance on the banking account



#### POST /account/:id/deposit
Make a deposit to the bank account with given id for the amount described in your request. Returns the new state of the account.

##### URL Parameter
Variable | Purpose
--- | ---
:id | id describing the banking account

##### Request
Variable | Type | Purpose
--- | --- | ---
amount | Number | Value to deposit to the account. Must be larger then 0

##### Response
Variable | Type | Value
--- | --- | ---
id | Number | account's id
name | String | name of the banking account
balance | Number | balance on the banking account



#### POST /account/:id/withdraw
Withdraw from a bank account with given id for the amount described in your request. The resulting balance should be 0 or higher. Returns the new state of the account.

##### URL Parameter
Variable | Purpose
--- | ---
:id | id describing the banking account

##### Request
Variable | Type | Purpose
--- | --- | ---
amount | Number | Value to withdraw to the account. Must be larger then 0. Can not be larger then the current balance.

##### Response
Variable | Type | Value
--- | --- | ---
id | Number | account's id
name | String | name of the banking account
balance | Number | new balance on the banking account



#### POST /account/:id/send
Send money from one banking account to another. The resulting balance should be 0 or higher on the sending account. The amount to be send should be larger then 0. Returns the new state of the account.

##### URL Parameter
Variable | Purpose
--- | ---
:id | id describing the sending account

##### Request
Variable | Type | Purpose
--- | --- | ---
amount | Number | Value to send from the account in the URL Parameter. Must be larger then 0. Can not be larger then the current balance.
account-number | Number | id of the account to receive

##### Response
Variable | Type | Value
--- | --- | ---
id | Number | sending account's id
name | String | name of the sending account
balance | Number | new balance on the sending account



#### GET /account/:id/audit
Audit the account. Shows a chronological list of all the actions done on the account. Returns an empty list if there have been none.

##### URL Parameter
Variable | Purpose
--- | ---
:id | id of the account to audit

##### Response
The list has as many entries as actions have been done. Each of these is described by
Variable | Type | Value
--- | --- | ---
sequence | Number | described the order of the action, higher is later
debit | String | amount of money that was removed
credit | String | amount of money that was added
description | String | A description of the event that took place


