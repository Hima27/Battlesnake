const bodyParser = require('body-parser')
const express = require('express')

const PORT = process.env.PORT || 3000

const app = express()
app.use(bodyParser.json())

app.get('/', handleIndex)
app.post('/start', handleStart)
app.post('/move', handleMove)
app.post('/end', handleEnd)

app.listen(PORT, () => console.log(`Battlesnake Server listening at http://127.0.0.1:${PORT}`))


function handleIndex(request, response) {
  var battlesnakeInfo = {
    apiversion: '1',
    author: 'Chabytes',
    color: '#736CCB',
    head: 'shac-gamer',
    tail: 'curled'
  }
  response.status(200).json(battlesnakeInfo)
}

function handleStart(request, response) {
  var gameData = request.body

  console.log('START')
  response.status(200).send('ok')
}

function handleMove(request, response) {
  var gameData = request.body

  //console.log(gameData.board.food)
  //console.log(gameData.you.head)

  //var foodPlaces = new Array() //foodplaces is empty right now
  //console.log("game DATA : " ,gameData.board.food[0])
  var foodPlaces = gameData.board.food[0]

  currHead = gameData.you.head //autmatically changes after every turn
  //console.log("//////",currHead)

  if(currHead.x < foodPlaces.x){
    console.log("------MOVE TO THE RIGHT------")
      response.status(200).send({
    move: 'right'
    })
    //console.log("I AM HERE:", currHead)
    
    if(currHead.x == foodPlaces.x){
      if(currHead.y < foodPlaces.y){
        response.status(200).send({
          move: 'up'
        })
      }
      else if(currHead.y > foodPlaces.y){
        response.status(200).send({
          move: 'down'
        })
      }
    }
  
  }
  else if((currHead.x == foodPlaces.x) && (currHead.y < foodPlaces.y)){
    response.status(200).send({
      move: 'up'
    })
  }
  else if((currHead.x == foodPlaces.x) && (currHead.y > foodPlaces.y)){
    response.status(200).send({
      move: 'down'
    })
  }
  else{
    console.log("------MOVE TO THE LEFT------")
      response.status(200).send({
    move: 'left'
    })
    //console.log("I AM HERE:", currHead)
  }


  var possibleMoves = ['up', 'down', 'left', 'right']
  var move = possibleMoves[Math.floor(Math.random() * possibleMoves.length)]

  //console.log('MOVE: ' + move)
  // response.status(200).send({
  //   move: move
  // })
}

function handleEnd(request, response) {
  var gameData = request.body

  console.log('END')

  console.log(gameData)
  response.status(200).send('ok')
}
