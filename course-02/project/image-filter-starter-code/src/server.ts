import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles, validateURLFormat} from './util/util';
import * as url from "url";

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  app.get( "/", async ( req: Request, res: Response ) => {
    return res.status(200).send("Welcome to image filter service");
  } );

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

  /**************************************************************************** */

  //! END @TODO1

  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/filteredimage", async ( req: Request, res: Response ) => {

    if (typeof req.query.image_url !== "string") {
      return res.status(400).send(`Query param 'url' has to be of type string`);
    }

    let image_url:string = req.query.image_url;

    let isURLValid :boolean = await validateURLFormat(image_url);

    if (!isURLValid) {
      return res.status(400).send(`Invalid URL ${image_url}`);
    }

    let filteredPath :string = await filterImageFromURL(image_url);
    res.status(200).sendFile(filteredPath, {}, (err) => {
      deleteLocalFiles([filteredPath])
    });

  } );

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();
