export const IndianNumberFormat = (num) => {
    return new Intl.NumberFormat("en-IN", {
        maximumFractionDigits: 2,
        minimumFractionDigits: 2,
    }).format(num);
};