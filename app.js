(function ($) {
  var app = new Vue({
    el: '#main',
    data: {
      query: {
        act: '',
        time: '',
        nextAct: ''
      },
      time:'',
      activities: [],
      title: '',
      policies: '',
      selectList:[],
      selectedStatus: []
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
        } else if(this.selectList.length === 0){
          alert('请输入号码表头！')
          return
        } else if(this.policies === ''){
          this.policies = this.selectList.join()
        }

        this.title = this.selectList.join()

        var url = 'http://192.168.2.40:8082/rosters?activityId=' + this.query.act + '&title=' + this.title + '&policy=' + this.policies

        this.toggleLoading($('#main'))

        var formData = new FormData()
        formData.append('file', $('#fileUrl')[0].files[0])

        var xhr = new XMLHttpRequest()
        xhr.open('post', url)
        xhr.send(formData)

        xhr.onreadystatechange = function () {
          if (xhr.readyState === 4) {
            if(xhr.status === 204){
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
        if(this.query.nextAct === ''){
          alert('活动是必选项，不能为空！')
          return 
        } else if(this.query.time === ''){
          alert('请先选择时间，再导出呼叫结果！')
          return 
        }

        this.time = this.query.time.split('-').join('')
        this.toggleLoading($('#main'))
        var path = 'http://192.168.2.53:8082/rosters/download?activityId='+ this.query.nextAct + '&date=' + this.time

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
      getValue: function () {
        this.policies = this.selectedStatus.join()
       },
       writeTab: function (e) {
         var patt = /^[0-9a-zA-Z,]*$/
         if(!patt.test(e.target.value)){
            alert('请输入正确格式的号码表头！')
            return
         } 

         var data = e.target.value
         this.selectList = data.split(',').filter((item) => {
            return item !== ''
          })

          this.selectedStatus = this.selectList
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