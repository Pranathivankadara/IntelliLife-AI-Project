let transactions = [];


// ===============================
// OPEN TRANSACTION FORM
// ===============================

function openTransactionForm() {

    const modal = document.getElementById("transactionModal");

    if (modal) {
        modal.classList.add("show");
    }

    const dateInput = document.getElementById("transactionDate");

    if (dateInput && !dateInput.value) {

        const today = new Date();

        dateInput.value =
            today.toISOString().split("T")[0];
    }
}


// ===============================
// CLOSE TRANSACTION FORM
// ===============================

function closeTransactionForm() {

    const modal =
        document.getElementById("transactionModal");

    if (modal) {
        modal.classList.remove("show");
    }
}


// ===============================
// ADD TRANSACTION
// ===============================

function addTransaction(event) {

    event.preventDefault();

    const type =
        document.querySelector(
            'input[name="transactionType"]:checked'
        ).value;

    const amount =
        Number(
            document.getElementById("amount").value
        );

    const description =
        document.getElementById("description")
            .value
            .trim();

    const category =
        document.getElementById("category").value;

    const date =
        document.getElementById("transactionDate").value;


    if (!amount || amount <= 0) {

        alert("Please enter a valid amount.");

        return;
    }


    if (!description) {

        alert("Please enter a description.");

        return;
    }


    const transaction = {

        id: Date.now(),

        type: type,

        amount: amount,

        description: description,

        category: category,

        date: date
    };


    transactions.push(transaction);


    updateFinance();

    renderTransactions();

    closeTransactionForm();


    document
        .getElementById("transactionForm")
        .reset();


    alert("Transaction added successfully!");
}


// ===============================
// UPDATE EVERYTHING
// ===============================

function updateFinance() {

    let income = 0;

    let expense = 0;


    transactions.forEach(transaction => {

        if (transaction.type === "income") {

            income += transaction.amount;

        } else {

            expense += transaction.amount;
        }

    });


    const balance =
        income - expense;


    // Summary cards

    document.getElementById("totalIncome")
        .textContent = formatCurrency(income);

    document.getElementById("totalExpense")
        .textContent = formatCurrency(expense);

    document.getElementById("totalBalance")
        .textContent = formatCurrency(balance);

    document.getElementById("totalSavings")
        .textContent = formatCurrency(balance);


    // Overview

    updateOverview(
        income,
        expense,
        balance
    );


    // Categories

    updateCategories();

}


// ===============================
// SPENDING OVERVIEW
// ===============================

function updateOverview(
    income,
    expense,
    balance
) {

    const incomeElement =
        document.getElementById("overviewIncome");

    const expenseElement =
        document.getElementById("overviewExpense");

    const balanceElement =
        document.getElementById("overviewBalance");


    if (incomeElement) {

        incomeElement.textContent =
            formatCurrency(income);
    }


    if (expenseElement) {

        expenseElement.textContent =
            formatCurrency(expense);
    }


    if (balanceElement) {

        balanceElement.textContent =
            formatCurrency(balance);
    }


    let incomePercent = 0;

    let expensePercent = 0;


    if (income > 0) {

        incomePercent = 100;

        expensePercent =
            Math.min(
                (expense / income) * 100,
                100
            );
    }


    const incomeBar =
        document.getElementById("incomeBar");

    const expenseBar =
        document.getElementById("expenseBar");


    if (incomeBar) {

        incomeBar.style.width =
            incomePercent + "%";
    }


    if (expenseBar) {

        expenseBar.style.width =
            expensePercent + "%";
    }


    const incomePercentText =
        document.getElementById("incomePercent");

    const expensePercentText =
        document.getElementById("expensePercent");


    if (incomePercentText) {

        incomePercentText.textContent =
            Math.round(incomePercent) + "%";
    }


    if (expensePercentText) {

        expensePercentText.textContent =
            Math.round(expensePercent) + "%";
    }


    const message =
        document.getElementById("moneyMessage");


    if (!message) {
        return;
    }


    if (transactions.length === 0) {

        message.textContent =
            "Add transactions to understand your spending pattern.";

        return;
    }


    if (income === 0 && expense > 0) {

        message.textContent =
            "You have recorded expenses but no income yet.";

        return;
    }


    if (expense === 0 && income > 0) {

        message.textContent =
            "Great! No expenses have been recorded yet.";

        return;
    }


    if (expense > income) {

        message.textContent =
            "Your expenses are higher than your income. Keep an eye on your spending.";

        return;
    }


    const savingPercentage =
        income > 0
            ? ((income - expense) / income) * 100
            : 0;


    if (savingPercentage >= 30) {

        message.textContent =
            "Nice! You are keeping a healthy portion of your income as savings.";

    } else if (savingPercentage >= 10) {

        message.textContent =
            "You are saving some of your income. Try to improve it gradually.";

    } else {

        message.textContent =
            "Most of your income is being spent. Consider reviewing your expenses.";
    }

}


