const VALID_STATUSES = ['todo', 'in_progress', 'done'];
const VALID_PRIORITIES = ['low', 'medium', 'high'];
const PROTECTED_UPDATE_FIELDS = ['id', 'createdAt', 'completedAt'];
const MUTABLE_UPDATE_FIELDS = ['title', 'description', 'status', 'priority', 'dueDate'];

const validateCreateTask = (body) => {
  if (!body.title || typeof body.title !== 'string' || body.title.trim() === '') {
    return 'title is required and must be a non-empty string';
  }
  if (body.status && !VALID_STATUSES.includes(body.status)) {
    return `status must be one of: ${VALID_STATUSES.join(', ')}`;
  }
  if (body.priority && !VALID_PRIORITIES.includes(body.priority)) {
    return `priority must be one of: ${VALID_PRIORITIES.join(', ')}`;
  }
  if (body.dueDate && isNaN(Date.parse(body.dueDate))) {
    return 'dueDate must be a valid ISO date string';
  }
  return null;
};

const validateUpdateTask = (body) => {
  const protectedField = PROTECTED_UPDATE_FIELDS.find((field) => body[field] !== undefined);
  if (protectedField) {
    return `${protectedField} cannot be updated`;
  }

  const invalidField = Object.keys(body).find(
    (field) => !MUTABLE_UPDATE_FIELDS.includes(field) && !PROTECTED_UPDATE_FIELDS.includes(field)
  );
  if (invalidField) {
    return `${invalidField} is not a valid task field`;
  }

  if (body.title !== undefined && (typeof body.title !== 'string' || body.title.trim() === '')) {
    return 'title must be a non-empty string';
  }
  if (body.status && !VALID_STATUSES.includes(body.status)) {
    return `status must be one of: ${VALID_STATUSES.join(', ')}`;
  }
  if (body.priority && !VALID_PRIORITIES.includes(body.priority)) {
    return `priority must be one of: ${VALID_PRIORITIES.join(', ')}`;
  }
  if (body.dueDate && isNaN(Date.parse(body.dueDate))) {
    return 'dueDate must be a valid ISO date string';
  }
  return null;
};

module.exports = { validateCreateTask, validateUpdateTask };
