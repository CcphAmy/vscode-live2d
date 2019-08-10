function addElement(elementName, src, target) {
  var tempDom = document.createElement(elementName);

  tempDom.src = src;
  tempDom.href = src;
  tempDom.rel = 'stylesheet';

  (target || document.body).appendChild(tempDom);
  return new Promise(resolve => {
    tempDom.onload = res => {
      setTimeout(resolve, 0, res);
    };
  });
}
var tempDiv = document.createElement('div');
tempDiv.innerHTML = `
            <div class="waifu">
            <div class="waifu-tips"></div>
            <canvas id="live2d" width='140' height="125" class="live2d"></canvas>
            <div class="waifu-tool">
                <span class="fui-chat"></span>
                <span class="fui-eye"></span>
                <span class="fui-user"></span>
                <span class="fui-photo"></span>
            </div>
            </div>
  `;
document.body.appendChild(tempDiv.children[0]);
addElement('link', './assets/waifu.css');
addElement('script', './assets/jquery.min.js')
  .then(() => addElement('script', './assets/live2d.js'))
  .then(() => addElement('script', './assets/model.js'))
  .then(() => addElement('script', './assets/message.js'))
  .then(() => {
    setTimeout(() => {
      loadlive2d('live2d', 'models/1/tia/model.json');
      loadlive2d('live2d', 'models/KantaiCollection/murakumo/index.json');
    });
  });
