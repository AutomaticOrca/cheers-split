# **📖 Bill-Splitting Algorithm**

---

## **🧮 Why Use a Two-Pointer Approach?**
The goal of our **bill-splitting algorithm** is to determine the **minimum number of transactions** required to settle all debts fairly.  
Instead of performing **O(n²) pairwise transactions**, we use a **greedy two-pointer technique** to optimize it to **O(n log n)**.

---

## **🔢 How the Algorithm Works**
### **Step 1: Calculate Net Balances**
Each participant has a **net balance**, which is the difference between the amount they **paid** and the amount they **should have paid (fair share).**

\[
\text{net\_balance} = \text{total\_paid} - \text{mean\_amount}
\]

- **Positive balance** → Overpaid (should receive money)
- **Negative balance** → Underpaid (should pay money)
- **Zero balance** → Paid exactly their fair share (no action needed)

---

### **Step 2: Sort Participants by Net Balance**
We sort all participants by their **net balance** in **ascending order**:

| Name    | Paid | Fair Share | Net Balance |
|---------|------|------------|-------------|
| Charlie | $0   | $30        | **-30**     |
| Bob     | $30  | $30        | **0**       |
| Alice   | $60  | $30        | **+30**     |

---

### **Step 3: Use Two Pointers to Match Debtors with Creditors**
We use **two pointers**, `i` and `j`, to efficiently match people who **owe money (`i`)** with those who **are owed money (`j`)**.

| Pointer | Name    | Net Balance |
|---------|--------|-------------|
| `i = 0` | Charlie | **-30**      |
|         | Bob     | **0**        |
| `j = 2` | Alice   | **+30**      |

**Algorithm Process:**
1. **Charlie owes $30, Alice is owed $30** → Match them.
2. **Charlie transfers $30 to Alice** → Both are now settled.
3. **Move `i++` (Charlie is settled), move `j--` (Alice is settled).**
4. **End of loop: All transactions completed with minimal steps!**

---

## **🔥 Code Implementation of the Two-Pointer Approach**
```typescript
export function calculateTransactions(participants: Participant[]): Transaction[] {
    // Step 1: Calculate total expenses for each participant
    const payments: Record<string, number> = {};
    participants.forEach(participant => {
        payments[participant.name] = participant.items.reduce((sum, item) => sum + item.price, 0);
    });

    const people = Object.keys(payments);
    const totalAmount = Object.values(payments).reduce((acc, curr) => acc + curr, 0);
    const meanAmount = totalAmount / people.length;

    // Step 2: Compute net balance (paid - fair share)
    const sortedPeople = [...people].sort((a, b) => payments[a] - payments[b]);
    const sortedBalances = sortedPeople.map(person => payments[person] - meanAmount);

    let i = 0;
    let j = sortedPeople.length - 1;
    const transactions: Transaction[] = [];

    // Step 3: Two-pointer greedy algorithm
    while (i < j) {
        const debt = Math.min(-sortedBalances[i], sortedBalances[j]);
        sortedBalances[i] += debt;
        sortedBalances[j] -= debt;

        transactions.push({
            from: sortedPeople[i],
            to: sortedPeople[j],
            amount: parseFloat(debt.toFixed(2))
        });

        if (sortedBalances[i] === 0) i++; // Move left pointer if debt is settled
        if (sortedBalances[j] === 0) j--; // Move right pointer if overpayment is settled
    }

    return transactions;
}
```

---

## **🚀 How the Two-Pointer Technique Optimizes Efficiency**
### **🔴 Naive Approach (O(n²))**
A naive method would involve iterating through **all possible pairs** (`O(n²)`) to balance payments:
- **Charlie to Alice**
- **Bob to Alice**
- **More unnecessary transactions**

This would result in an **excessive** number of transactions.

### **🟢 Two-Pointer Approach (O(n log n))**
1. **Sorting takes `O(n log n)`.**
2. **Greedy two-pointer approach processes transactions in `O(n)`.**
3. **Total complexity: `O(n log n)`.**

The **two-pointer approach minimizes the number of transactions**, ensuring **only necessary payments are made**, and does it efficiently.

---

## **🎯 Summary**
| Approach   | Time Complexity | Transactions Generated |
|------------|----------------|------------------------|
| **Brute Force** (pairwise matching) | **O(n²)** | More transactions |
| **Greedy Two-Pointer** (our approach) | **O(n log n)** | Minimum transactions |

✅ **Optimized**: Fewer transactions, faster processing  
✅ **Fair**: Everyone pays their exact share  
✅ **Scalable**: Works for large groups

🚀 With this two-pointer algorithm, **you get the fastest and fairest bill-splitting process possible!** 🎉