(function ($) {
  var app = new Vue({
    el: '#main',
    data: {
      query: {
        act: '',
        time: ''
      },
      time:'',
      activities: [],
      checkValue: '',
      policies: '',
      selectList:[]
    },
    methods: {
      getActivities: function () {
        var that = this
        var payload = {
          'identifyInfo': "lf.cc",
          'pageNum': "9999",
          'startPage': "1"
        }

        axios.post('http://192.168.40.134:31003/ocm/v1/activity/list/',payload)
          .then(function (res) {
            that.activities = res.data
            console.log(res.data)
          })
          .catch(function (error) {
            console.log(error)
            alert('查询所有活动失败，请刷新尝试！')
          })
        
      },
      checkForm: function () {
        if(this.query.act === ''){
          alert('活动是必选项，不能为空！')
          return 
        } else if (!$('#fileUrl').val()){
          alert('请选择一个名单文件！')
          return
        } 

        
        if(this.selectList.length === 0){
          this.policies = 'm0,h0,b0,b1,m1,b2,m2'
        } else {
          this.policies = this.checkValue
        }

        console.log(this.policies)

        var url = 'http://192.168.2.53:8082/upload?activityId=' + this.query.act + '&policies=' + this.policies
        this.toggleLoading($('#main'))

        var formData = new FormData()
        formData.append('upload', $('#fileUrl')[0].files[0])

        var xhr = new XMLHttpRequest()
        xhr.open('post', url)
        xhr.send(formData)

        xhr.onreadystatechange = function () {
          if (xhr.readyState === 4) {
            if(xhr.status === 200){
              alert('上传名单成功！')
            } else {
              alert('上传名单失败！')
            }
          }
        }
        this.toggleLoading($('#main'))  
      },
      initDatetime: function () {
        var that = this
        laydate.render({
          elem: '#get_laydate',
          type: 'date',
          range: false,
          done: function (value, date, endDate) {
            that.query.time = value
          }
        })
      },
      clickDownload: function (e) {
        if(this.query.act === ''){
          alert('活动是必选项，不能为空！')
          return 
        } else if(this.query.time === ''){
          alert('请先选择时间，再导出呼叫结果！')
          return 
        }

        this.time = this.query.time.split('-').join('')
        this.toggleLoading($('#main'))
        var path = 'http://192.168.2.53:8082/rosters/download?activityId='+ this.query.act + '&date=' + this.time

        var that = this
        var $a = document.getElementById('a-link-for-download')
        var xhr = new XMLHttpRequest()
        xhr.open('get', path)
        // xhr.setRequestHeader('Content-Type', 'application/octet-stream')
        // xhr.setRequestHeader('Content-Disposition','form-data; name="attachment"; filename="callresult2CSM.'+ this.time + '.000000.0000.dat"')
        
        xhr.send(null)
        xhr.responseType = 'blob'
        xhr.onreadystatechange = function () {
          if (xhr.readyState === 4) {
            if(xhr.status === 200){
              $a.href = window.URL.createObjectURL(xhr.response)
              $a.download = 'callresult2CSM.'+ that.time + '.000000.0000.dat'
              $a.click()
            } else {
              console.log(xhr)
              alert('导出失败，请重新尝试！')
          }
        }
      }
        this.toggleLoading($('#main'))
      },
      toggleLoading: function ($element) {
        if ($element.hasClass('csspinner')) {
          $element.removeClass('csspinner line back-and-forth grow')
        } else {
          $element.addClass('csspinner line back-and-forth grow')
        }
      },
      getValue: function (e) {
         var hobbies = e.target
         var value

        if(hobbies.checked){
          this.selectList.push(hobbies.value)
        }else{
          var index = this.selectList.findIndex(function(item){
            return item === hobbies.value
          })
          this.selectList.splice(index,1)
        }
        this.checkValue =  this.selectList.join()
        console.log(this.selectList)

       }
    },
    created: function () {
      this.getActivities()
    },
    mounted: function () {
      this.initDatetime()
    }
  })
})(jQuery)