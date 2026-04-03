const request = require('supertest');
const app = require('../app');

describe('GET /tasks?status=todo', () => {

  beforeEach(async () => {
    await request(app).post('/tasks').send({
      title: 'Task 1',
      description: 'Todo task',
      status: 'todo',
      priority: 'low'
    });

    await request(app).post('/tasks').send({
      title: 'Task 2',
      description: 'In progress task',
      status: 'in_progress',
      priority: 'medium'
    });

    await request(app).post('/tasks').send({
      title: 'Task 3',
      description: 'Another todo',
      status: 'todo',
      priority: 'high'
    });
  });

  it('should return only tasks with status todo', async () => {
    const res = await request(app).get('/tasks?status=todo');

    expect(res.statusCode).toBe(200);

    expect(Array.isArray(res.body)).toBe(true);

    res.body.forEach(task => {
      expect(task.status).toBe('todo');
    });

    expect(res.body.length).toBeGreaterThan(0);
  });

  it('should return 400 for invalid status query', async () => {
    const res = await request(app).get('/tasks?status=invalid');

    expect(res.statusCode).toBe(400);
  });

});




describe('GET /tasks?page=1&limit=10', () => {

  beforeEach(async () => {
    for (let i = 1; i <= 15; i++) {
      await request(app).post('/tasks').send({
        title: `Task ${i}`,
        description: `Task number ${i}`,
        status: 'todo',
        priority: 'low'
      });
    }
  });

  it('should return paginated tasks with correct limit', async () => {
    const res = await request(app).get('/tasks?page=1&limit=10');

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);

    expect(res.body.length).toBeLessThanOrEqual(10);
  });

  it('should return different tasks for page 2', async () => {
    const page1 = await request(app).get('/tasks?page=1&limit=10');
    const page2 = await request(app).get('/tasks?page=2&limit=10');

    expect(page1.statusCode).toBe(200);
    expect(page2.statusCode).toBe(200);

    const idsPage1 = page1.body.map(t => t.id);
    const idsPage2 = page2.body.map(t => t.id);

    const overlap = idsPage1.some(id => idsPage2.includes(id));
    expect(overlap).toBe(false);
  });

  it('should return 400 for invalid page value', async () => {
    const res = await request(app).get('/tasks?page=-1&limit=10');

    expect(res.statusCode).toBe(400);
  });

  it('should return 400 for invalid limit value', async () => {
    const res = await request(app).get('/tasks?page=1&limit=0');

    expect(res.statusCode).toBe(400);
  });

});