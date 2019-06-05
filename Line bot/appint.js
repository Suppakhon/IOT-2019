const bodyParser = require("body-parser");
const request = require("request");
const express = require("express");

const app = express();
const port = process.env.PORT || 9000;
const hostname = "127.0.0.1";
const HEADERS = {
  "Content-Type": "application/json",
  Authorization:
    "Bearer fcaF4suv/FCXkkMiWL4mJgTvGvf58TS1v6KM9wSNGQeAaQmiCpeZB3E0CG9xhQqBGt+bwwhYOw0YfHnvy/pheC6ZoHSZ5nGYBJQE2jVMDTT9mX6mdu0dYDrpr+P2FJvWbN2UDqjfIyEZdJNY9cwPaAdB04t89/1O/w1cDnyilFU="
};

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var DB_Server = "http://44295fc4.ngrok.io/";

// Push
app.get("/webhook", (req, res) => {
  // push block
  let msg = "Hello World!";
  push(msg);
  res.send(msg);
});

// Reply
app.post("/webhook", (req, res) => {
  // reply block
  let reply_token = req.body.events[0].replyToken;
  let msg = req.body.events[0].message.text;
  let data;
  if (
    msg.toUpperCase().search("GET") != -1 &&
    msg.toUpperCase().search("STAT") != -1 &&
    msg.search("S") > -1 &&
    msg.search("E") > -1
  ) {
    //Stat btw Time
    let start =
      "getbtw/" + msg.slice(msg.search("S") + 1, msg.search("S") + 11) + "/";
    let end = msg.slice(msg.search("E") + 1, msg.search("E") + 11);
    request(DB_Server + start + end, function(error, response, body) {
      console.error("error:", error); // Print the error if one occurred
      console.log("statusCode:", response && response.statusCode); // Print the response status code if a response was received
      if (response && response.statusCode == 200) {
        data = JSON.parse(body);

        if (msg.toUpperCase().search("TEMP") != -1) {
          let i = 0,
            mean = 0,
            max = -999,
            min = 999;
          for (i; i < Object.keys(data).length; i++) {
            let temp = parseFloat(data[i].temp);
            mean += temp;
            if (temp > max) max = temp;
            if (temp < min) min = temp;
          }
          reply(
            reply_token,
            "##Temp Stat\nMean: " +
              (mean / i).toFixed(2) +
              " ํc\nH_Peak: " +
              max.toFixed(2) +
              " ํc\nL_Peak: " +
              min.toFixed(2) +
              " ํc"
          );
        } else if (msg.toUpperCase().search("HUMI") != -1) {
          let i = 0,
            mean = 0,
            max = -999,
            min = 999;
          for (i; i < Object.keys(data).length; i++) {
            let humi = parseFloat(data[i].humi);
            mean += humi;
            if (humi > max) max = humi;
            if (humi < min) min = humi;
          }
          reply(
            reply_token,
            "##Humi Stat\nMean: " +
              (mean / i).toFixed(2) +
              " %\nH_Peak: " +
              max.toFixed(2) +
              " %\nL_Peak: " +
              min.toFixed(2) +
              " %"
          );
        } else if (msg.toUpperCase().search("D2.5") != -1) {
          let i = 0,
            mean = 0,
            max = -999,
            min = 999;
          for (i; i < Object.keys(data).length; i++) {
            let dust = parseFloat(data[i].dust.d2_5);
            mean += dust;
            if (dust > max) max = dust;
            if (dust < min) min = dust;
          }
          reply(
            reply_token,
            "##Dust Stat\nMean: " +
              (mean / i).toFixed(2) +
              " µg/m3\nH_Peak: " +
              max.toFixed(2) +
              " µg/m3\nL_Peak: " +
              min.toFixed(2) +
              " µg/m3"
          );
        }
      } else {
        reply(reply_token, "!Command ERROR \nกรุณาตรวจสอบคำสั่งอีกครั้ง");
      }
    });
  } else if (
    //Stat x Log
    msg.toUpperCase().search("GET") != -1 &&
    msg.toUpperCase().search("STAT") != -1 &&
    msg.search("P") > -1
  ) {
    let nLog = parseInt(msg.slice(msg.search("P") + 1));
    request(DB_Server + "getprevious/" + nLog.toString(), function(
      error,
      response,
      body
    ) {
      console.error("error:", error); // Print the error if one occurred
      console.log("statusCode:", response && response.statusCode); // Print the response status code if a response was received
      if (response && response.statusCode == 200) {
        data = JSON.parse(body);
        if (msg.toUpperCase().search("TEMP") != -1) {
          let i = 0,
            mean = 0,
            max = -999,
            min = 999;
          for (i; i < Object.keys(data).length; i++) {
            let temp = parseFloat(data[i].temp);
            mean += temp;
            if (temp > max) max = temp;
            if (temp < min) min = temp;
          }
          reply(
            reply_token,
            "##Temp Stat\nMean: " +
              (mean / i).toFixed(2) +
              " ํc\nH_Peak: " +
              max.toFixed(2) +
              " ํc\nL_Peak: " +
              min.toFixed(2) +
              " ํc"
          );
        } else if (msg.toUpperCase().search("HUMI") != -1) {
          let i = 0,
            mean = 0,
            max = -999,
            min = 999;
          for (i; i < Object.keys(data).length; i++) {
            let humi = parseFloat(data[i].humi);
            mean += humi;
            if (humi > max) max = humi;
            if (humi < min) min = humi;
          }
          reply(
            reply_token,
            "##Humi Stat\nMean: " +
              (mean / i).toFixed(2) +
              " %\nH_Peak: " +
              max.toFixed(2) +
              " %\nL_Peak: " +
              min.toFixed(2) +
              " %"
          );
        } else if (msg.toUpperCase().search("D2.5") != -1) {
          let i = 0,
            mean = 0,
            max = -999,
            min = 999;
          for (i; i < Object.keys(data).length; i++) {
            let dust = parseFloat(data[i].dust.d2_5);
            mean += dust;
            if (dust > max) max = dust;
            if (dust < min) min = dust;
          }
          reply(
            reply_token,
            "##Dust Stat\nMean: " +
              (mean / i).toFixed(2) +
              " µg/m3\nH_Peak: " +
              max.toFixed(2) +
              " µg/m3\nL_Peak: " +
              min.toFixed(2) +
              " µg/m3"
          );
        }
      } else {
        reply(reply_token, "!Command ERROR \nกรุณาตรวจสอบคำสั่งอีกครั้ง");
      }
    });
  } else if (msg.slice(0, 3).toUpperCase() == "GET") {
    request(DB_Server + "getlast", function(error, response, body) {
      console.error("error:", error); // Print the error if one occurred
      console.log("statusCode:", response && response.statusCode); // Print the response status code if a response was received
      data = JSON.parse(body);
      console.log(msg);

      if (msg.toUpperCase().search("ALL") != -1) {
        reply(
          reply_token,
          "Temperature: " +
            data.temp +
            " ํc" +
            "\n" +
            "Humidity: " +
            data.humi +
            " %" +
            "\n" +
            "Water: " +
            data.water +
            "\n" +
            "GAS: " +
            data.gas +
            "\n" +
            "PM1.0: " +
            data.dust.d1_0 +
            " µg/m3" +
            "\n" +
            "PM2.5: " +
            data.dust.d2_5 +
            "  µg/m3" +
            "\n" +
            "PM10.0: " +
            data.dust.d10_0 +
            "  µg/m3"
        );
      }
      if (msg.toUpperCase().search("TEMP") != -1) {
        reply(reply_token, "Temperature: " + data.temp + " ํc");
      }
      if (msg.toUpperCase().search("HUMI") != -1) {
        reply(reply_token, "Humidity: " + data.humi + " %");
      }
      if (msg.toUpperCase().search("WATER") != -1) {
        reply(reply_token, "Water: " + data.water);
      }
      if (msg.toUpperCase().search("GAS") != -1) {
        reply(reply_token, "Gas: " + data.gas);
      }
      if (msg.toUpperCase().search("DUST") != -1) {
        reply(
          reply_token,
          "PM1.0: " +
            data.dust.d1_0 +
            " µg/m3" +
            "\n" +
            "PM2.5: " +
            data.dust.d2_5 +
            "  µg/m3" +
            "\n" +
            "PM10.0: " +
            data.dust.d10_0 +
            "  µg/m3"
        );
      }
      if (msg.toUpperCase().search("D1.0") != -1) {
        reply(reply_token, "PM1.0: " + data.dust.d1_0 + "  µg/m3");
      }
      if (msg.toUpperCase().search("D2.5") != -1) {
        reply(reply_token, "PM2.5: " + data.dust.d2_5 + "  µg/m3");
      }
      if (msg.toUpperCase().search("D10.0") != -1) {
        reply(reply_token, "PM10.0: " + data.dust.d10_0 + "  µg/m3");
      }
      if (
        msg.toUpperCase().search("TEMP") == -1 &&
        msg.toUpperCase().search("HUMI") == -1 &&
        msg.toUpperCase().search("WATER") == -1 &&
        msg.toUpperCase().search("GAS") == -1 &&
        msg.toUpperCase().search("DUST") == -1 &&
        msg.toUpperCase().search("D1.0") == -1 &&
        msg.toUpperCase().search("D2.5") == -1 &&
        msg.toUpperCase().search("D10.0") == -1 &&
        msg.toUpperCase().search("ALL") == -1
      ) {
        reply(reply_token, "Query error!\r\nกรุณาเช็คคำสั่งใหม่อีกครั้ง");
      }
    });
  } else {
    reply(reply_token, "Command error!\r\nกรุณาเริ่มต้นด้วย GET ");
  }
});

function push(msg) {
  let body = JSON.stringify({
    // push body
    to: "U135b92ff9141db0c177d8e816048e8bf",
    messages: [
      {
        type: "text",
        text: msg
      }
    ]
  });
  curl("push", body);
}

function reply(reply_token, msg) {
  let body = JSON.stringify({
    // reply body
    replyToken: reply_token,
    messages: [
      {
        type: "text",
        text: msg
      }
    ]
  });
  curl("reply", body);
}

function curl(method, body) {
  request.post(
    {
      url: "https://api.line.me/v2/bot/message/" + method,
      headers: HEADERS,
      body: body
    },
    (err, res, body) => {
      console.log("status = " + res.statusCode);
    }
  );
}

app.listen(port, hostname, () => {
  console.log(`Server running at ` + port);
});
