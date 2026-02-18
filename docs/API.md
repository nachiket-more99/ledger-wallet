# Ledger Wallet - API Documentation

All endpoints are RESTful. Use **Bearer JWT** for authenticated routes.

**Base URLs:**  
- Development: `http://localhost:3333`  

---

## Table of Contents

- [Auth](#auth)  
- [User](#user)  
- [Wallet](#wallet)  
- [Payments](#payments)  
- [Transfers](#transfers)  
- [Admin](#admin)  

---

## Auth

### 1. Register User

**POST** `/auth/register`

**Request Body:**

```json
{
  "firstName": "Nachiket",
  "lastName": "More",
  "email": "user.nachiket@example.com",
  "password": "Pass@123"
}
```
**Response:**

```json
{
  "message": "user registred",
  "userDetails": {
    "firstName": "Nachiket",
    "lastName": "More",
    "email": "user.nachiket@gmail.com",
    "role": "USER"
  }
}
```


### 2. Login User

**POST** `/auth/login`

**Request Body:**

```json
{
  "email": "user.nachiket@example.com",
  "password": "Pass@123"
}
```
**Response:**

```json
{
  "message": "user is logged in",
  "accessToken": "jwt_token",
  "role": "USER"
}
```

## User
All user routes require Bearer JWT.

### 1. Get Me

**GET** `/user/me`

**Response:**

```json
{
  "firstName": "Nachiket",
  "lastName": "More",
  "email": "user.nachiket@gmail.com",
  "role": "USER"
}
```


## Wallet
All wallet routes require Bearer JWT.

### 1. Get Wallet Balance

**GET** `/wallet/balance`

**Response:**

```json
{
  "message": "Balance fetched",
  "source": "cache",
  "balance": 2500
}
```
### 2. Get Recent Transactions

**GET** `/wallet/transactions?limit=5`

**Response:**

```json
{
  "message": "Transactions fetched",
  "source": "cache",
  "result": {
    "transactions": [
      {
        "createdAt": "2026-02-15T18:49:42.611Z",
        "type": "DEBIT",
        "referenceId": "uuid",
        "amount": 1000,
        "user": {
          "firstName": "Nachiket",
          "lastName": "More",
          "email": "user.nachiket@gmail.com"
        }
      },
     ...
    ],
  }
  "page": 1,
  "limit": 5,
  "total": 5,
  "totalPages": 1
}
```

### 3. Get All Transactions

**GET** `/wallet/transactions?limit=10&page=1`

**Response:**

```json
{
  "message": "Transactions fetched",
  "source": "cache",
  "result": {
    "transactions": [
      {
        "createdAt": "2026-02-15T18:49:42.611Z",
        "type": "DEBIT",
        "referenceId": "uuid",
        "amount": 1000,
        "user": {
          "firstName": "Nachiket",
          "lastName": "More",
          "email": "user.nachiket@gmail.com"
        }
      },
     ...
    ],
  }
  "page": 1,
  "limit": 10,
  "total": 8,
  "totalPages": 1
}
```


## Payments
All payment routes require Bearer JWT.

### 1. Create Payment (Add Money)

**POST** `/payment/create`

**Request Body:**

```json
{
  "amount": 1000,
  "provider": "MOCK_RAZORPAY" 
}
```

**Response:**

```json
{
  "message": "payment created",
  "paymentId": "uuid",
  "amount": 1000,
  "status": "CREATED"
}
```
Notes:
* `providerPaymentId` is generated on backend (mock Razorpay)
* Webhook `/payment/webhook` is used to simulate payment success/failure

### 2. Payment Webhook

**POST** `/payment/webhook`

**Request Body (mock):**

```json
{
  "paymentId": "uuid"
}
```

**Response:**

```json
{
  "message": "payment succeded",
  "providerPaymentId": "uuid",
  "amount": 1000,
  "status": "SUCCESS"
}
```





## Transfers
All transfers routes require Bearer JWT.

### 1. Send Money

**POST** `/transfer`

**Request Body:**

```json
{
  "recipientEmail": "jane@example.com",
  "amount": 500
}
```

**Response:**

```json
{
  "message": "Money sent successfully",
  "firstName": "Jane",
  "lastName": "Doe",
  "recipientEmail": "jane@example.com",
  "amount": 500,
  "status": "SUCCESS"
}
```
Notes:
* `Redis lock wallet:lock:{userId}` prevents concurrent overspending
* DEBIT/CREDIT entries are automatically created in Ledger
* Wallet balance is updated in Redis cache



## Admin
Only accessible to ADMIN role.

### 1. Get All Users

**GET** `/admin/users`

**Response:**

```json
{
  "users": [
    {
      "id": "uuid",
      "email": "jane@example.com",
      "balance": 500,
      "role": "USER",
      "createdAt": "2026-02-01T10:00:00Z"
    }
    {
      "id": "uuid",
      "email": "user.nachiket@example.com",
      "balance": 500,
      "role": "USER",
      "createdAt": "2026-01-31T10:00:00Z"
    }
    ...
  ]
}
```
### 2. Get All Transactions

**GET** `/admin/transactions?page=1&limit=10`

**Response:**

```json
{
  "message": "Transactions fetched",
  "source": "cache",
  "result": {
    "transactions": [
      {
        "createdAt": "2026-02-15T18:52:42.611Z",
        "type": "CREDIT",
        "referenceId": "uuid",
        "amount": 500,
        "user": {
          "firstName": "Jane",
          "lastName": "Doe",
          "email": "jane@example.comm"
        }
      },
      {
        "createdAt": "2026-02-15T18:49:42.611Z",
        "type": "DEBIT",
        "referenceId": "uuid",
        "amount": 500,
        "user": {
          "firstName": "Nachiket",
          "lastName": "More",
          "email": "user.nachiket@gmail.com"
        }
      },
     ...
    ],
  }
  "page": 1,
  "limit": 8,
  "total": 12,
  "totalPages": 2
}
```