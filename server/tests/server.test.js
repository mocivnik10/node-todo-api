const expect = require('expect');
const request = require('supertest');
const { ObjectID } = require('mongodb');

const { app } = require('./../server');
const { Todo } = require('./../models/todo');
const { User } = require('./../models/user');
const { UserRating } = require('./../models/rating');
const {
  todos,
  populateTodos,
  users,
  populateUsers,
  userRatings,
  populateRatings
} = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateTodos);
beforeEach(populateRatings);

describe('POST /todos', () => {
  it('should create a new todo', done => {
    let text = 'Test todo text';

    request(app)
      .post('/api/v1/todos')
      .set('x-auth', users[0].tokens[0].token)
      .send({ text })
      .expect(200)
      .expect(res => {
        expect(res.body.text).toBe(text);
      })
      .end(async (err, res) => {
        if (err) {
          return done(err);
        }

        try {
          let todos = await Todo.find({ text });
          expect(todos.length).toBe(1);
          expect(todos[0].text).toBe(text);
          done();
        } catch (e) {
          done(e);
        }
      });
  });

  it('should not create todo with invalid body data', done => {
    request(app)
      .post('/api/v1/todos')
      .set('x-auth', users[0].tokens[0].token)
      .send({})
      .expect(400)
      .end(async (err, res) => {
        if (err) {
          return done(err);
        }

        try {
          await Todo.find();
          expect(todos.length).toBe(2);
          done();
        } catch (e) {
          done(e);
        }
      });
  });
});

describe('GET /todos', () => {
  it('should list all todos', done => {
    request(app)
      .get('/api/v1/todos')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect(res => {
        expect(res.body.todos.length).toBe(1);
      })
      .end(done);
  });
});

