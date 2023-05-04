const http = require( 'http' );

const Io = require( "./utils/io" );
const parser = require( './utils/parser' );
const User = require( "./models/Users" );
const Users = new Io( "./db/user.json" );
const Todo = new Io( "./db/todo.json" );
const b_group = require( "./models/Todo" );
const { write } = require( 'fs' );


const request = async ( req, res ) => {

  res.setHeader( "Content-Type", "application/json" )


  if ( req.url === '/auth/login' && req.method === "POST" ) {

    ///////////// LOGIN ////////////

    req.body = await parser( req );
    const { username, password } = req.body;

    const user1 = await Users.read()
    const userFind = user1.find( ( User ) => User.username === username && User.password === password );

    if ( !userFind ) {
      res.writeHead( 403 )
      return res.end( JSON.stringify( { message: "User not found" } ) )
    }

    res.writeHead( 200 );
    res.end( JSON.stringify( { token: userFind.id } ) )
  } else if ( req.url === "/auth/register" && req.method === "POST" ) {

    //////////// REGISTER ////////////

    req.body = await parser( req );
    const { username, password } = req.body;

    const user1 = await Users.read()
    const userFind = user1.find( ( User ) => User.username === username );

    if ( userFind ) {
      res.writeHead( 403 )
      return res.end( JSON.stringify( { message: "User already exists" } ) )
    }

    const id = ( user1[ user1.length - 1 ]?.id || 0 ) + 1;
    const newUser = new User( id, username, password );
    const data = user1.length ? [ ...user1, newUser ] : [ newUser ];
    Users.write( data );

    res.writeHead( 201 );
    res.end( JSON.stringify( { success: true } ) )
  } else if ( req.url === "/todo" && req.method === "POST" ) {

    /////////// ADD TODO ////////////

    req.body = await parser( req );
    const { title, text, } = req.body;
    const user_id = req.rawHeaders[ 3 ].split( " " )[ 1 ];
    const todo1 = await Todo.read();

    const id = ( todo1[ todo1.length - 1 ]?.id || 0 ) + 1;

    const date = new Date();
    const newTodo = new b_group( id, title, text, date, user_id, )
    const data2 = todo1.length ? [ ...todo1, newTodo ] : [ newTodo ];

    Todo.write( data2 );
    res.writeHead( 201 );
    res.end( JSON.stringify( { success: true } ) )
  } else if(req.url === "/alltodo" && req.method === "GET"){

   /////////////// GET ALL TODO ////////////

    req.body = await parser( req );
    const { title,} = req.body;
    const todo1 = await Todo.read();
    res.writeHead( 201 );
    res.end( JSON.stringify( [todo1] ) )
    console.log(todo1);
  } else if (req.url === "/alltodo/id" && req.method === "GET"){

    /////////// GET TODO ID ///////////////

    req.body = await parser( req );
    const { id } = req.body;
    const todo1 = await Todo.read()
    const todoid = todo1.find( ( task ) => task.id === id);
    if(!todoid){
      res.writeHead( 403 )
      return res.end( JSON.stringify( { message: "Bu todo topilmadi" } ) )
    }

    res.writeHead( 200 );
    res.end( JSON.stringify( [todoid] ) )
  } else if ( req.url === "/delete" && req.method === "DELETE" ){

  //////////////// DELETE ID TODO ////////////

    req.body = await parser( req );
    const { id,} = req.body;

    const todo1 = await Todo.read()

    const newTodo = todo1.find( ( Todo ) => Todo.id === id );

    const data = todo1.filter((todo) => todo.id != id);
    Todo.write(data)
    
    res.writeHead( 201 );
    res.end( JSON.stringify( "O'chirildi" ) )
  } else if ( req.url === "/update" && req.method === "PATCH" ) {

  /////////////////// UPDATE TODO /////////////////

    req.body = await parser( req );
    const { id, title, text } = req.body;
    const todo1 = await Todo.read();
    const newTodo = todo1.find( ( Todo ) => Todo.id === id );
    if(!newTodo){
      res.writeHead( 403 );
      res.end( JSON.stringify( "O'zgartirilmadi") )
    }

    const data = todo1.map((todo) => 
      todo.id === id ? {...todo, title: title, text: text} : todo
    )
    Todo.write( data )
    res.writeHead( 200 );
    res.end( JSON.stringify( "O'zgartirildi" ) )

  } else if ( req.url === "/truefalse" && req.method === "POST" ){
    req.body = await parser( req );
    const { isCompleted, } = req.body;
    const todo1 = await Todo.read()
    const newTodo = todo1.find( ( Todo ) => Todo.id === id && Todo.isCompleted === isCompleted );
  }
}

http.createServer( request ).listen( 5050 )