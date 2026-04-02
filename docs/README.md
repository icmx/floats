> [!WARNING]
> I will add some docs in this directory later (see #6) but for now this file is just a dump for random docs-related text.

## Well-formed CSV

Well-formed CSV text for currency rate per date is a specifically restricted form of CSV text format.

Files of this format are compiled on server but by architectural reasons must be validated here on client.

Format limitations:

- Includes only two columns
- First column is valid calendar date in ISO 8601 string (YYYY-MM-DD)
- Second column is decimal real number (int or float, mostly float)
- Always uses commas to separate columns
- Always uses periods in numeric values (if necessary)
- Never have heading rows (all rows are for data only)
- Never have quoted values (never uses quotation characters)
- Never have whitespace characters within fields or separators
