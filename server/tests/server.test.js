const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb')

const {app} = require('./../server');
const {Todo} = require('./../models/todo');

const todos = [
  {text: 'First text todo'},
  {text: 'Second text todo', _id: new ObjectID('5bb74bacfa20f9aa5d56130f')}
]

beforeEach((done) => {
  Todo.deleteMany({}).then(() => {
    return Todo.insertMany(todos);
  }).then(() => done());
});

describe('POST /todos', () => {
  it('should create a new todo', (done) => {
    var text = 'Test todo text';

    request(app)
      .post('/todos')
      .send({text})
      .expect(200)
      .expect((res) => {
        expect(res.body.text).toBe(text);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.find({text}).then((todos) => {
          expect(todos.length).toBe(1);
          expect(todos[0].text).toBe(text);
          done();
        }).catch((e) => {
          done(e)
        })
      })
  })

  it('should not create todo with invalid body data', (done) => {
    request(app)
      .post('/todos')
      .send({})
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.find().then((todos) => {
          expect(todos.length).toBe(2)
          done()
        }).catch((e) => done(e))
      })
  })
})

describe('GET /todos', () => {
  it('should list all todos', (done) => {
    request(app)
      .get('/todos')
      .expect(200)
      .expect((res) => {
        expect(res.body.todos.length).toBe(2)
      })
      .end(done)
  })
})

describe('GET /todos/:id', () => {
  it('should return todo: Second text todo', (done) => {
    request(app)
    .get(`/todos/${todos[1]._id}`)
    .expect(200)
    .end((err, res) => {
      if (err) {
        return done(err)
      }
      
      Todo.findById(res.body.todo._id).then((todo) => {
        expect(todo.text).toBe('Second text todo')
        done();
      }).catch((e) => done(e))
    })
  })

  it('should return 404 because invalid object ID', (done) => {
    request(app)
    .get(`/todos/${todos[1]._id}f`)
      .expect(404)
      .end(done)
  })

  it('should return 404 because ID not found', (done) => {
    request(app)
    .get(`/todos/${todos[0]._id}`)
      .expect(404)
      .end(done)
  })
})