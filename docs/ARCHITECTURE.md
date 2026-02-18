# Ledger Wallet - Architecture & System Design

This document explains the high-level architecture, data flow, and core design decisions behind the **Ledger Wallet** application.

The goal of this system is to simulate a real-world fintech wallet using **ledger-based accounting**, **safe concurrency**, and **scalable backend patterns**.

---

## 1. System Overview

Ledger Wallet is a full-stack fintech web application consisting of:

- A React frontend for users and admins
- A NestJS backend API
- A PostgreSQL database for durable storage
- Redis for caching and concurrency control

All financial calculations are derived from a **ledger table**, not from a mutable balance column.

---

## 2. High-Level Architecture

### Components

#### Frontend
- React + TypeScript + Tailwind
- Communicates with backend via REST APIs
- Handles UI state and user interactions

#### Backend
- NestJS (modular architecture)
- JWT-based authentication
- Role-based access control (USER / ADMIN)
- Prisma ORM for database access

#### Database
- PostgreSQL (Neo in production)
- Stores users, wallets, ledger entries, payments, and transfers

#### Redis
- Balance caching
- Wallet-level concurrency locks
- Short-lived operational data

---

## 3. Core Design Principle - Ledger-Based Accounting

Instead of storing a mutable balance, the system follows **ledger-based accounting**.

### Why Ledger?
- Prevents balance mismatch
- Provides a complete audit trail
- Matches real fintech and banking systems
- Simplifies reconciliation and debugging

### Balance Calculation
```
Balance = SUM(all CREDIT entries) - SUM(all DEBIT entries)
```


The wallet balance is **derived**, not stored.

---

## 4. Database Architecture

### Key Entities

#### User
- Represents an application user
- Has a role (USER or ADMIN)
- Owns exactly one wallet

#### Wallet
- One-to-one relationship with User
- Acts as a logical container
- Does NOT store balance

#### LedgerEntry
- Records every financial event
- CREDIT or DEBIT
- References either a PAYMENT or TRANSFER

#### Payment
- Represents money added to wallet
- Tracks payment provider state
- Updated via webhook

#### Transfer
- Represents money sent between users
- Produces two ledger entries:
  - DEBIT for sender
  - CREDIT for recipient

---

## 5. Redis Usage

Redis is used for **performance and safety**, not as a source of truth.

### 1. Balance Cache

**Key**
```
wallet:balance:{userId}
```

**Purpose**
- Avoid repeated database aggregation on dashboards

**TTL**
- ~30 seconds

**Invalidation**
- On send money
- On receive money
- On add money

---

### 2. Wallet Transactions Cache

**Key**
```
wallet:transactions:{userId}:*
```

**Purpose**
- Cache paginated wallet transactions
- Improve dashboard transaction load speed

**TTL**
- As configured (recommended: 30 seconds)

**Invalidation**
- On send money
- On receive money

---

### 3. Wallet Lock (Concurrency Control)

**Key**
```
wallet:lock:{userId}
```

**Purpose**
- Prevent concurrent transfers from overspending
- Ensures atomic transfer behavior

**TTL**
- 5 seconds (auto-release safety)

---

### 4. Admin Users Cache

**Key**
```
admin:users:{adminId}
```

**Purpose**
- Cache all users list for admin dashboard
- Speeds up admin search & listing

**TTL**
- ~30 seconds

---

### 5. Admin Transactions Cache

**Key**

```
admin:transactions:{adminId}:{page}:{limit}
```

**Purpose**
- Cache paginated transactions list for admin panel
- Reduce DB load on repeated list views

**TTL**
- ~60 seconds

---

## 6. Add Money (Payment) Workflow

### Step-by-step Flow

1. User clicks **Add Money**
2. Frontend calls `POST /payment/create`
3. Backend:
   - Creates a Payment record with status `CREATED`
   - Generates a mock provider payment ID
4. Frontend shows mock Razorpay modal
5. On success:
   - Frontend triggers webhook simulation
6. Backend webhook:
   - Marks payment as `SUCCESS`
   - Creates a CREDIT ledger entry
   - Clears Redis balance cache
7. User sees updated balance

### Why Webhooks?
- Matches real payment gateway behavior
- Payment confirmation is asynchronous
- Decouples payment creation from settlement

---

## 7. Transfer Money Workflow

### Step-by-step Flow

1. User submits recipient email and amount
2. Backend attempts to acquire Redis wallet lock
3. Backend:
   - Fetches wallet balance
   - Validates sufficient funds
   - Validates recipient existence
   - Creates Transfer record
   - Creates two ledger entries:
     - DEBIT sender
     - CREDIT recipient
4. Redis lock is released
5. Balance cache is invalidated for both users
6. Success response is returned

### Why Redis Lock?

Without lock:
- Two concurrent transfers could pass balance check
- Result: negative balance

With lock:
- Only one transfer executes at a time per wallet
- Prevents overspending

---

## 8. Authentication & Authorization

### Authentication
- JWT-based
- Token contains:
  - id
  - firstName
  - lastName
  - email
  - role

### Authorization
- Role-based access control
- Guards and decorators
- Admin routes protected via ADMIN role

---

## 9. Admin Architecture

Admins have read-only access to:

- All users
- All transactions
- Paginated and filterable views

Admin routes:
```
/admin/users
/admin/transactions
```

Admins **do not mutate balances** directly.  
All data is derived from ledger entries.

---

## 10. Error Handling Strategy

- Validation errors via DTOs
- Domain errors via NestJS exceptions
- Clear HTTP status codes
- No silent failures

### Common Errors
- Insufficient balance
- Invalid recipient
- Unauthorized access
- Duplicate payment webhook calls

---

## 11. Scalability Considerations

- Stateless backend
- Redis used for coordination
- Ledger model supports horizontal scaling
- Easy to integrate real payment gateways

---

## 12. Why This Architecture Works Well for Fintech

- Matches real banking systems
- Audit-friendly
- Safe under concurrency
- Easy to reason about
- Interview-ready design

---

## Summary

Ledger Wallet uses:
- Ledger-first accounting
- Redis-backed concurrency control
- Webhook-driven payments
- Role-based access control
- Production-grade architecture

This design prioritizes **correctness, safety, and clarity** - the same values expected in real fintech systems.
