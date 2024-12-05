# Pragati Backend 2025

Backend server for **Pragati 2025**.

---

## Prerequisites

1. **Node.js** (v16 or higher) and **npm**: [Download and Install](https://nodejs.org/)
2. **MySQL**: [Download and Install](https://dev.mysql.com/)

---

## Installation Steps

### 1. Clone the Repository

```bash
git clone <REPOSITORY_URL>
cd Pragati_Backend_2025
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Create Databases

Set up the required databases in MySQL:

```sql
CREATE DATABASE pragati_2025;
CREATE DATABASE pragati_transactions_2025;
```

### 4. Configure Environment Variables

Create a `.env` file in the root directory of the project and add the following key-value pairs. Replace placeholders with actual values. Ensure there are no spaces or quotes, and values are entered as plain text.

```env
# Server Port Number
SERVER_PORT=<PORT_IN_WHICH_YOU_WANT_THE_BACKEND_TO_RUN_IN>

# Database Credentials
DB_PWD=<YOUR_MYSQL_DB_PASSWORD>

# Secret for JWT Token Source Verification
SECRET_KEY=<YOUR_SECRET_KEY>
```

### 5. Start the Server

- **For development** (with live reload):

  ```bash
  npm run dev
  ```

- **For production**:

  ```bash
  npm start
  ```

---

