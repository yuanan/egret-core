/**
 * Copyright (c) Egret-Labs.org. Permission is hereby granted, free of charge,
 * to any person obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish, distribute,
 * sublicense, and/or sell copies of the Software, and to permit persons to whom
 * the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included
 * in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
 * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
 * PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE
 * FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
 * ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

/// <reference path="../../../egret/events/Event.ts"/>
/// <reference path="../../../egret/events/EventDispatcher.ts"/>
/// <reference path="../events/CollectionEvent.ts"/>
/// <reference path="../events/CollectionEventKind.ts"/>

module ns_egret {

	export class ArrayCollection extends EventDispatcher implements ICollection{
		/**
		 * 构造函数
		 * @param source 数据源
		 */		
		public constructor(source:Array = null){
			super();
			if(source){
				this._source = source;
			}
			else{
				this._source = [];
			}
		}
		
		private _source:Array;
		/**
		 * 数据源
		 * 通常情况下请不要直接调用Array的方法操作数据源，否则对应的视图无法收到数据改变的通知。
		 * 若对数据源进行了排序或过滤等操作，请手动调用refresh()方法刷新数据。<br/>
		 */
		public get source():Array{
			return this._source;
		}

		public set source(value:Array){
			if(!value)
				value = [];
			this._source = value;
			this.dispatchCoEvent(CollectionEventKind.RESET);
		}
		/**
		 * 在对数据源进行排序或过滤操作后可以手动调用此方法刷新所有数据,以更新视图。
		 */		
		public refresh():void{
			this.dispatchCoEvent(CollectionEventKind.REFRESH);
		}
		/**
		 * 是否包含某项数据
		 */		
		public contains(item:any):boolean{
			return this.getItemIndex(item)!=-1;
		}
		
		/**
		 * 检测索引是否超出范围
		 */		
		private checkIndex(index:number):void{
			if(index<0||index>=this._source.length){
				throw new RangeError("索引:\""+index+"\"超出集合元素索引范围");
			}
		}
		
		//--------------------------------------------------------------------------
		//
		// ICollection接口实现方法
		//
		//--------------------------------------------------------------------------
		/**
		 * @inheritDoc
		 */
		public get length():number{
			return this._source.length;
		}
		/**
		 * 向列表末尾添加指定项目。等效于 addItemAt(item, length)。
		 */	
		public addItem(item:any):void{
			this._source.push(item);
			this.dispatchCoEvent(CollectionEventKind.ADD,this._source.length-1,-1,[item]);
		}
		/**
		 * 在指定的索引处添加项目。
		 * 任何大于已添加项目的索引的项目索引都会增加 1。
		 * @throws RangeError 如果索引小于 0 或大于长度。
		 */	
		public addItemAt(item:any, index:number):void{
			if(index<0||index>this._source.length){
				throw new RangeError("索引:\""+index+"\"超出集合元素索引范围");
			}
			this._source.splice(index,0,item);
			this.dispatchCoEvent(CollectionEventKind.ADD,index,-1,[item]);
		}
		/**
		 * @inheritDoc
		 */
		public getItemAt(index:number):any{
			return this._source[index];
		}
		/**
		 * @inheritDoc
		 */
		public getItemIndex(item:any):number{
			var length:number = this._source.length;
			for(var i:number=0;i<length;i++){
				if(this._source[i]===item){
					return i;
				}
			}
			return -1;
		}
		/**
		 * 通知视图，某个项目的属性已更新。
		 */
		public itemUpdated(item:any):void{
			var index:number = this.getItemIndex(item);
			if(index!=-1){
				this.dispatchCoEvent(CollectionEventKind.UPDATE,index,-1,[item]);
			}
		}
		/**
		 * 删除列表中的所有项目。
		 */
		public removeAll():void{
			var items:Array = this._source.concat();
			this._source.length = 0;
			this.dispatchCoEvent(CollectionEventKind.REMOVE,0,-1,items);
		}
		/**
		 * 删除指定索引处的项目并返回该项目。原先位于此索引之后的所有项目的索引现在都向前移动一个位置。
		 * @throws RangeError 如果索引小于 0 或大于长度。
		 */
		public removeItemAt(index:number):any{
			this.checkIndex(index);
			var item:any = this._source.splice(index,1)[0];
			this.dispatchCoEvent(CollectionEventKind.REMOVE,index,-1,[item]);
			return item;
		}
		/**
		 * 替换在指定索引处的项目，并返回该项目。
		 * @throws RangeError 如果索引小于 0 或大于长度。
		 */
		public replaceItemAt(item:any, index:number):any{
			this.checkIndex(index);
			var oldItem:any = this._source.splice(index,1,item)[0];
			this.dispatchCoEvent(CollectionEventKind.REPLACE,index,-1,[item],[oldItem]);
			return oldItem;
		}
		/**
		 * 用新数据源替换原始数据源，此方法与直接设置source不同，它不会导致目标视图重置滚动位置。
		 * @param newSource 新的数据源
		 */		
		public replaceAll(newSource:Array):void{
			if(!newSource)
				newSource = [];
			var newLength:number = newSource.length;
			var oldLenght:number = this._source.length;
			for(var i:number = newLength;i<oldLenght;i++){
				this.removeItemAt(newLength);
			}
			for(i=0;i<newLength;i++){
				if(i>=oldLenght)
					this.addItemAt(newSource[i],i);
				else
					this.replaceItemAt(newSource[i],i);
			}
			this._source = newSource;
		}
		/**
		 * 移动一个项目
		 * 在oldIndex和newIndex之间的项目，
		 * 若oldIndex小于newIndex,索引会减1
		 * 若oldIndex大于newIndex,索引会加1
		 * @return 被移动的项目
		 * @throws RangeError 如果索引小于 0 或大于长度。
		 */	
		public moveItemAt(oldIndex:number,newIndex:number):any{
			this.checkIndex(oldIndex);
			this.checkIndex(newIndex);
			var item:any = this._source.splice(oldIndex,1)[0];
			this._source.splice(newIndex,0,item);
			this.dispatchCoEvent(CollectionEventKind.MOVE,newIndex,oldIndex,[item]);
			return item;
		}
		
		/**
		 * 抛出事件
		 */		
		private dispatchCoEvent(kind:string = null, location:number = -1,
										 oldLocation:number = -1, items:Array = null,oldItems:Array=null):void{
			var event:CollectionEvent = new CollectionEvent(CollectionEvent.COLLECTION_CHANGE,false,false,
				kind,location,oldLocation,items,oldItems);
			this.dispatchEvent(event);
		}
	}
}