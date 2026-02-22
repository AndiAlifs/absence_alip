# Load Testing with k6

This directory contains a load testing script for the Field Attendance System.

## Prerequisites

You need to have **k6** installed on your machine.

### Windows (Chocolatey)
```powershell
choco install k6
```

### Windows (Winget)
```powershell
winget install k6
```

### Manual Download
Download the installer from [https://k6.io/docs/get-started/installation/](https://k6.io/docs/get-started/installation/)

## Running the Test

1. Ensure your backend server is running on `http://localhost:8080`.
   ```bash
   cd backend
   go run main.go
   ```

2. Run the load test script:
   ```bash
   k6 run load-tests/load_test.js
   ```

3. View the results:
   - **Console**: Standard text summary will appear in the terminal.
   - **HTML Dashboard**: Open `summary.html` (created in your current directory) in your browser after the test completes.

## Test Scenario (`load_test.js`)

The script simulates the following behavior:
1.  **Virtual Users (VUs)**: Ramps up to 10 concurrent users.
2.  **Login**: Randomly picks one of the seeded employees (`karyawan1` - `karyawan5`).
3.  **Clock In**: Sends a clock-in request with coordinates randomly jittered near the **Kendari Office** location (to ensure "Approved" status).
4.  **Verify**: Checks for successful HTTP 200 responses.
5.  **History**: Fetches the attendance history for today.

## Thresholds

The test is configured with a simple pass/fail threshold:
-   95% of requests must complete within 500ms.
