export const formattedToMYR = (amount: number) => {
    const formatted = new Intl.NumberFormat("ms-MY", {
        style: "currency",
        currency: "MYR",
    }).format(amount);
    return formatted;
}