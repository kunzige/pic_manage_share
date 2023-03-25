const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const CompressionPlugin = require('compression-webpack-plugin');//引入gzip压缩插件


module.exports={
// 使用cdn
  configureWebpack:{
    externals:{
      vue:"Vue",
      axios:"axios",
      "element-ui":"ELEMENT",	//在index.html头文件中引入cdn的vue和element-ui就行,
	  'vue-router':'VueRouter',
	  echarts:"echarts"
    },
    // 分离js
    optimization:{
      runtimeChunk: 'single',
      splitChunks: {
        chunks: 'all',
        maxInitialRequests: Infinity,
        minSize: 20000,
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name (module) {
              // get the name. E.g. node_modules/packageName/not/this/part.js
              // or node_modules/packageName
              const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1]
              // npm package names are URL-safe, but some servers don't like @ symbols
              return `npm.${packageName.replace('@', '')}`
            }
          }
        }
      }
    },
	plugins:[
		new CompressionPlugin({ 
			filename: "[path][base].gz", //  使得多个.gz文件合并成一个文件，这种方式压缩后的文件少，建议使用
			algorithm: 'gzip', // 官方默认压缩算法也是gzip
			test: /\.js$|\.css$|\.html$|\.ttf$|\.eot$|\.woff$/, // 使用正则给匹配到的文件做压缩，这里是给html、css、js以及字体（.ttf和.woff和.eot）做压缩
			threshold: 10240, //以字节为单位压缩超过此大小的文件，使用默认值10240吧
			minRatio: 0.6, // 最小压缩比率，官方默认0.8
			//是否删除原有静态资源文件，即只保留压缩后的.gz文件，建议这个置为false，还保留源文件。以防：
			deleteOriginalAssets: false,
			}),
			new UglifyJsPlugin({
			  uglifyOptions: {
				output: {
				  comments: true, // 去掉注释
				},
				warnings: false,
				compress: {
				  drop_console: true,
				  drop_debugger: true,
				  pure_funcs: ['console.log']//移除console
				}
			  }
			})
	]
},
// 不产生sourcemap

  productionSourceMap:false
}
