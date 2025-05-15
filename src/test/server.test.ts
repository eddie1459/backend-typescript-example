import request from 'supertest';
import { app, setTestData } from '../server';

describe('Histogram API', () => {
  beforeEach(() => {
    setTestData([
      { Commodity: 'Rice', Year: '2021' },
      { Commodity: 'Corn', Year: '2021' },
      { Commodity: 'Rice', Year: '2022' },
    ]);
  });

  it('should return value counts for a valid column', async () => {
    const res = await request(app).get('/histogram/Commodity');
    expect(res.status).toBe(200);
    expect(res.text).toContain('<strong>Rice</strong>: 2');
    expect(res.text).toContain('<strong>Corn</strong>: 1');
  });

  it('should return 404 for a nonexistent column', async () => {
    const res = await request(app).get('/histogram/Unknown');
    expect(res.status).toBe(404);
    expect(res.text).toContain("Column 'Unknown' not found.");
  });

  it('should list available columns on root', async () => {
    const res = await request(app).get('/');
    expect(res.status).toBe(200);
    expect(res.text).toContain('<a href="/histogram/Commodity">');
    expect(res.text).toContain('<a href="/histogram/Year">');
  });
});
