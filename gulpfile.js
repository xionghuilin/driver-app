var gulp = require('gulp');
var gutil = require('gulp-util');
var bower = require('bower');
var concat = require('gulp-concat');//合并
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');//压缩
var rename = require('gulp-rename');//重命名
var sh = require('shelljs');
var autoprefixer = require('gulp-autoprefixer');//增加私有变量前缀
var minifyHtml = require('gulp-minify-html');//压缩html
var ngAnnotate = require('gulp-ng-annotate');// angular 模块依赖自动注入
var uglify = require('gulp-uglify');//混淆js
var nghtml2js = require('gulp-ng-html2js');//html转js
var jshint = require('gulp-jshint');//持续检查 JavaScript 文件
var rev = require('gulp-rev');//文件名加MD5后缀
var revReplace = require('gulp-rev-replace');//替换引用的加了md5后缀的文件名
var clean = require('gulp-clean');//清理文件
var runSequence = require('run-sequence');//控制task顺序
var releaseTemplate = require('gulp-template');//替换变量以及动态html用

var paths = {
    common: {
        version:['./src/common/envs/version.js'],
        util:['./src/common/utils/*.js'],
        api:['./src/common/api/*.js'],
        config: ['./src/common/configs/*.js'],
        filter: ['./src/common/filters/*.js'],
        directive: ['./src/common/directives/*.js'],
        service: ['./src/common/services/*.js'],
        controller: ['./src/common/controllers/*.js'],
        templates: ['./src/common/templates/**/*.html']
    },
    sass: ['./src/common/css/*.scss'],
    scripts: ['./src/**/*.js'],
    clean: ['./www/js/*.*', './www/css/*.*', './www/index.html','./www/pay/*.*'],
    cleanRev: ['./www/js/controller.js',
               './www/js/api.js',
               './www/js/version.js',
               './www/js/config.js',
               './www/js/directive.js',
               './www/js/filter.js',
               './www/js/env.js',
               './www/js/service.js',
               './www/js/templates.js',
               './www/js/util.js']
};


var platforms = ['site'];
//0开发环境 1测试环境 2准生产环境 3生产环境
var environment=['develop','test','uat','product'];

//注册创建环境任务config-envName
for(var indexEv in [0,1,2,3]){
    buildConfig(indexEv,'env.js');// by xhl
}
//注册不同平台任务
for (var index in platforms) {
    var platform = platforms[index];//获取平台：手机OR网站
    addPlatformPathes(platform);

    /*读取并处理js文件*/
    buildAngularScript(platform, 'version', 'version.js');
    buildAngularScript(platform, 'util', 'util.js');
    buildAngularScript(platform, 'config', 'config.js');
    buildAngularScript(platform, 'directive', 'directive.js');
    buildAngularScript(platform, 'service', 'service.js');
    buildAngularScript(platform, 'controller', 'controller.js');
    buildAngularScript(platform, 'filter', 'filter.js');
    buildAngularScript(platform, 'api', 'api.js');

    /*读取templates文件，并将html转换为js*/
    buildTemplates(platform);

    /*重写映射文件*/
    replaceRevision(platform);

    /*读取index.html并输出到www目录下*/
    copyIndexFile(platform);

    /*读取wxpay.html  alipay并输出到www/pay目录下*/
    copyPayFile(platform);

    /*创建平台task：site*/
    createPlatformTask(platform);

    /*添加监听task*/
    createWatchTask(platform);

    //监听 js文件 xhl
    createJsWatch(platform);
    //监听sass xhl
    createScssWatch(platform);

    /*设置html编码格式，并替换页面变量*/
    replaceTemplate(platform);

}

function buildConfig(environment,targetFileName){

    gulp.task('config-'+environment, function (done) {
        gulp.src(['./src/common/envs/env'+environment+'.js'])   //读取JS文件
            .pipe(concat(targetFileName))
            .pipe(gulp.dest('./www/js/'))  //写js文件
            .on('end', done);
    });

}

function addPlatformPathes(platformName) {
    var common = paths.common,
        platform = {};//定义common对象，platform对象
    for (var key in common) {//遍历common
        var value = common[key][0];//读取common中的数据

        /*设置platform对应的key的值，数组格式：[common原本路径，替换后的platform文件夹下的路径]*/
        platform[key] = [value, value.replace(/common/i, platformName)];
    }
    paths[platformName] = platform;//添加paths.platform对象
}

