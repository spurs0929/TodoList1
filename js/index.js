(function (node) {
  var TodoList = function () {
    // 儲存this
    var _self = this;
    // wrap元素
    this.node = node;
    // 輸入框顯示狀態
    this.inputShow = false;
    // 新增/編輯boolean
    this.isEdit = false;
    // 儲存目前索引
    this.curIdx = null;

    // 默認設置參數
    this.dConfig = {
      "plusBtn": "",
      "inputArea": "",
      "addBtn": "",
      "list": "",
      "itemClass": ""
    }

    // 儲存配置物件
    this.config = this.getConfig();
    // 儲存配置物件的className
    this.itemClass = this.config.itemClass;

    // for迴圈列舉配置項屬性
    for (var key in this.dConfig) {
      // 使用hasOwnProperty檢查傳入的配置項是否有缺漏
      if (!this.config.hasOwnProperty(key)) {
        console.log(errorInfo(key));
        return;
      }
    }

    // 執行設置配置項方法
    this.setConfig();

    // 在'+'按鈕綁定click事件處理函數
    addEvent(this.plusBtn, 'click', function () {
      // 实例化物件执行顯示/隱藏輸入框方法
      _self.showInput.call(_self);
    });

    // 在'新增項目/編輯'按鈕綁定click事件處理函數
    addEvent(this.addBtn, 'click', function () {
      // 实例化物件执行新增/编辑方法
      _self.addBtnClick.call(_self);
    });

    // 在list綁定click事件處理函數
    addEvent(this.oList, 'click', function (e) {
      // 儲存事件源物件（编辑/移除）
      var e = e || window.event,
        tar = e.target || e.srcElement;

      // 实例化物件根据點擊的事件源物件执行'编辑/删除'操作
      _self.listClick.call(_self, tar);
    });

  }

  TodoList.prototype = {
    // 獲取配置物件
    getConfig: function () {
      return JSON.parse(this.node.getAttribute('data-config'));
    },

    // 設置配置項
    setConfig: function () {
          // 儲存配置項
      var config = this.config,
          // 儲存wrap元素
          node = this.node;
      // 儲存輸入框wrap元素
      this.inputArea = node.getElementsByClassName(config.inputArea)[0];
      // 儲存新增/编辑按鈕元素
      this.addBtn = this.inputArea.getElementsByClassName(config.addBtn)[0];
      // 儲存'+'按鈕元素
      this.plusBtn = node.getElementsByClassName(config.plusBtn)[0];
      // 儲存list元素
      this.oList = node.getElementsByClassName(config.list)[0];
      // 儲存input元素
      this.content = this.inputArea.getElementsByClassName('content')[0];
    },

    // 顯示/隱藏輸入框
    showInput: function () {
      var _self = this;

      // 如果輸入框是顯示狀態
      if (this.inputShow) {
        // 隱藏輸入框，並修改參數為'close'
        setInputShow.call(_self, 'close');
        // 如果輸入框是隱藏狀態
      } else {
        // 顯示輸入框，並修改參數為'open'
        setInputShow.call(_self, 'open');
      }
    },

    // 新增/編輯
    addBtnClick: function () {
          // 儲存this指向
      var _self = this,
          // 輸入框内容
          content = this.content.value,
          // 輸入框長度
          contentLen = content.length,
          // li元素集合
          oItems = this.oList.getElementsByClassName('item'),
          // list元素集合長度
          itemLen = oItems.length,
          text;

      // 輸入內容為空
      if (contentLen <= 0) {
        return;
      }

      // list集合不為空
      if (itemLen > 0) {
        // for迴圈遍歷list集合的每個元素的innerText
        for (var i = 0; i < itemLen; i++) {
          text = elemChildren(oItems[i])[0].innerText;

          // 輸入內容重複
          if (text === content) {
            alert('輸入重複內容');
            return;
          }
        }
      }

      // 編輯操作
      if (this.isEdit) {
        // 修改目前點擊元素的innerText
        elemChildren(oItems[this.curIdx])[0].innerText = content;
        // 修改輸入框狀態為新增
        setInputStatus.apply(_self, [oItems, null, 'add']);
      
        // 新增操作
      } else {
        // 創建li
        var oLi = document.createElement('li');
        // 給li設置className
        oLi.classList = this.itemClass;
        // 用模板替換li的innerHTML
        oLi.innerHTML = itemTpl(content);
        // 將li新增到ul中的最後一項
        this.oList.appendChild(oLi);
      }
      // 設置輸入框顯示與否
      setInputShow.call(_self, 'close');
    },

    // 依傳入的事件源物件执行编辑/删除操作
    listClick: function (tar) {
          // 儲存this指向
      var _self = this,
        // 儲存事件源物件的className
        className = tar.className,
        // 尋找事件源的父節點
        oParent = elemParent(tar, 2),
        // 儲存li元素集合
        oItems = this.oList.getElementsByClassName('item'),
        // 儲存li元素集合長度
        itemLen = oItems.length,
        item;
      
      // 點擊編輯
      if (className === 'edit-btn fa fa-edit') {
        // for迴圈遍歷li重置className
        for (var i = 0; i < itemLen; i++) {
          item = oItems[i];
          item.className = 'item';
        }
        // 给點擊的li新增active className
        oParent.className += ' active';
        // 設置輸入框顯示與否
        setInputShow.call(_self, 'open');
        // 修改輸入框狀態
        setInputStatus.call(_self, oItems, oParent, 'edit');
        
        // 點擊刪除
      } else if (className === 'remove-btn fa fa-times') {
        // 移除元素
        oParent.remove();
      }
    }
  }

  // 依傳入action設置輸入框顯示與否
  function setInputShow (action) {
    var oItems = this.oList.getElementsByClassName('item');
    // 'open'
    if (action === 'open') {
      // 顯示輸入框
      this.inputArea.style.display = 'block';
      // 設置輸入框顯示狀態
      this.inputShow = true;

      // close
    } else if (action === 'close') {
      this.inputArea.style.display = 'none';
      // 設置輸入框顯示狀態
      this.inputShow = false;
      // 清空輸入框内容
      this.content.value = '';
      // 傳入參數修改輸入框狀態
      setInputStatus.apply(this, [oItems, null, 'add']);
    }
  }

  // 依傳入參數修改輸入框狀態
  function setInputStatus (oItems, target, status) {
    // 編輯操作
    if (status === 'edit') {
          // 獲取index
      var idx = Array.prototype.indexOf.call(oItems, target),
          // 獲取點擊元素的第一個子元素的innerText
          text = elemChildren(target)[0].innerText;

      // 修改innnerText内容
      this.addBtn.innerText = '編輯第' + (idx + 1) + '項';
      // 修改操作為 編輯
      this.isEdit = true;
      // 儲存目前index
      this.curIdx = idx;
      // 儲存編輯内容
      this.content.value = text;
      
      // 新增操作
    } else if (status === 'add') {
      // 獲取li元素集合
      var itemLen = oItems.length,
          item;

      // for遍歷list元素集合
      for (var i = 0; i < itemLen; i++) {
        item = oItems[i];

        // 重置className
        item.className = 'item';
        // 修改innerText内容
        this.addBtn.innerText = '新增項目';
        // 修改操作為 新增
        this.isEdit = false;
        // 重置index
        this.curIdx = null;
      }
    }
  }

  // 沒有設置參數時，拋出錯誤提示
  function errorInfo (key) {
    return new Error(
      '您沒有配置參數' + key + '\n' +
      '必須配置的參數列表如下：\n' +
      '打開輸入框按鈕元素className：plusBtn\n' +
      '輸入框區域元素className：inputArea\n' +
      '增加項目按鈕元素className：list\n' +
      '列表項承載元素className：itemClass'
    );
  }

  // 模板替換
  function itemTpl (text) {
    return (
      '<p class="item-content">' + text + '</p>' +
      '<div class="btn-group">' +
      '<a href="javascript:;" class="edit-btn fa fa-edit"></a>' +
      '<a href="javascript:;" class="remove-btn fa fa-times"></a>' +
      '</div>'
    );
  }
  // 實例化物件
  new TodoList();
})(document.getElementsByClassName('todo-wrap')[0]);