
import {app} from "./setting";
import {runDb} from "./repositories/mogoose";

//PORT
const port = 5001 || process.env.PORT

//TIME
const timeNow = new Date()


//START-APP FUNCTION
const startApp = async () => {
    //wait while DB is connected
    await runDb()
    //the listen port
    app.listen(port, () => {
        // @ts-ignore
        console.log(`App listening on port ${port} ${timeNow.toLocaleTimeString({}, {})}`)
    })
}

//START APP
startApp();