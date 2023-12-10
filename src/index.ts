import { connectDB } from './config/database';
import { AppConfigs } from './config/app';
import App from './app';



const {PORT, SERVER_PATH} = AppConfigs
// connect to db
connectDB();

App.listen(Number(PORT), "0.0.0.0", async () => {
    console.log(`Server started running at http://localhost:${PORT}${SERVER_PATH}`);
});

