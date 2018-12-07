(function ($) {
  var app = new Vue({
    el: '#main',
    data: {
      query: {
        act: ''
      },
      activities: [],
      candownload: false
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

        var url = 'http://192.168.2.53:8082/upload?activityId=' + this.query.act
        this.toggleLoading($('#main'))

        var formData = new FormData()
        formData.append('upload', $('#fileUrl')[0].files[0])

        var xhr = new XMLHttpRequest()
        xhr.open('post', url)
        xhr.send(formData)

        xhr.onreadystatechange = function () {
          if (xhr.readyState === 4 && xhr.status === 204) {
              console.log(xhr)
              alert('上传名单成功！')
            } else {
             console.log(xhr)
            }
        }
        this.toggleLoading($('#main'))
      },
      clickDownload: function () {
        
      },
      toggleLoading: function ($element) {
        if ($element.hasClass('csspinner')) {
          $element.removeClass('csspinner line back-and-forth grow')
        } else {
          $element.addClass('csspinner line back-and-forth grow')
        }
      }
    },
    created: function () {
      this.getActivities()
    }
  })
})(jQuery)