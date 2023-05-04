const fs = require( "fs" )

class IO {
  constructor( dir ) {
    this.dir = dir;
  }

  /////// Custom readFile ///////////
  async read() {
    const data = await fs.promises.readFile( this.dir, "utf-8" );
    return data ? JSON.parse( data ) : [];
  }

  /////// Custom writeFile ///////////
  write( data ) {
    fs.promises.writeFile( this.dir, JSON.stringify( data, null, 2 ) );
    return { sucsess: true }
  }
}

module.exports = IO