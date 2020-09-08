  <pre><code>    //初始化
    var sign = new Draw( {
        // canvas:document.getElementById('canvas'),
        lineWidth: 10, // 线条宽度
        width: 400, // canvas 宽
        height: 400, //canvas 高
        strokeStyle: '#333333' // 线条颜色
    } );
    window.onload = function () {
        // 点击输出图片
        document.querySelector( '.ouput' ).onclick = function () {
            var img = new Image();
            img.style.width = '200px';
            img.src = sign.ouput();
            img.onload = function () {
                document.body.appendChild( img );
            }
            document.querySelector( 'img' ) &amp;&amp; document.querySelector( 'img' ).remove();
        }
        // 点击清除
        document.querySelector( '.clear' ).onclick = function () {
            sign.clear();
        }
        // 点击撤销
        document.querySelector( '.undo' ).onclick = function () {
            sign.undo();
        }
    }</code></pre>
