chain-select
============

chain select by pure javascript fit angularjs

**链式选择插件，兼容Angularjs**

*包含中华人民共和国行政区划代码（2014年版），若要使用，需引入文件citys.js 并做为 selectData 变量传入。*


#####用法(Usage)：

>     element.addEventListener('change', function (e) {
>       console.log(e.detail);
>     }, false);
>     selectBoxs.show(element, selectData, [fillBack]);

#####传入数据格式（以选择年月为例）：

    var selectData = [
      {"defaultText": "请选择年份", "linkIds": {"0": [
        {"id": "2013", "text": "2013"},
        {"id": "2014", "text": "2014"}
      ]}},
      {"defaultText": "请选择月份", "linkIds": {"2013": [
        {"id": "01", "text": "01"},
        {"id": "02", "text": "02"},
        {"id": "03", "text": "03"}
      ], "2014": [
        {"id": "04", "text": "01"},
        {"id": "05", "text": "02"},
        {"id": "06", "text": "03"}
      ]}}
    ];

#####回填数据格式（可选）：

    var fillBack = [
      {"id": "2014", "text": "2014"},
      {"id": "06", "text": "03"}
    ];

#####附带工具：

>     过滤得到的数据：
>     selectBoxs.filter('id', fillBack);
>     结果为：['2014', '06'];
>     
>     从ID得到fillBack：
>     var fillBack = selectBoxs.genFillById(selectData, '06');
>     结果为：fillBack;
