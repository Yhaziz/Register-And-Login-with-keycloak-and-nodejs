const Eureka = require("eureka-js-client").Eureka;

const client = new Eureka({
  instance: {
    app: "nodeauth",
    hostName: "localhost",
    ipAddr: "127.0.0.1",
    statusPageUrl: "http://localhost:3000",
    port: { $: 3000, "@enabled": "true" },
    vipAddress: "nodeauth.com",
    dataCenterInfo: {
      "@class": "com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo",
      name: "MyOwn",
    },
  },
  eureka: {
    host: "localhost",
    port: 8761,
    servicePath: "/eureka/apps/",
  },
});

client.start();
module.exports = client;
