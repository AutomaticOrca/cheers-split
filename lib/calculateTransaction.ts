export interface Item {
    itemName: string;
    price: number;
}

export interface Participant {
    name: string;
    paymentDetails: string; // payID / BSB & Account Number
    items: Item[];
}

export interface Transaction {
    from: string;
    to: string;
    amount: number;
}

/**
 * @param participants 参与者列表
 * @returns transactions
 */
export function calculateTransactions(participants: Participant[]): Transaction[] {
    // calculate payments for each participant
    const payments: Record<string, number> = {};

    participants.forEach(participant => {
        payments[participant.name] = participant.items.reduce((sum, item) => sum + item.price, 0);
    });

    const people = Object.keys(payments);
    const valuesPaid = Object.values(payments);

    // calculate total amount and mean amount
    const totalAmount = valuesPaid.reduce((acc, curr) => acc + curr, 0);
    const meanAmount = totalAmount / people.length;

    // 计算净付款（超付 or 欠款）
    const sortedPeople = [...people].sort((a, b) => payments[a] - payments[b]);
    const sortedValuesPaid = sortedPeople.map(person => payments[person] - meanAmount);

    let i = 0;
    let j = sortedPeople.length - 1;
    const transactions: Transaction[] = [];

    //
    while (i < j) {
        const debt = Math.min(-sortedValuesPaid[i], sortedValuesPaid[j]);
        sortedValuesPaid[i] += debt;
        sortedValuesPaid[j] -= debt;

        transactions.push({
            from: sortedPeople[i],
            to: sortedPeople[j],
            amount: parseFloat(debt.toFixed(2)) // 保留两位小数
        });

        if (sortedValuesPaid[i] === 0) i++;
        if (sortedValuesPaid[j] === 0) j--;
    }

    return transactions;
}
