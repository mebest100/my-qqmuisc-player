const express = require('express')
const app = express()
const RegisterRoute = require("./src/registerRouter");
const open = require('open');
const history = require("connect-history-api-fallback");


app.use(history())
RegisterRoute(app);
app.use(express.static('./dist'))

const port = 9000

const portfinder = require("portfinder");
module.exports = (() => {
    portfinder.basePort = port
    portfinder.getPort((err, newport) => {
        if (err) {
            return;
        }

        app.listen(newport, error => {
            if (error) {
                console.log(error);
                return;
            }

            if( newport !== port) {
                console.log(`预定端口${port}被占用！`);
				console.log(`分配新端口${newport}，Listening on http://localhost:${newport}\n`);
            }
            console.log(`${newport}端口可用，Listening on http://localhost:${newport}\n`);
            open(`http://localhost:${newport}`,"chrome")
        });
    });
})();