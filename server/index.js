import { ENV } from "./src/ENV/index.js";
import app from "./src/app.js";


app.listen(ENV.PORT, (req,res)=>{
    console.log(`Server is listening @ http://localhost:${ENV.PORT}`);
    
})