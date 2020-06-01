<template>
  <div class="reports">
    <div class="chart-one">
      <highcharts :options="chartOptions" :callback="myCallback"></highcharts>
    </div>
    <div class="chart-two">
      <highcharts :options="chartOptions2" :callback="myCallback"></highcharts>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      chartOptions: {
        title: {
          text: '页面访问人数'
        },
        subtitle: {
          text: ''
        },
        credits: {
          enabled: false
        },
        xAxis: {
          categories: [],
          max: 6,
          labels: {
            style: {
              color: '#999',
              'font-family': 'PingFangSC-Regular,PingFang SC'
            }
          },
          crosshair: {
            color: '#FFF0E5'
          }
        },
        yAxis: {
          min: 0,
          title: {
            text: '总数（个）',
            style: { color: '#999' },
            rotation: 0,
            align: 'high',
            offset: 0,
            x: 10,
            y: -23
          },
          labels: {
            format: '{value}',
            style: {
              color: '#999'
            }
          },
          lineColor: '#ccc',
          lineWidth: 1,
          tickWidth: 1,
          minorTickColor: '#ccc',
          stackLabels: {
            // 堆叠数据标签
            enabled: true,
            style: {
              fontWeight: 'normal',
              color: 'gray'
            }
          }
        },
        tooltip: {
          headerFormat: '<span>{point.key}</span><table>',
          pointFormat:
            '<tr><td>{series.name}: </td>' + '<td> {point.y} 个</td></tr>',
          footerFormat: '</table>',
          shared: true,
          shadow: false,
          backgroundColor: 'rgba(0,0,0,0.6)',
          borderRadius: 10,
          padding: 10,
          style: {
            color: 'rgba(255,255,255,0.9)',
            'font-family': 'PingFang-SC-Medium,PingFang-SC'
          },
          useHTML: true
        },
        series: [
          {
            name: '安装，实施人员',
            dashStyle: 'solid',
            data: [43934, 52503, 57177, 69658, 97031, 119931, 137133, 154175]
          },
          {
            name: '工人',
            dashStyle: 'ShortDashDot',
            data: [24916, 24064, 29742, 29851, 32490, 30282, 38121, 40434]
          },
          {
            name: '销售',
            dashStyle: 'LongDashDotDot',
            data: [11744, 17722, 16005, 19771, 20185, 24377, 32147, 39387]
          },
          {
            name: '项目开发',
            dashStyle: 'LongDashDot',
            data: [null, null, 7988, 12169, 15112, 22452, 34400, 34227]
          }
        ],
        responsive: {
          rules: [
            {
              condition: {
                maxWidth: 500
              },
              chartOptions: {
                legend: {
                  layout: 'horizontal',
                  align: 'center',
                  verticalAlign: 'bottom'
                }
              }
            }
          ]
        }
      },
      chartOptions2: {
        chart: {
          type: 'column'
          // type: 'bar',
        },
        title: {
          text: '页面访问人数'
        },
        subtitle: {
          text: ''
        },
        credits: {
          enabled: false
        },
        xAxis: {
          categories: [],
          max: 6,
          labels: {
            style: {
              color: '#999',
              'font-family': 'PingFangSC-Regular,PingFang SC'
            }
          },
          crosshair: {
            color: '#FFF0E5'
          }
        },
        yAxis: {
          min: 0,
          title: {
            text: '总数（个）',
            style: { color: '#999' },
            rotation: 0,
            align: 'high',
            offset: 0,
            x: 10,
            y: -23
          },
          labels: {
            format: '{value}',
            style: {
              color: '#999'
            }
          },
          lineColor: '#ccc',
          lineWidth: 1,
          tickWidth: 1,
          minorTickColor: '#ccc',
          stackLabels: {
            // 堆叠数据标签
            enabled: true,
            style: {
              fontWeight: 'normal',
              color: 'gray'
            }
          }
        },
        tooltip: {
          headerFormat: '<span>{point.key}</span><table>',
          pointFormat:
            '<tr><td>{series.name}: </td>' + '<td> {point.y} 个</td></tr>',
          footerFormat: '</table>',
          shared: true,
          shadow: false,
          backgroundColor: 'rgba(0,0,0,0.6)',
          borderRadius: 10,
          padding: 10,
          style: {
            color: 'rgba(255,255,255,0.9)',
            'font-family': 'PingFang-SC-Medium,PingFang-SC'
          },
          useHTML: true
        },
        plotOptions: {
          column: {
            borderWidth: 0
          }
        },
        series: [
          {
            name: '安装，实施人员',
            data: [43934, 52503, 57177, 69658, 97031, 119931, 137133, 154175]
          },
          {
            name: '工人',
            data: [24916, 24064, 29742, 29851, 32490, 30282, 38121, 40434]
          },
          {
            name: '销售',
            data: [11744, 17722, 16005, 19771, 20185, 24377, 32147, 39387]
          },
          {
            name: '项目开发',
            data: [null, null, 7988, 12169, 15112, 22452, 34400, 34227]
          }
        ],
        responsive: {
          rules: [
            {
              condition: {
                maxWidth: 500
              },
              chartOptions: {
                legend: {
                  layout: 'horizontal',
                  align: 'center',
                  verticalAlign: 'bottom'
                }
              }
            }
          ]
        }
      }
    }
  },
  methods: {
    async getOptions() {
      let res = await this.axios.get('reports/type/2')
      console.log(res)
      let {
        meta: { status }
      } = res

      if (status === 200) {
        let dataDate = Object.keys(res.data)
        this.chartOptions.xAxis.categories = dataDate
        this.chartOptions2.xAxis.categories = dataDate
        let datas = []
        let line = ['solid', 'ShortDashDot', 'LongDashDotDot', 'LongDashDot']
        // let line = ['solid', 'solid', 'solid', 'solid']

        res.data['2017-12-1'].forEach(function(ele, index) {
          let obj = {
            name: res.data['2017-12-1'][index].rp2_page,
            data: [],
            dashStyle: line[index]
          }
          datas.push(obj)
        })
        datas.forEach((ele, index) => {
          dataDate.forEach((e, i) => {
            let nums = res.data['2017-12-' + (i + 1)][index].rp2_count
            datas[index].data.push(nums)
          })
        })
        // console.log(datas)
        this.chartOptions.series = datas
        this.chartOptions2.series = datas
      } else {
        this.$message.error('获取列表失败')
      }
    },
    myCallback() {
      console.log('this is callback function')
    }
  },
  created() {
    this.getOptions()
  }
}
</script>

<style lang="less" scoped>
.chart-one {
  width: 50%;
  float: left;
  .highcharts-container {
    width: 600px;
    height: 400px;
    border: 1px solid #ddd;
    margin: auto;
  }
}
.chart-two {
  float: left;
  width: 50%;
}
</style>
