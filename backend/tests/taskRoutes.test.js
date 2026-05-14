import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const app = require('../src/app');
const db = require('../src/db/connection');
const initializeDatabase = require('../src/db/init');

describe('Task Routes', () => {
  beforeAll(() => {
    // Ensure DB schema exists before tests
    initializeDatabase();
  });

  afterAll(() => {
    // Clean up test data
    db.exec('DELETE FROM tasks');
  });

  describe('POST /api/tasks', () => {
    it('should return 400 when title is missing', async () => {
      const res = await request(app)
        .post('/api/tasks')
        .send({ description: 'No title provided' });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('should return 400 when title is empty string', async () => {
      const res = await request(app)
        .post('/api/tasks')
        .send({ title: '   ' });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('should return 201 when creating a valid task', async () => {
      const res = await request(app)
        .post('/api/tasks')
        .send({ title: 'Test Task', description: 'A test description' });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toMatchObject({
        title: 'Test Task',
        description: 'A test description',
        status: 'pending',
      });
      expect(res.body.data.id).toBeDefined();
    });
  });

  describe('GET /api/tasks', () => {
    it('should return 200 and an array of tasks', async () => {
      const res = await request(app).get('/api/tasks');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });
  });

  describe('DELETE /api/tasks/:id', () => {
    it('should return 404 for a non-existent task', async () => {
      const res = await request(app).delete('/api/tasks/99999');

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('NOT_FOUND');
    });
  });
});
