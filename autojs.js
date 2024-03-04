auto()
if (device.sdkInt > 28) {
    //等待截屏权限申请并同意
    requestScreenCapture(false);
}
//申请截屏权限
if (!requestScreenCapture(false)) {
    log("请求截图失败");
    exit()
} else {
    log("已获得截图权限")
}
sleep(800)
var gamePackageName = "com.neowizgames.game.browndust2";
var gameStatus = 0
var currentApp
var stopWatchdog = false
let account = "quhao"
let accountPassword = "90u"
var url = "http://yy.yatousy.com/90/api9090.php";
http.post(url, {
    "act": account,
    "xx": accountPassword
}, {
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
    }
}, function (resp, err) {
    if (err) {
        console.error("请求失败: ", err);
        return;
    }
    var responseData = resp.body.string();
    console.log("服务器响应: ", responseData);
});
threads.start(function () {
    //此为守护进程，守护游戏是否卡死，并执行kill游戏及开启游戏
    while (true) {
        currentApp = currentPackage();
        if (currentApp !== gamePackageName) {
            app.launchPackage("com.neowizgames.game.browndust2")
            log("已经打开游戏")
            gameStatus = 0
            stopWatchdog = false
        }
        log("守护进程正常")
        log("watchdogStatus:",stopWatchdog)
        let x = 800;
        let y = 500;
        // 捕获初始颜色值
        let initialImg = captureScreen()
        sleep(1000)
        let initialColor = colors.toString(images.pixel(initialImg, x, y));
        log(initialColor)
        sleep(9000)
        let currentImg = captureScreen()
        sleep(1000)
        log("守护进程正常2")
        let currentColor = colors.toString(images.pixel(currentImg, x, y));
        log(currentColor)
        if (currentColor === initialColor&& stopWatchdog === false) {
            sleep(8000)
            let secoundImg = captureScreen()
            sleep(1000)
            let secoundColor = colors.toString(images.pixel(secoundImg, x, y));
            log("守护进程正常3");
            log("游戏可能卡死了。")
            if (secoundColor === initialColor && stopWatchdog === false) {
                app.openAppSetting("com.neowizgames.game.browndust2")
                sleep(500)
                var stopView = id("com.android.settings:id/button2_negative").findOne();
                stopView.click();
                sleep(500)
                var trueView = id("android:id/button1").findOne();
                trueView.click();
                sleep(500)
                log("守护进程生效")
                secoundImg.recycle()
            }
            // 如果颜色未变，认为游戏可能卡死
            // 在这里添加你的处理逻辑
        } else {
            // 更新初始颜色值为当前颜色值
            initialColor = currentColor;
            log("游戏运行正常。");
        }
        sleep(5000)
        initialImg.recycle();
        currentImg.recycle();

    }
})

//游戏进程，不允许写守护进程内容
while (true) {
    // 通过currentPackage()获取当前运行的应用的包名
    // 检查当前运行的应用是否是你指定的游戏
    log("游戏步骤守护进程正常");
    currentApp = currentPackage();
    if (currentApp == gamePackageName) {
        log("游戏及游戏步骤守护进程正常");
        log(gameStatus)
        // 定时检测游戏状态
        if (gameStatus === 0) {
            let zeroStepLoginColor = "#bbb7b0"
            let zeroStepPoint = findColor(captureScreen(), zeroStepLoginColor, {
                threshold: 1
            });
            sleep(500)
            let zeroTwoStepPointColor = "#ffffff"
            let zeroTwoStepPoint = findColor(captureScreen(), zeroTwoStepPointColor);
            if (zeroStepPoint) {
                if (zeroTwoStepPoint) {
                    sleep(2000)
                    longClick(zeroTwoStepPoint.x, zeroTwoStepPoint.y)
                }
            }
            let gamePic = images.read("/sdcard/autojs/loadLogo.png")
            var findResult = images.findImage(captureScreen(), gamePic, {
                threshold: 0.8
            });
            sleep(800)
            log("找到的坐标", findResult)
            if (findResult) {
                log("已经开始游戏")
                gameStatus = 1
                stopWatchdog = true
                sleep(15000)
                stopWatchdog = false
                gamePic.recycle()
            }
        }
        if (gameStatus === 1) {
            //let ocrGameStatus = paddle.ocrText(captureScreen(),[useSlim=true,cpuThreadNum=2]);
            //sleep(2500)
            //Log("识别信息: " + JSON.stringify(ocrGameStatus))
            let gameid = 1696860888453;
            let shuliang = 50;
            let shuliang1 = 5
            http.post(url, {
                "act": "up",
                "xx": accountPassword,
                "myid": gameid,
                "state": 1,
                "shuliang": shuliang,
                "shuliang1": shuliang1
            }, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }, function (resp, err) {
                if (err) {
                    console.error("请求失败: ", err);
                    return;
                }
                var responseData = resp.body.string();
                console.log("服务器响应: ", responseData);
                // 这里可以添加更多的代码来处理responseData，比如解析JSON数据
            });


        }
    }
    // 等待5秒后再次检查
    sleep(3000);
}
