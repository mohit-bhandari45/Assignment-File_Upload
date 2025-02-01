const express = require("express");
const multer = require("multer");
const xlsx = require("xlsx");
const { validateFileData } = require("../utilities/utility");
const Data = require("../models/Data");
const moment = require("moment");

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
    storage,
    limits: {
        fileSize: 2 * 1024 * 1024,
    },
}).single("file");

const excelSerialDateToJSDate = (serial) => {
    const utcDays = Math.floor(serial - 25569);
    const utcValue = utcDays * 86400;
    return new Date(utcValue * 1000);
};

router.post("/upload", upload, (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
    }

    try {
        const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
        const sheets = {};

        workbook.SheetNames.forEach((sheetName) => {
            const sheet = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1 });
            if (sheet.length > 0) {
                const header = sheet[0];
                const dateColumnIndex = header.indexOf("Date");

                if (dateColumnIndex !== -1) {
                    for (let i = 1; i < sheet.length; i++) {
                        const row = sheet[i];
                        const dateValue = row[dateColumnIndex];

                        if (typeof dateValue === "number") {
                            row[dateColumnIndex] = excelSerialDateToJSDate(dateValue);
                        } else if (typeof dateValue === "string") {
                            row[dateColumnIndex] = new Date(dateValue);
                        }
                    }
                }

                sheets[sheetName] = sheet;
            }
        });

        console.log(sheets);

        const errors = validateFileData(sheets);

        if (errors.length > 0) {
            return res.send({ sheets: sheets, errors: errors });
        }

        res.status(200).json({ sheets: sheets, errors: [] });
    } catch (err) {
        console.error("Error reading file:", err);
        res.status(500).send({ error: "Failed to process the file." });
    }
});

router.post("/import", async (req, res) => {
    const sheets = req.body;
    let allValidRows = [];
    let allSkippedRows = [];

    for (const [sheetName, rows] of Object.entries(sheets)) {
        let validRows = [];
        let skippedRows = [];

        rows.forEach((row, index) => {
            const [name, amount, date, verified] = row;

            // Validation checks
            const isValidName = name && typeof name === 'string' && name.trim() !== '';
            const isValidAmount = !isNaN(amount) && amount !== null && amount !== '';
            const isValidDate = date ? moment(date).isValid() : false;
            const isValidVerified = ['Yes', 'No', 'Maybe'].includes(verified);

            if (isValidName && isValidAmount && isValidDate && isValidVerified) {
                validRows.push({
                    name,
                    amount: parseFloat(amount),
                    date: moment(date).toDate(),
                    verified,
                });
            } else {
                skippedRows.push(index);
            }
        });

        allValidRows = [...allValidRows, ...validRows];
        allSkippedRows = [...allSkippedRows, ...skippedRows];

        try {
            if (validRows.length > 0) {
                await Data.insertMany(validRows);
            }
        } catch (error) {
            console.error(`Failed to import data for ${sheetName}:`, error);
        }
    }

    res.status(200).json({
        message: 'Data imported successfully!',
        skippedRows: allSkippedRows,
        validRows: allValidRows.length,
    });
});


module.exports = router;