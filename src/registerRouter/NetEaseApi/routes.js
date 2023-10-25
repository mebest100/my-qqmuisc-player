
const fs = require('fs')
const path = require('path')
const request = require('./util/request')
const decode = require('safe-decode-uri-component')

async function getModulesDefinitions(
    modulesPath,
    specificRoute,
    doRequire = true,
) {
    // files表示遍历出来的所有路由文件
    const files = await fs.promises.readdir(modulesPath)
    console.log('search.js in routes =》', files.indexOf('search.js') != -1)
    const parseRoute = (fileName) =>
        specificRoute && fileName in specificRoute
            ? specificRoute[fileName] // 获取三个特殊路由
            : `/${fileName.replace(/\.js$/i, '').replace(/_/g, '/')}` //获取三个特殊路由以外的路由:去掉js后缀，下划线替换成/,并且以/开头

    const modules = files
        .reverse()
        .filter((file) => file.endsWith('.js'))
        .map((file) => {
            const identifier = file.split('.').shift() //不带js后缀的路由文件名称
            const route = parseRoute(file) //获得路由uri规则
            const modulePath = path.join(modulesPath, file)
            // 解析出路由.js文件的全部内容
            const module = doRequire ? require(modulePath) : modulePath

            return { identifier, route, module }
        })

    return modules
}

const RegisterNetEaseMusicApi = async (app) =>{
    const special = {
        'search.js': '/api/NetEaseSearch',
        'song_url.js': '/api/getSongNetEase',
        'lyric.js': '/api/getNetEaseLyric',
    }

    /**
     * Load every modules in this directory
     */
    // moduleDefinitions包含了module目录下的全部路由和三个特殊路由
    const moduleDefinitions = await getModulesDefinitions(path.join(__dirname, 'modules'), special)

    // 注册全部路由
    for (const moduleDef of moduleDefinitions) {
        // Register the route.
        app.get(moduleDef.route, async (req, res) => {
         
            const { myCookie } = require('./config')
            let query = Object.assign(              
                {},    
                { cookie: myCookie },     
                { cookie: {} },    // cookie属性必须有（哪怕是空也行），否则会出现搜索歌曲结果不准的问题  
                req.query,
                req.body,
                req.files,
            )

            try {
                const moduleResponse = await moduleDef.module(query, (...params) => {
                    // 参数注入客户端IP
                    const obj = [...params]
                    let ip = req.ip

                    if (ip.substr(0, 7) == '::ffff:') {
                        ip = ip.substr(7)
                    }
                    // console.log(ip)
                    obj[3] = {
                        ...obj[3],
                        ip,
                    }
                    return request(...obj)
                })
                console.log('[OK]', decode(req.originalUrl))

                const cookies = moduleResponse.cookie
                if (!query.noCookie) {
                    if (Array.isArray(cookies) && cookies.length > 0) {
                        if (req.protocol === 'https') {
                            // Try to fix CORS SameSite Problem
                            res.append(
                                'Set-Cookie',
                                cookies.map((cookie) => {
                                    return cookie + '; SameSite=None; Secure'
                                }),
                            )
                        } else {
                            res.append('Set-Cookie', cookies)
                        }
                    }
                }
                res.status(moduleResponse.status).send(moduleResponse.body)
            } catch (/** @type {*} */ moduleResponse) {
                console.log('[ERR]', decode(req.originalUrl), {
                    status: moduleResponse.status,
                    body: moduleResponse.body,
                })
                if (!moduleResponse.body) {
                    res.status(404).send({
                        code: 404,
                        data: null,
                        msg: 'Not Found',
                    })
                    return
                }
                if (moduleResponse.body.code == '301')
                    moduleResponse.body.msg = '需要登录'
                if (!query.noCookie) {
                    res.append('Set-Cookie', moduleResponse.cookie)
                }

                res.status(moduleResponse.status).send(moduleResponse.body)
            }
        })
    }

}

module.exports = { RegisterNetEaseMusicApi }