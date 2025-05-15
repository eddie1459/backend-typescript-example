import express from 'express';
import fs from 'fs';
import csv from 'csv-parser';

export const app = express();
let data: Record<string, string>[] = [];

export function loadCSV(filePath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const results: Record<string, string>[] = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (row) => results.push(row))
      .on('end', () => {
        data = results;
        resolve();
      })
      .on('error', reject);
  });
}

export function setTestData(testData: Record<string, string>[]) {
  data = testData;
}

function computeValueCounts(column: string): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const row of data) {
    const value = row[column];
    counts[value] = (counts[value] || 0) + 1;
  }
  return counts;
}

app.get('/histogram/:column', (req, res) => {
  const column = req.params.column;

  if (!data.length || !(column in data[0])) {
    return res.status(404).send(`<h1>Column '${column}' not found.</h1>`);
  }

  const counts = computeValueCounts(column);
  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  const html = `
    <html><body>
    <h1>Value Counts for "${column}"</h1>
    <ul>
    ${sorted.map(([val, count]) => `<li><strong>${val}</strong>: ${count}</li>`).join('\n')}
    </ul></body></html>
  `;
  res.send(html);
});

app.get('/', (req, res) => {
  const columns = data.length ? Object.keys(data[0]) : [];
  const links = columns.map(col => `<li><a href="/histogram/${col}">${col}</a></li>`).join('');
  res.send(`<h1>Available Columns</h1><ul>${links}</ul>`);
});