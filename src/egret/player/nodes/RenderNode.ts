//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-2015, Egret Technology Inc.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////

module egret.sys {
    /**
     * @private
     * 渲染节点类型
     */
    export const enum RenderNodeType {
        /**
         * 位图渲染节点
         */
        BitmapNode = 1,
        /**
         * 文本渲染节点
         */
        TextNode,
        /**
         * 矢量渲染节点
         */
        GraphicsNode,
        /**
         * 组渲染节点
         */
        GroupNode,
        /**
         * 设置矩阵节点
         */
        SetTransformNode,
        /**
         * 设置透明度节点
         */
        SetAlphaNode
    }

    /**
     * @private
     * 渲染节点基类
     */
    export class RenderNode {

        /**
         * 节点类型..
         */
        public type:number = 0;
        /**
         * 是否需要重绘的标志。
         */
        public needRedraw:boolean = false;
        /**
         * 这个对象在舞台上的整体透明度
         */
        public renderAlpha:number = 1;
        /**
         * 这个对象在舞台上的透明度
         */
        public renderVisible:boolean = true;
        /**
         * 相对于显示列表根节点或位图缓存根节点上的矩阵对象
         */
        public renderMatrix:Matrix = new Matrix();
        /**
         * 此显示对象自身（不包括子项）在显示列表根节点或位图缓存根节点上的显示尺寸。
         */
        public renderRegion:sys.Region = new sys.Region();
        /**
         * 是否发生移动
         */
        public moved:boolean = false;
        /**
         * 绘制数据
         */
        public drawData:any[] = [];
        /**
         * 绘制次数
         */
        protected renderCount:number = 0;
        /**
         * 在显示对象的$render()方法被调用前，自动清空自身的drawData数据。
         */
        public cleanBeforeRender():void{
            this.drawData.length = 0;
            this.renderCount = 0;
        }

        public $getRenderCount():number {
            return this.renderCount;
        }
    }
}