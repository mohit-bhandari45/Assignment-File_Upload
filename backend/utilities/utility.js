const validateFileData = (sheets) => {
    const errors = [];

    Object.keys(sheets).forEach((sheetName) => {
        let sheet = sheets[sheetName];
        sheet = sheet.slice(1); // Skip header row

        // Ensure that the sheet is not empty and that the header row is defined
        const header = sheet[0];
        if (!header || header.length === 0) {
            errors.push({
                sheet: sheetName,
                message: "Sheet has no valid header row.",
            });
            return; // Skip further validation for this sheet
        }

        // Validate the header row for expected column names
        const expectedColumns = ["Name", "Amount", "Date", "Verified"];
        const missingColumns = expectedColumns.filter(col => !header.includes(col));

        if (missingColumns.length > 0) {
            errors.push({
                sheet: sheetName,
                message: `Missing expected columns: ${missingColumns.join(", ")}`
            });
        }

        sheet.forEach((row, rowIndex) => {
            if (!row || row.length === 0) {
                return; // Skip empty rows
            }

            const [Name, Amount, DateValue, Verified] = row;

            // Check for missing required columns
            if (!Name || Amount === undefined || DateValue === undefined) {
                errors.push({
                    sheet: sheetName,
                    row: rowIndex + 1,
                    message: "Missing required columns (Name, Amount, Date)",
                });
            }

            // Check if Amount is a positive number
            if (Amount !== undefined && (isNaN(Amount) || Amount <= 0)) {
                errors.push({
                    sheet: sheetName,
                    row: rowIndex + 1,
                    message: "Amount should be a positive number.",
                });
            }

            // Convert Excel serial date to JavaScript Date
            let date;
            if (typeof DateValue === "number") {
                date = new Date((DateValue - 25569) * 86400 * 1000);
            } else if (typeof DateValue === "string") {
                date = new Date(DateValue);
            } else {
                date = new Date(DateValue);
            }

            // Check if Date is valid and within the current month
            const currentMonth = new Date().getMonth();
            if (isNaN(date.getTime()) || date.getMonth() !== currentMonth) {
                errors.push({
                    sheet: sheetName,
                    row: rowIndex + 1,
                    message: "Date must be valid and within the current month",
                });
            }

            // Check if Verified is either "Yes" or "No"
            if (Verified !== "Yes" && Verified !== "No") {
                errors.push({
                    sheet: sheetName,
                    row: rowIndex + 1,
                    message: "Verified column must be either 'Yes' or 'No'",
                });
            }

            // Handle any additional invalid data (e.g., unexpected columns or malformed data)
            if (row.length > expectedColumns.length) {
                errors.push({
                    sheet: sheetName,
                    row: rowIndex + 1,
                    message: "Row contains extra columns or malformed data.",
                });
            }

            // Further validation could be added here for specific columns if needed
        });
    });

    return errors;
};

module.exports = { validateFileData };
