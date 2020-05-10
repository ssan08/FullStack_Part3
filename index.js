const express = require('express')
var morgan = require('morgan')
morgan.token('person', function getperson (req,res) {
  return JSON.stringify(req.body)
})

const app = express()
const cors = require('cors')

app.use(cors())


app.use(express.static('build'))
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :person'))
let persons = [
{
    name: "Arto Hellas",
    number: "040-123456",
    id: 1
  },
  {
    name: "Ada Lovelace",
    number: "39-44-5323523",
    id: 2
  },
  {
    name: "Dan Abramov",
    number: "12-43-234345",
    id: 3
  },
  {
    name: "Mary Poppendieck",
    number: "39-23-6423122",
    id: 4
  }
]

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.get('/info', (req, res) => {
  const info = `Phonebook has info for ${persons.length} people
  `
  //const info1 = info.concat()
  const info2=info.concat(new Date())
  res.json(info2)
})



app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)
  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.post('/api/persons', (request, response) => {
  const  body = request.body
  if (!body) {
    return response.status(400).json({ 
      error: 'content missing' 
    })
  }
  else if (!body.name) {
    return response.status(400).json({ 
      error: 'name is missing' 
    })
  }
  else if (!body.number) {
    return response.status(400).json({ 
      error: 'number is missing' 
    })
  }
  

  const person = {
    name: body.name,
    number: body.number,
    id: Math.floor(Math.random() * Math.floor(100)),
  }
  for (let index = 0; index < persons.length; index++) {
    const element = persons[index];
    if (element.name == person.name){
      return response.status(400).json({ 
        error: 'name must be unique' 
      })
    }
    
  }
  persons = persons.concat(person)

  response.json(person)
})

app.put('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const  body = request.body
  const person = {
    name: body.name,
    number: body.number,
    id: id,
  }
  for (let index = 0; index < persons.length; index++) {
    const element = persons[index].id;
    if (element == id)
    {
      persons[index].number = person.number
    }
    
  }
  response.json(person)

})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

const port = process.env.PORT || 3001
app.listen(port)
console.log(`Server running on port ${port}`)
