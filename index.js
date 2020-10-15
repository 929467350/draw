/**
    * @github       https://github.com/929467350/draw
    * @description  手写签字版
    */
( function ( global, factory ) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
        typeof define === 'function' && define.amd ? define( factory ) :
            ( global = global || self, global.Draw = factory() );
}( this, ( function () {
    'use strict';

    var classCallCheck = function ( instance, Constructor ) {
        if ( !( instance instanceof Constructor ) ) {
            throw new TypeError( "Cannot call a class as a function" );
        }
    };

    var createClass = function () {
        function defineProperties ( target, props ) {
            for ( var i = 0; i < props.length; i++ ) {
                var descriptor = props[i];
                descriptor.enumerable = descriptor.enumerable || false;
                descriptor.configurable = true;
                if ( "value" in descriptor ) descriptor.writable = true;
                Object.defineProperty( target, descriptor.key, descriptor );
            }
        }

        return function ( Constructor, protoProps, staticProps ) {
            if ( protoProps ) defineProperties( Constructor.prototype, protoProps );
            if ( staticProps ) defineProperties( Constructor, staticProps );
            return Constructor;
        };
    }();


    var Draw = function () {
        function Draw () {
            var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
            classCallCheck( this, Draw );
            this.el = params.el || document.createElement( 'canvas' );
            this.state = {
                undopath: [],
                index: -1,
                old: void 0,
                isStart: false,
                width: params.width || 400,
                height: params.height || 400,
                lineWidth: params.lineWidth || 1,
                isTouch: 'ontouchstart' in window,
                strokeStyle: params.strokeStyle || '#333333'
            };
            var _state = this.state,
                width = _state.width,
                height = _state.height,
                lineWidth = _state.lineWidth;

            this.el.width = width * 2;
            this.el.height = height * 2;
            document.body.appendChild( this.el );
            this.ctx = this.el.getContext( '2d' );
            this.ctx.scale( 2, 2 );
            this.ctx.lineWidth = lineWidth;
            this.ctx.lineJoin = 'round';
            this.ctx.lineCap = 'round';
            this.init();
        }

        createClass( Draw, [{
            key: 'onStart',
            value: function onStart () {
                ++this.state.index;
                this.state.isStart = true;
            }
        }, {
            key: 'onMove',
            value: function onMove ( e ) {
                e.preventDefault();
                if ( !this.state.isStart ) return;
                var pos = this.pos( e );
                var index = this.state.index;

                this.ctx.strokeStyle = this.state.strokeStyle;
                if ( this.state.old ) {
                    this.ctx.beginPath();
                    this.ctx.moveTo( this.state.old.x, this.state.old.y );
                    this.ctx.lineTo( pos.x, pos.y );
                    this.ctx.stroke();
                }
                this.state.old = pos;
                if ( this.state.undopath[index] ) {
                    this.state.undopath[index].push( {
                        x: this.state.old.x,
                        y: this.state.old.y
                    } );
                } else {
                    this.state.undopath[index] = [{
                        x: this.state.old.x,
                        y: this.state.old.y,
                        strokeStyle: this.ctx.strokeStyle,
                        lineWidth: this.ctx.lineWidth
                    }];
                }
            }
        }, {
            key: 'onEnd',
            value: function onEnd () {
                this.state.old = void 0;
                this.state.isStart = false;
            }
        }, {
            key: 'pos',
            value: function pos ( e ) {
                var x = 0,
                    y = 0;
                if ( e.touches ) {
                    x = e.touches[0].pageX;
                    y = e.touches[0].pageY;
                } else {
                    x = e.offsetX / 2;
                    y = e.offsetY / 2;
                }
                return {
                    x: x,
                    y: y
                };
            }
        }, {
            key: 'ouput',
            value: function ouput () {
                // 输出图片
                return this.el.toDataURL();
            }
        }, {
            key: 'init',
            value: function init () {
                // 绑定事件
                var isTouch = this.state.isTouch;

                this.el.addEventListener( isTouch ? 'touchstart' : 'mousedown', this.onStart.bind( this ), false );
                this.el.addEventListener( isTouch ? 'touchmove' : 'mousemove', this.onMove.bind( this ), false );
                this.el.addEventListener( isTouch ? 'touchend' : 'mouseup', this.onEnd.bind( this ), false );
                this.el.addEventListener( isTouch ? 'touchcancel' : 'mouseout', this.onEnd.bind( this ), false );
            }
        }, {
            key: 'destroyed',
            value: function destroyed () {
                if ( this.el ) {
                    var isTouch = this.state.isTouch;
                    this.el.removeEventListener( isTouch ? 'touchstart' : 'mousedown', this.onStart.bind( this ) );
                    this.el.removeEventListener( isTouch ? 'touchmove' : 'mousemove', this.onMove.bind( this ) );
                    this.el.removeEventListener( isTouch ? 'touchend' : 'mouseup', this.onEnd.bind( this ) );
                    this.el.removeEventListener( isTouch ? 'touchcancel' : 'mouseout', this.onEnd.bind( this ) );
                }
            }
        }, {
            key: 'clear',
            value: function clear () {
                // 清除画布
                this.state.index = -1;
                this.state.undopath = [];
                this.ctx.clearRect( 0, 0, this.el.width, this.el.height );
            }
        }, {
            key: 'undo',
            value: function undo () {
                // 撤销
                this.state.index >= 0 && --this.state.index;
                this.state.undopath.pop();
                var undopath = this.state.undopath;
                this.ctx.clearRect( 0, 0, this.el.width, this.el.height );
                if ( undopath.length>0) {   
                    this.ctx.beginPath();
                    for ( var z = 0; z < undopath.length; ++z ) {
                        this.ctx.moveTo( undopath[z][0].x, undopath[z][0].y );
                        this.ctx.lineWidth = undopath[z][0].lineWidth;
                        this.ctx.strokeStyle = undopath[z][0].strokeStyle;
                        for ( var i = 0; i < undopath[z].length; ++i ) {
                            this.ctx.lineTo( undopath[z][i].x, undopath[z][i].y );
                        }
                    }
                    this.ctx.stroke();
                    this.ctx.closePath();
                } else {
                    this.state.undopath = [];
                }
            }
        }] );
        return Draw;
    }();

    return Draw;

} ) ) );
