/**
 * Node modules
 */
import express from "express";
import morgan from "morgan";

/**
 * other modules
 */
import { ENV } from "./ENV/index.js";

/**
 * app
 */
const app = express();

/**
 * @description logging middleware
 */

if(ENV.NODE_ENV === "development"){
    app.use(morgan("dev"));
}

/**
 * @description body parser middleware
 */ 
app.use(express.json({limit : '10kb'}))
app.use(express.urlencoded({extended : true, limit : '10kb'}))

/**
 * @description Global error handler
 */
app.use((err,req,res,next)=>{
    console.error(err.stack);
    res.status(err.status || 500).json({
        status : "error",
        message : err.message || 'Internal Server error',
        ...(ENV.NODE_ENV === 'development' && {stack : err.stack})
    })
    
})

/**
 * @description API routes
 */


/**
 * @description 404 handler - always at the bottom
 */
app.use((req,res)=>{
    res.status(404).json({
        status : "error",
        message : "Route Not Found!!"
    })
})
export default app;