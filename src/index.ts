import { app, loadCSV } from './server';
import path from 'path';

const PORT = 3000;

loadCSV(path.join(__dirname, '../data/Projection2021.csv')).then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});
