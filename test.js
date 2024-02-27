auto.waitFor()

toast('starting...')

if (device.sdkInt > 28) {
    //等待截屏权限申请并同意
    threads.start(function () {
        packageName('com.android.systemui').text('立即开始').waitFor();
        sleep(5000)
        text('立即开始').click();
    });
}

//setScreenMetrics(1080, 1920);
requestScreenCapture(false)
sleep(1000)

images.captureScreen('/sdcard/3.png')
sleep(100)

//const data = images.readPixels('/sdcard/1.png')
//console.log(data.data, data.width, data.height)

const myImage = images.read('/sdcard/3.png')
sleep(100)

const myColor = images.pixel(myImage, 20, 20)
toast(colors.toString(myColor))