function buildAngularScript(platform, task, targetFileName) {
    gulp.task(platform + '-' + task, function (done) {console.log('----->task已经执行-----》'+task);
        gulp.src(paths[platform][task])//读取paths.platform对象中key对应的文件
            .pipe(concat(targetFileName))//合并到targetFileName对应的文件中
            .pipe(gulp.dest('./www/js/'))//输出js文件到www目录下
            .on('end', done);//执行下一个任务
    });

    gulp.task(platform + '-' + task + '-release', function (done) {
        gulp.src(paths[platform][task])//读取paths.platform对象中key对应的文件
            .pipe(concat(targetFileName))//合并到targetFileName对应的文件中
            .pipe(ngAnnotate())//angular 模块依赖自动注入
            .pipe(uglify())//混淆js文件
            .pipe(gulp.dest('./www/js/'))//输出js文件到www目录下
            .on('end', done);//执行下一个任务
    });
}

function buildTemplates(platform) {
    gulp.task(platform + '-templates', function (done) {console.log("tttemplates----->change");
        gulp.src(paths[platform].templates)//读取templates文件

            /*将html转换为js*/
            .pipe(nghtml2js({
                moduleName: 'starter.templates',
                prefix: 'templates/'
            }))

            /*合并到templates.js文件中*/
            .pipe(concat('templates.js'))

            /*将合并后的代码输出到/www/js目录下*/
            .pipe(gulp.dest('./www/js/'))

            /*执行下一个任务*/
            .on('end', done);
    });

    gulp.task(platform + '-templates-release', function (done) {
        gulp.src(paths[platform].templates)//读取templates文件

            /*压缩html*/
            .pipe(minifyHtml({
                empty: true,
                spare: true,
                quotes: true
            }))

            /*将html转换为js*/
            .pipe(nghtml2js({
                moduleName: 'starter.templates',
                prefix: 'templates/'
            }))

            /*合并到templates.js文件中*/
            .pipe(concat('templates.js'))

            /*混淆文件*/
            .pipe(uglify())

            /*将合并后的代码输出到/www/js目录下*/
            .pipe(gulp.dest('./www/js/'))

            /*执行下一个任务*/
            .on('end', done);
    });
}

gulp.task('css-revision', function (done) {

    return gulp.src(['./www/css/*.css'])//读取css文件
        .pipe(rev())//文件名加MD5后缀
        .pipe(gulp.dest('./www/css/'))//写css文件
        .pipe(rev.manifest('css-rev-manifest.json'))//生成 文件名->MD5后缀文件名 映射文件
        .pipe(gulp.dest('./www/'));//输出映射文件
});



gulp.task('js-revision', function (done) {

    return gulp.src(['./www/js/*.js'])//读取JS文件
        .pipe(rev())//文件名加MD5后缀
        .pipe(gulp.dest('./www/js/'))//写js文件
        .pipe(rev.manifest('js-rev-manifest.json'))//生成 文件名->MD5后缀文件名 映射文件
        .pipe(gulp.dest('./www/'));//输出映射文件
});

function replaceRevision(platform) {
    gulp.task(platform + '-replace', ['css-revision', 'js-revision'], function (done) {
         gulp.src('./src/' + platform + '/index.html')
            /*rev在改路径时候会生成一个映射表，用rev.manifest()即可储存在相应的目录里，
             然后rev-replace用这个文件替换掉你目标文件的路径即可。*/
            .pipe(revReplace({
                manifest: gulp.src('./www/css-rev-manifest.json')//读取css映射关系文件
            }))
            .pipe(revReplace({
                manifest: gulp.src('./www/js-rev-manifest.json')//读取js映射关系文件
            }))

            /*替换变量以及动态html*/
            .pipe(releaseTemplate({
                encode: 'UTF-8',//编码格式
                mobile: '/mobile/'//变量
            }))

            /*将映射关系文件写到www目录下*/
            .pipe(gulp.dest('./www/'));

      return gulp.src(['./src/' + platform + '/alipay.html','./src/' + platform + '/wxpay.html'])
            /*rev在改路径时候会生成一个映射表，用rev.manifest()即可储存在相应的目录里，
             然后rev-replace用这个文件替换掉你目标文件的路径即可。*/
            .pipe(revReplace({
              manifest: gulp.src('./www/css-rev-manifest.json')//读取css映射关系文件
            }))
            .pipe(revReplace({
              manifest: gulp.src('./www/js-rev-manifest.json')//读取js映射关系文件
            }))

            /*替换变量以及动态html*/
            .pipe(releaseTemplate({
              encode: 'UTF-8',//编码格式
              mobile: '/mobile/'//变量
            }))

            /*将映射关系文件写到www目录下*/
            .pipe(gulp.dest('./www/pay/'));


    });
}

