/*
  ================================================================
  File Operations Helper - Utility Functions for File and Data Operations
  ================================================================

  Author: Dipen Chavan (hexdee606)
  Version: 0.0.1
  Last Modified: 2025-03-16
  Description: This class provides various utility methods for working with
               files and data. It includes functions for file operations
               such as deleting directories, formatting values, and handling
               strings, numbers, and JSON data.

               The class also provides methods for handling Gherkin tables,
               formatting currency, and performing other utility operations
               like rounding numbers, truncating strings, and parsing integers.

  ================================================================
*/

import {existsSync, readdirSync, rmdirSync, statSync, unlinkSync} from 'fs';
import * as path from 'path';

interface Table {
    rawTable: any[][];
}

interface RowData {
    [key: string]: any;
}

class FileOperationsHelper {
    /**
     * Recursively deletes a directory and its contents.
     * @param {string} directoryPath - The directory to delete.
     */
    async deleteDirectory(directoryPath: string): Promise<void> {
        if (!existsSync(directoryPath)) {
            console.error(`Directory not found: ${directoryPath}`);
            return;
        }

        const files = readdirSync(directoryPath);
        for (const file of files) {
            const fullPath = path.join(directoryPath, file);
            const stat = statSync(fullPath);
            if (stat.isDirectory()) {
                await this.deleteDirectory(fullPath);
            } else {
                unlinkSync(fullPath);
            }
        }
        rmdirSync(directoryPath);
    }

    /**
     * Replaces all occurrences of a term in a string with a replacement.
     * @param {string} inputString - The original string.
     * @param {string} searchTerm - The term to replace.
     * @param {string} replacementTerm - The replacement term.
     * @returns {string} The modified string.
     */
    async replaceAllOccurrences(inputString: string, searchTerm: string, replacementTerm: string): Promise<string> {
        return inputString.split(searchTerm).join(replacementTerm);
    }


    /**
     * Converts an epoch timestamp to a human-readable date string using native Date.
     * @param {number} epochTimestamp - The epoch timestamp.
     * @returns {string} The formatted date string.
     */
    async formatEpochToDate(epochTimestamp: number): Promise<string> {
        const date = new Date(epochTimestamp);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }

    /**
     * Rounds a number to a specified number of decimal places and formats it.
     * @param {number} number - The number to round.
     * @param {number} decimalPlaces - The number of decimal places.
     * @returns {string} The formatted number as a string.
     */
    async roundToDecimalPlaces(number: number, decimalPlaces: number): Promise<string> {
        if (isNaN(number) || decimalPlaces < 0) {
            console.error('Invalid input. Please provide valid numbers for value and decimal places.');
            return '';
        }

        const roundedNumber = number.toFixed(decimalPlaces);
        return new Intl.NumberFormat('en-US', {
            minimumFractionDigits: decimalPlaces,
            maximumFractionDigits: decimalPlaces
        }).format(parseFloat(roundedNumber));
    }

    /**
     * Checks if a value is within a specified range.
     * @param {number} value - The value to check.
     * @param {number} minValue - The minimum value in the range.
     * @param {number} maxValue - The maximum value in the range.
     * @returns {boolean} True if the value is within the range, false otherwise.
     * @throws {Error} Throws an error if the value is out of range.
     */
    async isValueInRange(value: number, minValue: number, maxValue: number): Promise<boolean> {
        if (value < minValue || value > maxValue) {
            throw new Error(`Value (${value}) is not between ${minValue} and ${maxValue}.`);
        }
        console.log(`Value (${value}) is between ${minValue} and ${maxValue}.`);
        return true;
    }

    /**
     * Calculates the minimum and maximum values based on a given percentage range of a value.
     * @param {number} value - The base value.
     * @param {number} percentage - The percentage range to calculate the min and max values.
     * @returns {Object} An object containing the minimum and maximum values.
     */
    async calculateMinAndMaxBasedOnPercentage(value: number, percentage: number): Promise<{
        min: number | null,
        max: number | null
    }> {
        if (percentage < 0) {
            console.error('Invalid input. Please provide valid numbers for value and percentage.');
            return {min: null, max: null};
        }
        const percentageDecimal = percentage / 100;
        return {
            min: Math.round(value - (percentageDecimal * value)),
            max: Math.round(value + (percentageDecimal * value))
        };
    }

    /**
     * Trims a string to a specified length, optionally adding an ellipsis if the string is too long.
     * @param {string} inputString - The string to trim.
     * @param {number} length - The maximum length of the string.
     * @param {boolean} [addEllipsis=false] - Whether to add an ellipsis if the string exceeds the maximum length.
     * @returns {string} The trimmed string.
     */
    async truncateStringWithEllipsis(inputString: string, length: number, addEllipsis: boolean = false): Promise<string> {
        if (length < 0) {
            console.error('Invalid input. Please provide a valid string and length.');
            return '';
        }
        const truncated = inputString.length > length ? inputString.slice(0, length) : inputString;
        return addEllipsis && truncated.length < inputString.length ? `${truncated}...` : truncated;
    }

    /**
     * Transforms a Gherkin table into an array of objects, where each row is represented as an object with column headers as keys.
     * @param {Table} table - The Gherkin table object containing raw table data.
     * @returns {Array<RowData>} An array of objects representing rows from the table.
     */
    async convertTableToObjectArray(table: Table): Promise<RowData[]> {
        if (!table || !table.rawTable || table.rawTable.length === 0) {
            console.error('Invalid table format.');
            return [];
        }

        const rawTable = table.rawTable;
        const headers = rawTable[0];
        const rows = rawTable.slice(1);

        return rows.map((row) => {
            const rowData: RowData = {};
            row.forEach((value, index) => {
                rowData[headers[index]] = value;
            });
            return rowData;
        });
    }

    /**
     * Rounds a number to the nearest integer, or to one decimal place if the number is zero.
     * @param {number} number - The number to round.
     * @returns {string} The rounded number as a string.
     */
    async roundToNearestIntegerOrDecimal(number: number): Promise<number | string> {
        let rounded = Math.round(number);
        return rounded === 0 ? parseFloat(number.toFixed(1)) : rounded.toLocaleString('en-US', {maximumFractionDigits: 0});
    }

    /**
     * Capitalizes the first letter of a string and converts the rest of the string to lowercase.
     * @param {string} inputString - The string to capitalize.
     * @returns {Promise<string>} The capitalized string.
     */
    async capitalizeFirstLetter(inputString: string): Promise<string> {
        return inputString.charAt(0).toUpperCase() + inputString.slice(1).toLowerCase();
    }

    /**
     * Formats a value as currency using the built-in `Intl.NumberFormat` for currency.
     * @param {number} amount - The amount to format.
     * @param {string} [currencyCode='USD'] - The currency code (default is USD).
     * @returns {string} The formatted currency string.
     */
    async formatCurrency(amount: number, currencyCode: string = 'USD'): Promise<string> {
        const formatter = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currencyCode
        });
        return formatter.format(amount);
    }

    /**
     * Parses an integer from a string and returns it as a native JavaScript number.
     * @param {string} value - The value to parse.
     * @returns {number} The parsed integer.
     */
    async parseInteger(value: string): Promise<number> {
        return parseInt(value, 10);
    }

    /**
     * Reads a JSON file and returns its contents as a JavaScript object.
     * @param {string} filePath - The path to the JSON file.
     * @returns {Promise<any>} The parsed JSON data.
     */
    async readJsonFile(filePath: string): Promise<any> {
        return await import(filePath);
    }
}

export default new FileOperationsHelper();
