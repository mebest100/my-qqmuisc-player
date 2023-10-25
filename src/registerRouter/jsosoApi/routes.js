const fs = require('fs')
const path = require('path')


async function getModulesDefinitions(
    modulesPath,
    specificRoute,
) {
    // files表示遍历出来的所有路由文件
    const files = await fs.promises.readdir(modulesPath)
    console.log('song_list.js in routes =》', files.indexOf('song_list.js') != -1)
    const parseRoute = (fileName) => specificRoute[fileName]
    const modules = files
        .reverse()
        .filter((file) => file.endsWith('.js'))
        .map((file) => {
            const identifier = file.split('.').shift() //不带js后缀的路由文件名称
            const route = parseRoute(file) //获得路由uri规则
            const modulePath = path.join(modulesPath, file)
            // 解析出路由.js文件的全部内容
            const module = require(modulePath)

            return { identifier, route, module }
        })

    return modules
}



const RegisterQQMusicApi = async (app) => {
    const routesMap = {
        'recommend_banner.js': '/api/getBanner',
        'recommend_songlist.js': '/api/getRecomendDiscList',
        'song_list.js': '/api/getSongList',
        'song_urls.js': '/api/getSong',

    }


    // moduleDefinitions包含了modules目录下的全部路由文件所包含的处理逻辑
    const moduleDefinitions = await getModulesDefinitions(path.join(__dirname, 'modules'), routesMap)

    // 注册全部路由
    for (const moduleDef of moduleDefinitions) {
        app.get(moduleDef.route, async (req, res) => {
            const Response = await moduleDef.module(req, res)
            return Response

        })
    }

}

module.exports = { RegisterQQMusicApi }