/**
 * 读取index.html文件并输出
 * */
function copyIndexFile(platform) {
    gulp.task(platform + '-copy-index', function (done) {
        gulp.src('./src/' + platform + '/index.html')//读取index.html文件
            .pipe(gulp.dest('./www/'))//输出到www目录下
            .on('end', done);//执行下一个task
    });

}

/**
 * 读取wxpay.html 和alipay.html文件并输出
 * */
function copyPayFile(platform) {
    gulp.task('copy-wxpay', function (done) {
        gulp.src('./src/' + platform + '/wxpay.html')//读取wxpay.html文件
            .pipe(gulp.dest('./www/pay'))//输出到www目录下
            .on('end', done);//执行下一个task
    });

    gulp.task('copy-alipay', function (done) {
        gulp.src('./src/' + platform +  '/alipay.html')//读取alipay.html文件
            .pipe(gulp.dest('./www/pay'))//输出到www目录下
            .on('end', done);//执行下一个task
    });
}

/**
 * 创建任务
 * */
function createPlatformTask(platform) {
    var developTasks = ['sass'],
        releaseTasks = ['sass-release'];

    for (var key in paths[platform]) {
        developTasks.push(platform + '-' + key);//创建platform对象中各key值的任务
        releaseTasks.push(platform + '-' + key + '-release');//创建release版本 platform对象中各key值的任务
    }

    //注册任务 gulp site-0|site-1|site-2|site-3
    //for (var evKey in environment){
    gulp.task(platform+'-0', function () {
        //控制task执行顺序
        runSequence('clean','config-0', platform + '-copy-index','copy-wxpay','copy-alipay',  platform + '-temp', developTasks);
    }); //by xhl config-0 这个task 加入个种环境
    gulp.task(platform+'-1', function () {
        //控制task执行顺序
        runSequence('clean','config-1', platform + '-copy-index','copy-wxpay','copy-alipay', platform + '-temp', developTasks);
    });
    gulp.task(platform+'-2', function () {
        //控制task执行顺序
        runSequence('clean','config-2', platform + '-copy-index','copy-wxpay','copy-alipay', platform + '-temp', developTasks);
    });
    gulp.task(platform+'-3', function () {
        //控制task执行顺序
        runSequence('clean','config-3', platform + '-copy-index','copy-wxpay','copy-alipay',  platform + '-temp', developTasks);
    });
    //注册任务 gulp site-release
    gulp.task(platform + '-release', function () {
        //控制release版本task执行顺序
        runSequence(//'clean','config-'+environment[evKey],
            releaseTasks,
            platform + '-replace',

            'clean-rev');
    });
    // }
    //注册 release 任务

    gulp.task(platform+'-'+0+'-release',function(){console.log(0+"---------开发版---------");
        runSequence('clean','config-'+0, platform + '-copy-index','copy-wxpay','copy-alipay' , platform + '-temp', developTasks,platform+"-release");
    });
    gulp.task(platform+'-'+1+'-release',function(){console.log(1+"---------测试版---------");
        runSequence('clean','config-'+1, platform + '-copy-index','copy-wxpay','copy-alipay' , platform + '-temp', developTasks,platform+"-release");
    });
    gulp.task(platform+'-'+2+'-release',function(){console.log(2+"--------预备上线版----------");
        runSequence('clean','config-'+2, platform + '-copy-index','copy-wxpay','copy-alipay' , platform + '-temp', developTasks,platform+"-release");
    });
    gulp.task(platform+'-'+3+'-release',function(){console.log(3+"--------正式上线版----------");
        runSequence('clean','config-'+3, platform + '-copy-index','copy-wxpay','copy-alipay', platform + '-temp', developTasks,platform+"-release");
    });


}