describe('GET /todos/:id', () => {
  it('should return todo', done => {
    request(app)
      .get(`/api/v1/todos/${todos[0]._id.toHexString()}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect(res => {
        expect(res.body.todo.text).toBe(todos[0].text);
      })
      .end(done);
  });

  it('should not return todo created by other user', done => {
    request(app)
      .get(`/api/v1/todos/${todos[1]._id.toHexString()}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end(done);
  });

  it('should return 404 if todo not found', done => {
    let hexId = new ObjectID().toHexString();

    request(app)
      .get(`/api/v1/todos/${hexId}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end(done);
  });

  it('should return 404 for non-object ids', done => {
    request(app)
      .get('/api/v1/todos/123abc')
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end(done);
  });
});

describe('DELETE /todos/:id', () => {
  it('should remove a todo', done => {
    let hexId = todos[1]._id.toHexString();

    request(app)
      .delete(`/api/v1/todos/${hexId}`)
      .set('x-auth', users[1].tokens[0].token)
      .expect(200)
      .expect(res => {
        expect(res.body.todo._id).toBe(hexId);
      })
      .end(async (err, res) => {
        if (err) {
          return done(err);
        }

        try {
          let todo = await Todo.findById(hexId);
          expect(todo).toBeFalsy();
          done();
        } catch (e) {
          done(e);
        }
      });
  });

  it('should return 404 if todo not found', done => {
    let hexId = new ObjectID().toHexString();

    request(app)
      .delete(`/api/v1/todos/${hexId}`)
      .set('x-auth', users[1].tokens[0].token)
      .expect(404)
      .end(done);
  });

  it('should return 404 if object id is invalid', done => {
    request(app)
      .delete('/api/v1/todos/123abc')
      .set('x-auth', users[1].tokens[0].token)
      .expect(404)
      .end(done);
  });
});

describe('PATCH /todos/:id', () => {
  it('should update the todo', done => {
    let hexId = todos[0]._id.toHexString();
    let text = 'This should be the new text';

    request(app)
      .patch(`/api/v1/todos/${hexId}`)
      .set('x-auth', users[0].tokens[0].token)
      .send({
        completed: true,
        text
      })
      .expect(200)
      .expect(res => {
        expect(res.body.todo.text).toBe(text);
        expect(res.body.todo.completed).toBe(true);
        // expect(Number.isInteger(res.body.todo.completedAt)).toBe(true);
        expect(typeof res.body.todo.completedAt).toBe('number');
      })
      .end(done);
  });

  it('should not update the todo created by other user', done => {
    let hexId = todos[0]._id.toHexString();
    let text = 'This should be the new text';

    request(app)
      .patch(`/api/v1/todos/${hexId}`)
      .set('x-auth', users[1].tokens[0].token)
      .send({
        completed: true,
        text
      })
      .expect(404)
      .end(done);
  });

  it('should clear completedAt when todo is not completed', done => {
    let hexId = todos[1]._id.toHexString();
    let text = 'This should be the new text!!';

    request(app)
      .patch(`/api/v1/todos/${hexId}`)
      .set('x-auth', users[1].tokens[0].token)
      .send({
        completed: false,
        text
      })
      .expect(200)
      .expect(res => {
        expect(res.body.todo.text).toBe(text);
        expect(res.body.todo.completed).toBe(false);
        expect(res.body.todo.completedAt).toBeFalsy();
      })
      .end(done);
  });
});

describe('GET /users/me', () => {
  it('should return user if authenticated', done => {
    request(app)
      .get('/api/v1/users/me')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect(res => {
        expect(res.body._id).toBe(users[0]._id.toHexString());
        expect(res.body.email).toBe(users[0].email);
      })
      .end(done);
  });

  it('should return 404 if not authenticated', done => {
    request(app)
      .get('/api/v1/users/me')
      .expect(404)
      .expect(res => {
        expect(res.body).toEqual({});
      })
      .end(done);
  });
});

describe('POST /users', () => {
  it('should create a user', done => {
    let email = 'test@email.com';
    let password = '123abc!';

    request(app)
      .post('/api/v1/users')
      .send({ email, password })
      .expect(200)
      .expect(res => {
        expect(res.headers['x-auth']).toBeTruthy();
        expect(res.body._id).toBeTruthy();
        expect(res.body.email).toBe(email);
      })
      .end(async err => {
        if (err) {
          return done(err);
        }

        try {
          let user = await User.findOne({ email });
          expect(user).toBeTruthy();
          expect(user.password).not.toEqual(password);
          done();
        } catch (e) {
          done(e);
        }
      });
  });

  it('should return validation errors if request invalid', done => {
    let email = 'iztok@123example.com';
    let password = 'abc';

    request(app)
      .post('/api/v1/users')
      .send({ email, password })
      .expect(400)
      .end(done);
  });

  it('should not create user if email in use', done => {
    let email = users[0].email;
    let password = '123abc!';

    request(app)
      .post('/api/v1/users')
      .send({ email, password })
      .expect(400)
      .end(done);
  });
});

describe('POST /users/login', () => {
  it('should login user and return auth token', done => {
    let email = users[1].email;
    let password = users[1].password;

    request(app)
      .post('/api/v1/users/login')
      .send({ email, password })
      .expect(200)
      .expect(res => {
        expect(res.headers['x-auth']).toBeTruthy();
      })
      .end(async (err, res) => {
        if (err) {
          return done(err);
        }

        try {
          let user = await User.findById(users[1]._id);
          expect(user.tokens[1]).toMatchObject({
            access: 'auth',
            token: res.headers['x-auth']
          });
          done();
        } catch (e) {
          done(e);
        }
      });
  });

  it('should reject invalid login', done => {
    let email = users[1].email;
    let password = users[1].password + '123';

    request(app)
      .post('/api/v1/users/login')
      .send({ email, password })
      .expect(400)
      .expect(res => {
        expect(res.headers['x-auth']).toBeFalsy();
      })
      .end(async (err, res) => {
        if (err) {
          return done(err);
        }

        try {
          let user = await User.findById(users[1]._id);
          expect(user.tokens.length).toBe(1);
          done();
        } catch (e) {
          done(e);
        }
      });
  });
});

describe('DELETE /users/me/token', () => {
  it('should remove auth token on logout', done => {
    request(app)
      .delete('/api/v1/users/me/token')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .end(async (err, res) => {
        if (err) {
          return done(err);
        }

        try {
          let user = await User.findById(users[0]._id);
          expect(user.tokens.length).toBe(0);
          done();
        } catch (e) {
          done(e);
        }
      });
  });
});

describe('PATCH /users/me/update-password', () => {
  it('should update user password', done => {
    let newPass = 'newhardpass';
    let passConf = 'newhardpass';
    users[0].password = newPass;

    request(app)
      .patch('/api/v1/users/me/update-password')
      .set('x-auth', users[0].tokens[0].token)
      .send({
        password: newPass,
        confirmationpass: passConf
      })
      .expect(200)
      .end(done);
  });

  it('should not update password', done => {
    let newPass = 'newhardpass';
    let passConf = 'abc';
    users[0].password = newPass;

    request(app)
      .put('/api/v1/users/me/update-password')
      .set('x-auth', users[0].tokens[0].token)
      .send({
        password: newPass,
        confirmationpass: passConf
      })
      .expect(404)
      .end(done);
  });
});

describe('GET /users/:id', () => {
  it('should return user', done => {
    request(app)
      .get(`/api/v1/users/${users[0]._id.toHexString()}`)
      .expect(200)
      .expect(res => {
        expect(res.body.email).toBe(todos[0].email);
      })
      .end(done);
  });

  it('should return 404 if user not found', done => {
    let hexId = new ObjectID().toHexString();

    request(app)
      .get(`/users/${hexId}`)
      .expect(404)
      .end(done);
  });

  it('should return 404 for non-object ids', done => {
    request(app)
      .get('/api/v1/users/123abc')
      .expect(404)
      .end(done);
  });
});

describe('POST /users/:id/like', () => {
  it('should create new rating', done => {
    request(app)
      .post(`/api/v1/users/${users[0]._id.toHexString()}/like`)
      .set('x-auth', users[1].tokens[0].token)
      .send({
        _user: users[1]._id
      })
      .expect(200)
      .end(done);
  });

  it('should return 400 for existing rating', done => {
    request(app)
      .post(`/api/v1/users/${users[1]._id.toHexString()}/like`)
      .set('x-auth', users[0].tokens[0].token)
      .send({
        _user: users[0]._id
      })
      .expect(400)
      .end(done);
  });

  it('should return 404 for non-object ids', done => {
    request(app)
      .post(`/api/v1/users/abc123/like`)
      .expect(404)
      .end(done);
  });
});

describe('DELETE /users/:id/unlike', () => {
  it('should remove the rating', done => {
    request(app)
      .delete(`/api/v1/users/${users[1]._id.toHexString()}/unlike`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .end(done);
  });

  it('should return 404 if rating not found', done => {
    request(app)
      .delete(`/api/v1/users/${users[0]._id.toHexString()}/unlike`)
      .set('x-auth', users[1].tokens[0].token)
      .expect(404)
      .end(done);
  });
});

describe('GET /most-liked', () => {
  it('should list​ ​users​ ​in​ ​a​ ​most​ ​liked​ ​to​ ​least​ ​liked', done => {
    request(app)
      .get('/api/v1/most-liked')
      .expect(200)
      .expect(res => {
        expect(res.body.users.length).toBe(1);
      })
      .end(done);
  });
});
