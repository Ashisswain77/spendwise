import "dotenv/config";
process.env.NODE_ENV = "test";
process.env.DB_NAME = "spendwise_test";

import http from "http";
import mongoose from "mongoose";
import app from "./src/app.js";
import { connectDatabase } from "./src/config/database.js";
import Transaction from "./src/models/Transaction.js";
import Budget from "./src/models/Budget.js";
import Goal from "./src/models/Goal.js";
import GoalContribution from "./src/models/GoalContribution.js";

async function runPhase2Tests() {
    console.log("=== STARTING SPENDWISE PHASE 2 INTEGRATION TEST SUITE ===\n");
    let passed = 0;
    let failed = 0;

    function assert(condition, testName, details = "") {
        if (condition) {
            console.log(`[PASS] ${testName}`);
            passed++;
        } else {
            console.error(`[FAIL] ${testName} ${details ? "- " + details : ""}`);
            failed++;
        }
    }

    // 1. Connect to isolated test database
    try {
        await connectDatabase();
        assert(mongoose.connection.readyState === 1, "Database: Connected to test database securely");
        assert(mongoose.connection.name === "spendwise_test", "Database: Using isolated spendwise_test database");
    } catch (err) {
        assert(false, "Database connection", err.message);
        process.exit(1);
    }

    // Clean up test database before running
    await Transaction.deleteMany({});
    await Budget.deleteMany({});
    await Goal.deleteMany({});
    await GoalContribution.deleteMany({});

    // Start in-memory test server
    const server = http.createServer(app);
    await new Promise((resolve) => server.listen(0, resolve));
    const port = server.address().port;
    const baseUrl = `http://localhost:${port}/api/v1`;

    const userAlpha = "user_test_alpha_123";
    const userBravo = "user_test_bravo_456";

    const alphaHeaders = {
        "Content-Type": "application/json",
        "x-test-user-id": userAlpha,
    };

    const bravoHeaders = {
        "Content-Type": "application/json",
        "x-test-user-id": userBravo,
    };

    try {
        // =========================================================================
        // SECTION 1: AUTHENTICATION FAILURES
        // =========================================================================
        console.log("\n--- Section 1: Authentication Failures ---");

        const unauthGetTx = await fetch(`${baseUrl}/transactions`);
        assert(unauthGetTx.status === 401, "Auth: GET /transactions rejects unauthenticated request with 401");

        const unauthPostTx = await fetch(`${baseUrl}/transactions`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title: "Test", amountInPaise: 1000 }),
        });
        assert(unauthPostTx.status === 401, "Auth: POST /transactions rejects unauthenticated request with 401");

        const unauthGetBudgets = await fetch(`${baseUrl}/budgets`);
        assert(unauthGetBudgets.status === 401, "Auth: GET /budgets rejects unauthenticated request with 401");

        const unauthGetGoals = await fetch(`${baseUrl}/goals`);
        assert(unauthGetGoals.status === 401, "Auth: GET /goals rejects unauthenticated request with 401");

        // =========================================================================
        // SECTION 2: INPUT VALIDATION & INTEGRITY
        // =========================================================================
        console.log("\n--- Section 2: Input Validation & Integrity ---");

        // Negative transaction amount
        const negTxRes = await fetch(`${baseUrl}/transactions`, {
            method: "POST",
            headers: alphaHeaders,
            body: JSON.stringify({
                title: "Grocery Shopping",
                amountInPaise: -5000,
                type: "expense",
                category: "Groceries",
                date: "2026-11-01",
            }),
        });
        assert(negTxRes.status === 400, "Validation: Negative transaction amount rejected with 400");

        // Zero transaction amount
        const zeroTxRes = await fetch(`${baseUrl}/transactions`, {
            method: "POST",
            headers: alphaHeaders,
            body: JSON.stringify({
                title: "Grocery Shopping",
                amountInPaise: 0,
                type: "expense",
                category: "Groceries",
                date: "2026-11-01",
            }),
        });
        assert(zeroTxRes.status === 400, "Validation: Zero transaction amount rejected with 400");

        // Non-integer paise
        const decimalTxRes = await fetch(`${baseUrl}/transactions`, {
            method: "POST",
            headers: alphaHeaders,
            body: JSON.stringify({
                title: "Grocery Shopping",
                amountInPaise: 1500.5,
                type: "expense",
                category: "Groceries",
                date: "2026-11-01",
            }),
        });
        assert(decimalTxRes.status === 400, "Validation: Decimal non-integer paise rejected with 400");

        // Invalid transaction type
        const invalidTypeRes = await fetch(`${baseUrl}/transactions`, {
            method: "POST",
            headers: alphaHeaders,
            body: JSON.stringify({
                title: "Grocery Shopping",
                amountInPaise: 150000,
                type: "transfer",
                category: "Groceries",
                date: "2026-11-01",
            }),
        });
        assert(invalidTypeRes.status === 400, "Validation: Invalid transaction type rejected with 400");

        // Numbers in description (text-only validation)
        const numTitleRes = await fetch(`${baseUrl}/transactions`, {
            method: "POST",
            headers: alphaHeaders,
            body: JSON.stringify({
                title: "Grocery 123",
                amountInPaise: 150000,
                type: "expense",
                category: "Groceries",
                date: "2026-11-01",
            }),
        });
        assert(numTitleRes.status === 400, "Validation: Numbers in title rejected by textOnlyDescriptionSchema with 400");

        // Malformed MongoDB ID
        const malformedIdRes = await fetch(`${baseUrl}/transactions/invalid-mongo-id`, {
            headers: alphaHeaders,
        });
        assert(malformedIdRes.status === 400, "Validation: Malformed MongoDB ID rejected with 400");

        // Invalid budget period format
        const invalidPeriodRes = await fetch(`${baseUrl}/budgets`, {
            method: "POST",
            headers: alphaHeaders,
            body: JSON.stringify({
                category: "Food & drink",
                limitInPaise: 500000,
                period: "2026-13",
            }),
        });
        assert(invalidPeriodRes.status === 400, "Validation: Invalid budget period format rejected with 400");

        // =========================================================================
        // SECTION 3: TRANSACTION CRUD OPERATIONS
        // =========================================================================
        console.log("\n--- Section 3: Transaction CRUD Operations ---");

        // 3.1 Create Income Transaction
        const createIncomeRes = await fetch(`${baseUrl}/transactions`, {
            method: "POST",
            headers: alphaHeaders,
            body: JSON.stringify({
                title: "TechCorp Monthly Salary",
                amountInPaise: 8500000, // ₹85,000.00
                type: "income",
                category: "Salary",
                wallet: "Bank Transfer",
                date: "2026-11-01T10:00:00.000Z",
                note: "Monthly base compensation",
            }),
        });
        const incomeData = await createIncomeRes.json();
        assert(createIncomeRes.status === 201, "Transaction CRUD: Create income transaction status 201");
        assert(incomeData.success === true, "Transaction CRUD: Create income success === true");
        assert(incomeData.data.amountInPaise === 8500000, "Transaction CRUD: Correct amount in paise stored");
        const incomeId = incomeData.data._id;

        // 3.2 Create Expense Transaction
        const createExpenseRes = await fetch(`${baseUrl}/transactions`, {
            method: "POST",
            headers: alphaHeaders,
            body: JSON.stringify({
                title: "Organic Groceries",
                amountInPaise: 350000, // ₹3,500.00
                type: "expense",
                category: "Groceries",
                wallet: "UPI",
                date: "2026-11-05T14:30:00.000Z",
            }),
        });
        const expenseData = await createExpenseRes.json();
        assert(createExpenseRes.status === 201, "Transaction CRUD: Create expense transaction status 201");
        const expenseId = expenseData.data._id;

        // 3.3 Get Single Transaction by ID
        const getSingleRes = await fetch(`${baseUrl}/transactions/${incomeId}`, {
            headers: alphaHeaders,
        });
        const singleData = await getSingleRes.json();
        assert(getSingleRes.status === 200, "Transaction CRUD: Get single transaction status 200");
        assert(singleData.data.title === "TechCorp Monthly Salary", "Transaction CRUD: Title matches retrieved document");

        // 3.4 Update Transaction (PATCH)
        const updateRes = await fetch(`${baseUrl}/transactions/${incomeId}`, {
            method: "PATCH",
            headers: alphaHeaders,
            body: JSON.stringify({
                title: "TechCorp Executive Salary",
                amountInPaise: 9000000, // updated to ₹90,000.00
            }),
        });
        const updateData = await updateRes.json();
        assert(updateRes.status === 200, "Transaction CRUD: Update transaction status 200");
        assert(updateData.data.title === "TechCorp Executive Salary", "Transaction CRUD: Title updated successfully");
        assert(updateData.data.amountInPaise === 9000000, "Transaction CRUD: Amount updated successfully");

        // 3.5 Delete Transaction
        const deleteRes = await fetch(`${baseUrl}/transactions/${expenseId}`, {
            method: "DELETE",
            headers: alphaHeaders,
        });
        assert(deleteRes.status === 200, "Transaction CRUD: Delete transaction status 200");

        // Verify deleted transaction is no longer accessible
        const verifyDeletedRes = await fetch(`${baseUrl}/transactions/${expenseId}`, {
            headers: alphaHeaders,
        });
        assert(verifyDeletedRes.status === 404, "Transaction CRUD: Deleted transaction returns 404 Not Found");

        // =========================================================================
        // SECTION 4: FILTERING, SEARCH, SORTING & PAGINATION
        // =========================================================================
        console.log("\n--- Section 4: Filtering, Search, Sorting & Pagination ---");

        // Populate a set of diverse transactions
        const seedTxs = [
            { title: "Apartment Rent", amountInPaise: 2000000, type: "expense", category: "Home", wallet: "Net Banking", date: "2026-11-02" },
            { title: "Weekly Dining", amountInPaise: 250000, type: "expense", category: "Food & drink", wallet: "UPI", date: "2026-11-03" },
            { title: "Freelance Milestone", amountInPaise: 2500000, type: "income", category: "Freelance", wallet: "IMPS", date: "2026-11-04" },
            { title: "Electricity Utility Bill", amountInPaise: 180000, type: "expense", category: "Bills & fees", wallet: "UPI", date: "2026-11-06" },
            { title: "Weekend Coffee Treat", amountInPaise: 45000, type: "expense", category: "Food & drink", wallet: "Cash", date: "2026-11-07" },
        ];

        for (const tx of seedTxs) {
            await fetch(`${baseUrl}/transactions`, {
                method: "POST",
                headers: alphaHeaders,
                body: JSON.stringify(tx),
            });
        }

        // Filter by type: expense
        const filterTypeRes = await fetch(`${baseUrl}/transactions?type=expense`, { headers: alphaHeaders });
        const filterTypeData = await filterTypeRes.json();
        if (!filterTypeData.data) {
            console.error("DEBUG filterTypeData:", filterTypeRes.status, filterTypeData);
        }
        const allExpenses = filterTypeData.data.every((t) => t.type === "expense");
        assert(filterTypeRes.status === 200 && allExpenses, "Filter: By type=expense returns only expenses");

        // Filter by category: Food & drink
        const filterCatRes = await fetch(`${baseUrl}/transactions?category=Food %26 drink`, { headers: alphaHeaders });
        const filterCatData = await filterCatRes.json();
        assert(filterCatData.data.length === 2, "Filter: By category='Food & drink' returns correct count (2)");

        // Search: "Coffee"
        const searchRes = await fetch(`${baseUrl}/transactions?search=Coffee`, { headers: alphaHeaders });
        const searchData = await searchRes.json();
        assert(searchData.data.length === 1 && searchData.data[0].title === "Weekend Coffee Treat", "Search: Case-insensitive search on title works");

        // Date range filter
        const dateRangeRes = await fetch(`${baseUrl}/transactions?startDate=2026-11-03&endDate=2026-11-06`, { headers: alphaHeaders });
        const dateRangeData = await dateRangeRes.json();
        assert(dateRangeData.data.length === 3, "Filter: Date range filter matches expected transactions");

        // Sorting: by amountInPaise ascending
        const sortAscRes = await fetch(`${baseUrl}/transactions?sortBy=amountInPaise&sortOrder=asc&limit=10`, { headers: alphaHeaders });
        const sortAscData = await sortAscRes.json();
        const amounts = sortAscData.data.map((t) => t.amountInPaise);
        const isSortedAsc = amounts.every((val, i, arr) => i === 0 || arr[i - 1] <= val);
        assert(isSortedAsc, "Sort: Sorting by amountInPaise ascending works correctly");

        // Pagination: limit=2, page=1
        const page1Res = await fetch(`${baseUrl}/transactions?limit=2&page=1`, { headers: alphaHeaders });
        const page1Data = await page1Res.json();
        assert(page1Data.data.length === 2, "Pagination: Limit=2 returns exactly 2 records");
        assert(page1Data.pagination.page === 1, "Pagination: Page metadata indicates page 1");
        assert(page1Data.pagination.total >= 6, "Pagination: Total count includes all user transactions");
        assert(page1Data.pagination.totalPages >= 3, "Pagination: totalPages computed accurately");

        // =========================================================================
        // SECTION 5: BUDGET CRUD & SPENDING CALCULATIONS
        // =========================================================================
        console.log("\n--- Section 5: Budget CRUD & Spending Calculations ---");

        // 5.1 Create category budget for Food & drink in 2026-11
        const createBudgetRes = await fetch(`${baseUrl}/budgets`, {
            method: "POST",
            headers: alphaHeaders,
            body: JSON.stringify({
                category: "Food & drink",
                limitInPaise: 1000000, // ₹10,000.00
                period: "2026-11",
            }),
        });
        const budgetData = await createBudgetRes.json();
        assert(createBudgetRes.status === 201, "Budget CRUD: Create category budget status 201");
        const budgetId = budgetData.data._id;

        // 5.2 Create "Overall" budget for 2026-11
        const createOverallRes = await fetch(`${baseUrl}/budgets`, {
            method: "POST",
            headers: alphaHeaders,
            body: JSON.stringify({
                category: "Overall",
                limitInPaise: 5000000, // ₹50,000.00
                period: "2026-11",
            }),
        });
        assert(createOverallRes.status === 201, "Budget CRUD: Create 'Overall' budget status 201");

        // 5.3 Duplicate Budget Prevention (same category and period)
        const dupBudgetRes = await fetch(`${baseUrl}/budgets`, {
            method: "POST",
            headers: alphaHeaders,
            body: JSON.stringify({
                category: "Food & drink",
                limitInPaise: 1200000,
                period: "2026-11",
            }),
        });
        assert(dupBudgetRes.status === 409, "Budget Duplicate: Duplicate budget rejected with 409 Conflict");

        // 5.4 List Budgets with Real-time Spending Calculations
        const listBudgetsRes = await fetch(`${baseUrl}/budgets?period=2026-11`, { headers: alphaHeaders });
        const listBudgetsData = await listBudgetsRes.json();
        assert(listBudgetsRes.status === 200, "Budget CRUD: List budgets status 200");

        const foodBudget = listBudgetsData.data.find((b) => b.category === "Food & drink");
        assert(foodBudget !== undefined, "Budget Calculations: Food & drink budget present in list");
        // Food expenses seeded: 250000 + 45000 = 295000 paise
        assert(foodBudget.spentInPaise === 295000, `Budget Calculations: Food & drink spentInPaise === 295000 (actual: ${foodBudget.spentInPaise})`);
        assert(foodBudget.remainingInPaise === 1000000 - 295000, "Budget Calculations: Food & drink remainingInPaise computed correctly");

        const overallBudget = listBudgetsData.data.find((b) => b.category === "Overall");
        assert(overallBudget !== undefined, "Budget Calculations: 'Overall' budget present in list");
        // Total expenses seeded: 2000000 (rent) + 250000 (dining) + 180000 (electricity) + 45000 (coffee) = 2475000 paise
        assert(overallBudget.spentInPaise === 2475000, `Budget Calculations: Overall spentInPaise sums all expenses (${overallBudget.spentInPaise})`);

        // 5.5 Update Budget (PATCH limit)
        const updateBudgetRes = await fetch(`${baseUrl}/budgets/${budgetId}`, {
            method: "PATCH",
            headers: alphaHeaders,
            body: JSON.stringify({ limitInPaise: 1500000 }),
        });
        const updatedBudgetData = await updateBudgetRes.json();
        assert(updateBudgetRes.status === 200, "Budget CRUD: Update budget limit status 200");
        assert(updatedBudgetData.data.limitInPaise === 1500000, "Budget CRUD: Updated limit reflected in response");

        // 5.6 Delete Budget
        const deleteBudgetRes = await fetch(`${baseUrl}/budgets/${budgetId}`, {
            method: "DELETE",
            headers: alphaHeaders,
        });
        assert(deleteBudgetRes.status === 200, "Budget CRUD: Delete budget status 200");

        // =========================================================================
        // SECTION 6: GOAL CRUD & CONTRIBUTIONS
        // =========================================================================
        console.log("\n--- Section 6: Goal CRUD & Contributions ---");

        // 6.1 Create Goal
        const createGoalRes = await fetch(`${baseUrl}/goals`, {
            method: "POST",
            headers: alphaHeaders,
            body: JSON.stringify({
                name: "Emergency Fund",
                targetAmountInPaise: 10000000, // ₹1,00,000.00
                targetDate: "2027-12-31",
            }),
        });
        const goalData = await createGoalRes.json();
        assert(createGoalRes.status === 201, "Goal CRUD: Create goal status 201");
        assert(goalData.data.status === "active", "Goal CRUD: New goal defaults to 'active' status");
        assert(goalData.data.amountSavedInPaise === 0, "Goal CRUD: New goal defaults to 0 saved");
        const goalId = goalData.data._id;

        // 6.2 Get Goal by ID
        const getGoalRes = await fetch(`${baseUrl}/goals/${goalId}`, { headers: alphaHeaders });
        const getGoalData = await getGoalRes.json();
        assert(getGoalRes.status === 200, "Goal CRUD: Get goal by ID status 200");
        assert(Array.isArray(getGoalData.data.contributions), "Goal CRUD: Goal response includes contributions array");

        // 6.3 Update Goal
        const updateGoalRes = await fetch(`${baseUrl}/goals/${goalId}`, {
            method: "PATCH",
            headers: alphaHeaders,
            body: JSON.stringify({ name: "Family Emergency Fund" }),
        });
        const updatedGoalData = await updateGoalRes.json();
        assert(updateGoalRes.status === 200, "Goal CRUD: Update goal name status 200");
        assert(updatedGoalData.data.name === "Family Emergency Fund", "Goal CRUD: Updated name reflected");

        // 6.4 Goal Contributions Setup (smaller target to test full completion flow)
        const smallGoalRes = await fetch(`${baseUrl}/goals`, {
            method: "POST",
            headers: alphaHeaders,
            body: JSON.stringify({
                name: "Mechanical Keyboard",
                targetAmountInPaise: 1000000, // ₹10,000.00
            }),
        });
        const smallGoalData = await smallGoalRes.json();
        const smallGoalId = smallGoalData.data._id;

        // Valid contribution: 400000 paise (₹4,000.00)
        const contrib1Res = await fetch(`${baseUrl}/goals/${smallGoalId}/contributions`, {
            method: "POST",
            headers: alphaHeaders,
            body: JSON.stringify({ amountInPaise: 400000 }),
        });
        const contrib1Data = await contrib1Res.json();
        assert(contrib1Res.status === 201, "Goal Contribution: Valid contribution status 201");
        assert(contrib1Data.data.goal.amountSavedInPaise === 400000, "Goal Contribution: Goal amountSaved updated to 400000 paise");

        // Invalid contribution: exceeding target
        // Target: 1000000, current: 400000, remaining: 600000. Attempt 700000.
        const overfundRes = await fetch(`${baseUrl}/goals/${smallGoalId}/contributions`, {
            method: "POST",
            headers: alphaHeaders,
            body: JSON.stringify({ amountInPaise: 700000 }),
        });
        assert(overfundRes.status === 400, "Goal Contribution: Overfunding past remaining target rejected with 400");

        // Completing contribution: exactly 600000 paise
        const completeContribRes = await fetch(`${baseUrl}/goals/${smallGoalId}/contributions`, {
            method: "POST",
            headers: alphaHeaders,
            body: JSON.stringify({ amountInPaise: 600000 }),
        });
        const completeData = await completeContribRes.json();
        assert(completeContribRes.status === 201, "Goal Contribution: Final contribution status 201");
        assert(completeData.data.goal.status === "completed", "Goal Contribution: Goal auto-transitions to 'completed' status");

        // Contribution to already completed goal
        const postCompletedRes = await fetch(`${baseUrl}/goals/${smallGoalId}/contributions`, {
            method: "POST",
            headers: alphaHeaders,
            body: JSON.stringify({ amountInPaise: 1000 }),
        });
        assert(postCompletedRes.status === 400, "Goal Contribution: Contribution to completed goal rejected with 400");

        // Delete goal cascades contributions
        const deleteGoalRes = await fetch(`${baseUrl}/goals/${smallGoalId}`, {
            method: "DELETE",
            headers: alphaHeaders,
        });
        assert(deleteGoalRes.status === 200, "Goal CRUD: Delete goal status 200");
        const remainingContribs = await GoalContribution.countDocuments({ goalId: smallGoalId });
        assert(remainingContribs === 0, "Goal CRUD: Deleting goal cascades and removes its contributions");

        // =========================================================================
        // SECTION 7: CROSS-USER DATA ISOLATION
        // =========================================================================
        console.log("\n--- Section 7: Cross-User Data Isolation ---");

        // User Bravo attempts to read User Alpha's transaction
        const bravoGetAlphaTx = await fetch(`${baseUrl}/transactions/${incomeId}`, { headers: bravoHeaders });
        assert(bravoGetAlphaTx.status === 404, "Isolation: User B cannot access User A's transaction (404)");

        // User Bravo attempts to update User Alpha's transaction
        const bravoUpdateAlphaTx = await fetch(`${baseUrl}/transactions/${incomeId}`, {
            method: "PATCH",
            headers: bravoHeaders,
            body: JSON.stringify({ title: "Hacked Title" }),
        });
        assert(bravoUpdateAlphaTx.status === 404, "Isolation: User B cannot modify User A's transaction (404)");

        // User Bravo attempts to delete User Alpha's goal
        const bravoDeleteAlphaGoal = await fetch(`${baseUrl}/goals/${goalId}`, {
            method: "DELETE",
            headers: bravoHeaders,
        });
        assert(bravoDeleteAlphaGoal.status === 404, "Isolation: User B cannot delete User A's goal (404)");

        // User Bravo attempts to contribute to User Alpha's goal
        const bravoContribAlphaGoal = await fetch(`${baseUrl}/goals/${goalId}/contributions`, {
            method: "POST",
            headers: bravoHeaders,
            body: JSON.stringify({ amountInPaise: 50000 }),
        });
        assert(bravoContribAlphaGoal.status === 404, "Isolation: User B cannot contribute to User A's goal (404)");

        // User Bravo's list endpoints return zero of User Alpha's data
        const bravoListTx = await fetch(`${baseUrl}/transactions`, { headers: bravoHeaders });
        const bravoTxData = await bravoListTx.json();
        assert(bravoTxData.data.length === 0, "Isolation: User B transactions list is completely isolated (0 records)");

        const bravoListBudgets = await fetch(`${baseUrl}/budgets`, { headers: bravoHeaders });
        const bravoBudgetData = await bravoListBudgets.json();
        assert(bravoBudgetData.data.length === 0, "Isolation: User B budgets list is completely isolated (0 records)");

        // =========================================================================
        // SECTION 8: APPLICATION RESTART & PERSISTENCE
        // =========================================================================
        console.log("\n--- Section 8: Application Restart & Persistence ---");

        // Close current server instance
        await new Promise((resolve) => server.close(resolve));

        // Close database connection
        await mongoose.connection.close();

        // Reconnect to test database (simulating full server restart)
        await connectDatabase();
        assert(mongoose.connection.readyState === 1, "Persistence: Reconnected to database after shutdown");

        // Start fresh server instance on new port
        const restartServer = http.createServer(app);
        await new Promise((resolve) => restartServer.listen(0, resolve));
        const restartPort = restartServer.address().port;
        const restartUrl = `http://localhost:${restartPort}/api/v1`;

        try {
            // Verify User Alpha's transaction persists
            const persistedTxRes = await fetch(`${restartUrl}/transactions/${incomeId}`, { headers: alphaHeaders });
            const persistedTxData = await persistedTxRes.json();
            assert(persistedTxRes.status === 200, "Persistence: Transaction retrieved after full server restart");
            assert(persistedTxData.data.amountInPaise === 9000000, "Persistence: Transaction integrity and fields intact");

            // Verify User Alpha's goal persists
            const persistedGoalRes = await fetch(`${restartUrl}/goals/${goalId}`, { headers: alphaHeaders });
            const persistedGoalData = await persistedGoalRes.json();
            assert(persistedGoalRes.status === 200, "Persistence: Savings goal retrieved after full server restart");
            assert(persistedGoalData.data.name === "Family Emergency Fund", "Persistence: Goal integrity and fields intact");
        } finally {
            restartServer.close();
            // Clean up test database
            await Transaction.deleteMany({});
            await Budget.deleteMany({});
            await Goal.deleteMany({});
            await GoalContribution.deleteMany({});
            await mongoose.connection.close();
        }

    } catch (err) {
        console.error("Test runner encountered unexpected error:", err);
        failed++;
    }

    console.log(`\n=== PHASE 2 TEST RESULTS: ${passed} PASSED, ${failed} FAILED ===\n`);
    if (failed > 0) {
        process.exit(1);
    }
}

runPhase2Tests().catch((err) => {
    console.error("Fatal test runner crash:", err);
    process.exit(1);
});
