const express = require('express')
const bodyParser = require('body-parser')
const dotenv = require('dotenv')
dotenv.config()
const mongoose = require('mongoose');

const app = express()

app.use(bodyParser.urlencoded())
app.use(bodyParser.json())

const studentSchema = new mongoose.Schema({
  firstName: String,
  lastName: String
})

const Student = mongoose.model('Student', studentSchema)

app.get('/', (req, res) => {
  res.send('Server is up :)')
})

// READ: GET /students | .find()
app.get('/students', async (req, res) => {
  try {
    const students = await Student.find()
    res.json({
      status: 'SUCCESS',
      data: students
    })
  } catch(error) {
    res.status(500).json({
      status: 'FAILED',
      message: 'Error fetching students'
    })
  }
})

// CREATE: POST /students | .create()
app.post('/students', async (req, res) => {
  try {
    await Student.create({ firstName: 'Lakshya', lastName: 'Kumar' })
    res.json({
      status: 'SUCCESS',
      message: 'New student added successfully'
    })
  } catch(error) {
    console.log(error)
    res.status(500).json({
      status: 'FAILED',
      message: 'Error creating students'
    })
  }
})

app.listen(3000, () => {
  mongoose.connect(process.env.MONGODB_URL)
    .then(() => console.log('Server is ready ro use ✅'))
    .catch((error) => console.error('DB connection error', error))
})


/*
  # Mongoose: 
    - Object Data Modeling (ODM) library for MongoDB and Node.js
    - It provides a structured way to interact with your MongoDB database, making it easier to work with data and perform database operations using JavaScript.
    - Need for Mongoose
      - Structured data model
      - Data validation
      - Working with relationships becomes easy (population)
    - Schema: A blueprint that defines the structure and constraints of documents within a MongoDB collection
    - Reference Image: https://files.codingninjas.in/article_images/introduction-to-mongoose-0-1638899576.webp
    
    - Methods:
      - connect(): Connect Nodejs server to MongoDB
      - Schema(): Creating schema objects
      - model(): Creating models from schema objects
        - Syntax: const Model = mongoose.model('Model', schemaObject)
          - It returns a reference to the mongoose model
          - Rules about naming mongoose model
            - Mongoose model name: Singular form, PascalCase
            - MongoDB collection name: Plural form, lowercase
              - Example:
                - Model: 'Student', Collection: 'students'
                - Model: 'Post', Collection: 'posts'
      - find(): Returns documents from a collection
        - Syntax: await Model.find()
        - A query can be added to filter documents
          - Syntax: await Model.find({ property1: value1 })
      - create(): Add a new document to the collection
        - Insert single document syntax:    await Character.create({ property1: value1 });
        - Insert multiple documents syntax: await Character.create([{ property1: value1 }, { property2: value2 }, ...]);

    - Documentation:
      - https://mongoosejs.com/docs/guide.html
      - https://www.geeksforgeeks.org/mongoose-tutorial/?ref=header_ind
*/