// ===============================
// CATEGORY BREAKDOWN
// ===============================

function updateCategories() {

    const categoryTotals = {

        Food: 0,

        Travel: 0,

        Shopping: 0,

        Others: 0
    };


    transactions.forEach(transaction => {

        if (
            transaction.type === "expense" &&
            categoryTotals.hasOwnProperty(
                transaction.category
            )
        ) {

            categoryTotals[
                transaction.category
            ] += transaction.amount;
        }

    });


    updateCategoryAmount(
        "foodAmount",
        categoryTotals.Food
    );


    updateCategoryAmount(
        "travelAmount",
        categoryTotals.Travel
    );


    updateCategoryAmount(
        "shoppingAmount",
        categoryTotals.Shopping
    );


    updateCategoryAmount(
        "othersAmount",
        categoryTotals.Others
    );

}


function updateCategoryAmount(
    elementId,
    amount
) {

    const element =
        document.getElementById(elementId);

    if (element) {

        element.textContent =
            formatCurrency(amount);
    }
}


// ===============================
// RENDER TRANSACTIONS
// ===============================

function renderTransactions() {

    const transactionList =
        document.getElementById(
            "transactionList"
        );


    if (!transactionList) {
        return;
    }


    if (transactions.length === 0) {

        transactionList.innerHTML = `

            <div class="transaction-empty">

                <div class="empty-icon">
                    ₹
                </div>

                <h3>
                    No transactions yet
                </h3>

                <p>
                    Add your first transaction to start tracking your money.
                </p>

                <button
                    class="outline-btn"
                    onclick="openTransactionForm()">
                    + Add Transaction
                </button>

            </div>

        `;

        return;
    }


    const sortedTransactions =
        [...transactions].sort(
            (a, b) =>
                new Date(b.date) -
                new Date(a.date)
        );


    transactionList.innerHTML = "";


    sortedTransactions.forEach(transaction => {

        const item =
            document.createElement("div");

        item.className =
            "transaction-item";


        const sign =
            transaction.type === "income"
                ? "+"
                : "-";


        const amountClass =
            transaction.type === "income"
                ? "income-amount"
                : "expense-amount";


        item.innerHTML = `

            <div class="transaction-info">

                <div class="transaction-icon">
                    ${getCategoryIcon(transaction.category)}
                </div>

                <div>

                    <h4>
                        ${escapeHTML(
                            transaction.description
                        )}
                    </h4>

                    <p>
                        ${escapeHTML(
                            transaction.category
                        )}
                        ·
                        ${formatDate(
                            transaction.date
                        )}
                    </p>

                </div>

            </div>


            <div class="transaction-right">

                <strong class="${amountClass}">
                    ${sign}${formatCurrency(
                        transaction.amount
                    )}
                </strong>

                <button
                    class="delete-transaction"
                    onclick="deleteTransaction(${transaction.id})"
                    title="Delete transaction">
                    ×
                </button>

            </div>

        `;


        transactionList.appendChild(item);

    });

}


// ===============================
// DELETE TRANSACTION
// ===============================

function deleteTransaction(id) {

    const confirmed =
        confirm(
            "Are you sure you want to delete this transaction?"
        );


    if (!confirmed) {
        return;
    }


    transactions =
        transactions.filter(
            transaction =>
                transaction.id !== id
        );


    updateFinance();

    renderTransactions();

}


// ===============================
// CATEGORY ICON
// ===============================

function getCategoryIcon(category) {

    const icons = {

        Food: "F",

        Travel: "T",

        Shopping: "S",

        Education: "E",

        Bills: "B",

        Others: "O"
    };


    return icons[category] || "O";
}


// ===============================
// FORMAT CURRENCY
// ===============================

function formatCurrency(amount) {

    return "₹" +
        amount.toLocaleString(
            "en-IN",
            {
                maximumFractionDigits: 2
            }
        );
}


// ===============================
// FORMAT DATE
// ===============================

function formatDate(date) {

    if (!date) {
        return "";
    }


    const dateObject =
        new Date(date);


    return dateObject.toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );
}


// ===============================
// SECURITY
// ===============================

function escapeHTML(value) {

    const div =
        document.createElement("div");

    div.textContent = value;

    return div.innerHTML;
}


// ===============================
// VIEW ALL
// ===============================

function viewAllTransactions() {

    if (transactions.length === 0) {

        alert(
            "No transactions available yet."
        );

        return;
    }


    alert(
        "All your transactions are displayed below."
    );
}


// ===============================
// INITIAL LOAD
// ===============================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        updateFinance();

        renderTransactions();

    }
);


// ===============================
// CLOSE MODAL OUTSIDE CLICK
// ===============================

document.addEventListener(
    "click",
    function (event) {

        const modal =
            document.getElementById(
                "transactionModal"
            );


        if (
            modal &&
            event.target === modal
        ) {

            closeTransactionForm();

        }

    }
);