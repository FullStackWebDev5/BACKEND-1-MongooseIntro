const express = require('express')
const bodyParser = require('body-parser')
const dotenv = require('dotenv')
dotenv.config()
const mongoose = require('mongoose');

const app = express()

app.use(bodyParser.urlencoded())
app.use(bodyParser.json())

// const studentSchema = new mongoose.Schema({
//   firstName: String,
//   lastName: String,
//   age: Number,
// })

const studentSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
    minLength: [3, 'First name must be at least 3 characters'],
    maxLength: [10, 'First name can not exceed 10 characters']
  },
  lastName: {
    type: String,
    default: 'N/A'
  },
  age: {
    type: Number,
    required: [true, 'Age is required'],
    min: [18, 'You need to be atleast 18 years old'],
    max: [25, 'You need to be 25 years old or lesser']
  },
  country: {
    type: String,
    required: [true, 'Country is required'],
    enum: {
      values: ['India', 'USA', 'UK'],
      message: `We don't operate in {VALUE}. Please select a country from India, USA or UK.`,
    }
  },
  hobbies: [String],
  address: {
    city: String,
    state: String,
    country: String,
    zipCode: Number
  }
})

const Student = mongoose.model('Student', studentSchema)

app.get('/', (req, res) => {
  res.send('Server is up :)')
})

/*
  # READ Operation
    - HTTP Method: GET
    - Mongoose method: Model.find()
*/
app.get('/students', async (req, res) => {
  try {
    const students = await Student.find()
    res.json({
      status: 'SUCCESS',
      data: students
    })
  } catch(error) {
    console.log(error)
    res.status(500).json({
      status: 'FAILED',
      message: 'Error fetching students',
      error: error.message
    })
  }
})

/*
  # CREATE Operation
    - HTTP Method: POST
    - Mongoose method: Model.create()
*/
app.post('/students', async (req, res) => {
  try {
    const { firstName, lastName, age, country, hobbies, address } = req.body

    const result = await Student.create({
      firstName,
      lastName,
      age,
      country,
      hobbies,
      address
    })

    res.status(201).json({
      status: 'SUCCESS',
      message: 'New student added successfully',
      result
    })
  } catch(error) {
    console.log(error)
    res.status(500).json({
      status: 'FAILED',
      message: 'Error creating students',
      error: error.message
    })
  }
})

/*
  # UPDATE Operation
    - HTTP Method: PATCH
    - Mongoose method: Model.findByIdAndUpdate()
*/

app.patch('/students/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { firstName, lastName, age, country, hobbies, address } = req.body

    const result = await Student.findByIdAndUpdate(id, {
      firstName,
      lastName,
      age,
      country,
      hobbies,
      address
    })

    res.json({
      status: 'SUCCESS',
      message: 'Student details updated successfully',
      result
    })
  } catch(error) {
    console.log(error)
    res.status(500).json({
      status: 'FAILED',
      message: 'Error updating student details',
      error: error.message
    })
  }
})

/*
  # DELETE Operation
    - HTTP Method: DELETE
    - Mongoose method: Model.findByIdAndDelete()
*/
app.delete('/students/:id', async (req, res) => {
  try {
    const { id } = req.params

    const result = await Student.findByIdAndDelete(id)

    res.json({
      status: 'SUCCESS',
      message: 'Student deleted successfully',
      result
    })
  } catch(error) {
    console.log(error)
    res.status(500).json({
      status: 'FAILED',
      message: 'Error deleting student',
      error: error.message
    })
  }
})

app.listen(3000, () => {
  mongoose.connect(process.env.MONGODB_URL)
    .then(() => console.log('Server is ready to use ✅'))
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
      - Schema(): Contsructor for creating schema objects
        - Syntax:
          new Schema({
            property1: DataType1,
            property2: DataType2,
            ...
          })
        - Constraints/Validations
          - All data types
            - required: Specify a field as required
            - default: Set a default value for the field if input value is not provided
          - Number:
            - min: Minimum Value
            - max: Maximum Value
          - String:
            - minLength: Minimum Length
            - maxLength: Maximum Length
            - enum: Provide an array of all accepted values
            - lowercase: Convert value to lowercase before saving
            - uppercase: Convert value to uppercase before saving
            - trim: Remove spaces around the value before saving

          - Syntax:
            new Schema({
              property1: {
                type: DataType1,
                constraint: value
              },
              ...
            })
          - Additional notes:
            - {VALUE}: is replaced with the value being validated by Mongoose
      - model(): Creating models from schema objects
        - Syntax: const Model = mongoose.model('Model', schemaObject)
          - It returns a reference to the mongoose model
          - Rules about naming mongoose model
            - Mongoose model name: Singular form, PascalCase
            - MongoDB collection name: Plural form, lowercase
              - Example:
                - Model: 'Student', Collection: 'students'
                - Model: 'Post', Collection: 'posts'
      - CRUD operations
        - READ
          - Model.find(): Returns documents from a collection
            - Syntax: await Model.find()
            - A query can be added to filter documents
              - Syntax: await Model.find({ property1: value1 })
          - Model.findOne(): Return the first document from the collection which matches the query
            - Syntax: await Model.findOne()
            - A query can be added to filter documents
              - Syntax: await Model.findOne({ property1: value1 })
          - Model.findById('id'): Return the document with the given ID
            - Syntax: await Model.findById('id)
        - CREATE
          - Model.create(): Adds document(s) to the collection
            - Insert single document syntax:
              await Model.create({ property1: value1 });
            - Insert multiple documents syntax:
              await Model.create([{ property1: value1 }, { property2: value2 }, ...]);
          - Model() constructor and Model.save()
            - Create a new object using the Model constructor
              - Syntax: const newObj = new Model({ property1: value1, property2: value2, ... })
            - newObj.save() to save the document in the database
        - UPDATE
          - Model.findByIdAndUpdate(): First find the document with given id and then update based on the values provided
            - Syntax: const result = await Model.findByIdAndUpdate('id', { property1: value1, property2: value2, ...})
              - 'result' will be the document before being updated
          - Model.findOne() and Model.save(): First find the document with given query and then update the object, finally save the object using .save() method
        - DELETE
          - Model.findByIdAndDelete(): First find the document with given id and then delte it from the collection
            - Syntax: const result = await Model.findByIdAndDelete('id')
               - The deleted document will be returned as the result
          - Model.deleteOne({ query }): Similar to deleteOne method of mongodb package
          - Model.deleteMany({ query }): Similar to deleteMany method of mongodb package

    
    - Additional notes:
      - Validations and constraints are majorly for create and update operations. But, whenever existing invalid data is fetched, mongoose will skip all the fields which do not follow the schema
      - Some more validation examples:
          collegeOfGraduation: {
            type: String,
            required: [
              function() {
                return this.age >= 21
              },
              'Graduation college information is required for students of age 21 and greater'
            ]
          }

    - Documentation:
      - https://mongoosejs.com/docs/guide.html
        - Validations: https://mongoosejs.com/docs/validation.html
      - https://www.geeksforgeeks.org/mongoose-tutorial/?ref=header_ind
*/