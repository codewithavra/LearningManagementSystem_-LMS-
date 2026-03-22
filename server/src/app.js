/**
 * Node modules
 */
import express from "express";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import ExpressMongoSanitize from "express-mongo-sanitize";
import hpp from "hpp";
import cors from "cors";
/**
 * other modules
 */
import { ENV } from "./ENV/index.js";

/**
 * app
 */
const app = express();

/**
 * @description Global rate limiting
 */
const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
	standardHeaders: 'draft-8', // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
	ipv6Subnet: 56, // Set to 60 or 64 to be less aggressive, or 52 or 48 to be more aggressive
	// store: ... , // Redis, Memcached, etc. See below.
})

// Apply the rate limiting middleware to all requests.

/**
 * @description security middleware
 */
app.use(helmet());
app.use(ExpressMongoSanitize());
app.use('/api',limiter);
app.use(hpp());
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
app.use((err, req,res,next)=>{
    const isDev = (ENV.NODE_ENV === 'development');
    const statusCode = err.status || err.statusCode || 500;
    
    if(isDev){
        console.error(err.stack);
    }else{
        console.error(err.message);
    }

    res.status(statusCode).json({
        status : "error",
        message : err.message || 'Internal Server Error',
        ...(isDev && ({stack : err.stack}))
    })
})

/**
 * @description CORS configuration
 */
app.use(cors({
    origin: ENV.CLIENT_URL || "http://lovalhost:5173",
    credentials : true,
    methods : ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"  ],
    allowedHeaders : [
        "Content-Type", 
        "Authorization", 
        "X-Requested-With", 
        "device-remember-token",
        "Access-Control-Allow-Origin",
        "Accept", 
        "Origin", ],
}))


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