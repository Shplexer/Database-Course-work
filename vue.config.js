const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true
})
module.exports = {
  pluginOptions: {
    electronBuilder: {
      builderOptions: {
        appId: 'com.shplex.schedule',
        productName: 'Schedule',
        icon: 'public/schedule.png',
        // options placed here will be merged with default configuration and passed to electron-builder
        files: [
          "**/*"
        ],
        extraFiles: [
          {
            "from": "src",
            "to": "resources/src",
            "filter": ["**/*"]
          }
        ]
      }
    }
  }
}