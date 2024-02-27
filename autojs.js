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
let gamePackageName = "com.neowizgames.game.browndust2";
let gameStatus = 0
let stopWatchdog = false

threads.start(function () {
    //此为守护进程，守护游戏是否卡死
    while (true) {

        let x = 800;
        let y = 500;
        // 捕获初始颜色值
        var initialImg = captureScreen()
        sleep(1000)
        let initialColor = colors.toString(images.pixel(initialImg, x, y));
        log(initialColor)
        sleep(9000)
        var currentImg = captureScreen()
        sleep(1000)
        let currentColor = colors.toString(images.pixel(currentImg, x, y));
        log(currentColor)
        if (currentColor === initialColor) {
            sleep(8000)
            var secoundImg = captureScreen()
            sleep(1000)
            let secoundColor = colors.toString(images.pixel(secoundImg, x, y));
            if (secoundColor === initialColor && stopWatchdog === true) {
                app.openAppSetting("com.neowizgames.game.browndust2")
                sleep(500)
                var stopView = id("com.android.settings:id/button2_negative").findOne();
                stopView.click();
                sleep(500)
                var trueView = id("android:id/button1").findOne();
                trueView.click();
                sleep(500)
                app.launchPackage("com.neowizgames.game.browndust2")
            }
            // 如果颜色未变，认为游戏可能卡死
            toast("游戏可能卡死了。")


            // 在这里添加你的处理逻辑
        } else {
            // 更新初始颜色值为当前颜色值
            initialColor = currentColor;
            log("游戏运行正常。");
        }
        sleep(5000)
    }
})

// 使用一个无限循环，始终检查指定的游戏是否正在运行
while (true) {
    // 通过currentPackage()获取当前运行的应用的包名
    let currentApp = currentPackage();
    // 检查当前运行的应用是否是你指定的游戏
    if (currentApp == gamePackageName) {
        log("游戏已经打开");
        // 定时检测游戏状态
        if (gameStatus === 0) {
            let zeroStepLoginColor = "#bbb7b0"
            let zeroStepPoint = findColor(captureScreen(), zeroStepLoginColor, {
                threshold: 4
            });
            sleep(500)
            let zeroTwoStepPointColor = "#ffffff"
            let zeroTwoStepPoint = findColor(captureScreen(), zeroTwoStepPointColor);
            if (zeroStepPoint) {
                if (zeroTwoStepPoint) {
                    sleep(2000)
                    longClick(zeroTwoStepPoint.x, zeroTwoStepPoint.y)
                    log("已经开始游戏")
                    gameStatus = 1
                }
            }
        }
        if (gameStatus === 1) {
            let TwoOneStepColor = "#161616"
            sleep(500)
            let twoOneStepPoint = findColor(captureScreen(), TwoOneStepColor, {
                threshold: 2
            });
            if (twoOneStepPoint) {
                stopWatchdog = true
                sleep(10000)
                stopWatchdog = false
                log("成功测试")
            }
        }


    } else {
        toast("游戏尚未打开");
        app.launchPackage("com.neowizgames.game.browndust2")
        gameStatus = 0
        sleep(10000)
    }

    // 等待5秒后再次检查
    sleep(5000);
}