/**
 * 添加文件监听  xhl
 * */
function createWatchTask(platform) {
    //
    gulp.watch(paths.common.templates,[platform + '-templates']);console.log('watch------->html文件');
    //监听sass文件
    gulp.task(platform + '-watch', function (done) {
        var platformPaths = paths[platform];
        for (var key in platformPaths) {
            console.log('监听开始---》'+key);
            gulp.watch(platformPaths[key], [platform + '-' + key]);//监听platform对象中各key值对应的文件
        }
    });
}
/*
 添加js文件监听 xhl
 */
function createJsWatch(platform){
    var platformPaths = paths[platform];
    for (var key in platformPaths) {
        console.log('--！@@@@@@@监听开始---》'+key);
        gulp.watch(platformPaths[key], [platform + '-' + key]);//监听platform对象中各key值对应的文件
    }

}
/*
 * 监听 scss xhl
 */
function createScssWatch(platform){
    gulp.watch(paths.sass, ['sass']);

}
/*
 * 编译 scss xhl
 */
gulp.task('sass-site',function(done){console.log('sass编译中site11--------');
    return sass(paths.sass)
        .on('error', function (err) {
            console.error('Error!--complie sass', err.message);
        })
        .pipe(
        gulp.dest('./www/css/'));
});

function replaceTemplate(platform) {
    gulp.task(platform + '-temp', function (done) {
        return gulp.src('./www/index.html')//读取index.html文件
            .pipe(releaseTemplate({
                encode: 'utf-8',//设置编码格式
                mobile: ''//替换页面变量
            }))
            .pipe(gulp.dest('./www/'));//将html输出
    });

}

gulp.task('default', ['sass', 'lint']);//默认任务

gulp.task('sass', function (done) {console.log("sass文件发生变化，同步到www 目录下。。。。。");
    gulp.src('./src/common/css/goodvan.scss')//读取css文件
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(gulp.dest('./www/css/'))//输出css文件到www/css目录下
        //.pipe(sass({errLogToConsole: true}))

        /*压缩css文件*/
        .pipe(minifyCss({
            keepSpecialComments: 0
        }))

/*        /!*重命名css文件*!/
        .pipe(rename({extname: '.min.css'}))*/

        /*输出css文件到www/css目录下*/
        .pipe(gulp.dest('./www/css/'))

        /*执行下一个任务*/
        .on('end', done);
});

gulp.task('sass-release', function (done) {
    gulp.src('./src/common/css/aiyaku.scss')
         .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        //.pipe(sass({errLogToConsole: true}))//我们没有用到，注释掉

        //增加私有变量前缀
        .pipe(autoprefixer({
            browsers: ['last 200 versions', '> 0.1%', 'Firefox ESR', 'Opera 12.1']
        }))

        /*压缩css文件*/
        .pipe(minifyCss({
            keepSpecialComments: 0
        }))

        /*输出压缩后的css文件*/
        .pipe(gulp.dest('./www/css/'))

        /*执行下一个任务*/
        .on('end', done);
});

gulp.task('clean', function (done) {
    return gulp.src(paths.clean)//读取需要clean的文件目录
        .pipe(clean());//执行clean操作
});

gulp.task('clean-rev', function (done) {
    return gulp.src(paths.cleanRev)//读取cleanRev的文件
        .pipe(clean());//执行clean操作
});

gulp.task('watch', function () {
    gulp.watch(paths.scss, ['sass']);//监听scss中文件的变化
});

gulp.task('lint', function () {
    gulp.src(paths.scripts)
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

gulp.task('install', ['git-check'], function () {
    return bower.commands.install()
        .on('log', function (data) {
            gutil.log('bower', gutil.colors.cyan(data.id), data.message);
        });
});

gulp.task('git-check', function (done) {
    if (!sh.which('git')) {
        console.log(
            '  ' + gutil.colors.red('Git is not installed.'),
            '\n  Git, the version control system, is required to download Ionic.',
            '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
            '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
        );
        process.exit(1);
    }
    done();
});
