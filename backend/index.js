const helmet = require("helmet");
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const logger = require("./logger");
const config = require("./config");

const app = express();

logger.setLogLevel(config.logLevel);
app.use(logger.middleware);

app.use(helmet({ frameguard: !config.disableFrameGuard }));
app.use(require("./force-ssl"));

app.use("/api", cookieParser());
app.use("/api", bodyParser.urlencoded());
app.use("/api", bodyParser.json());
app.use("/api", require("./context"));
app.use("/api", require("./api"));

app.use("/google", cookieParser(), require("./google"));
app.use("/office365", cookieParser(), require("./office365"));

app.get("/logout", cookieParser(), require("./context"), async (req, res) => {
  await req.context.removeSession(req, res);
  res.redirect("/");
});

app.listen(config.port, config.acceptHost, err => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`> Ready on http://${config.acceptHost}:${config.port}`);
});

module.exports = app;