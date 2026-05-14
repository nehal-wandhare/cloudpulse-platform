const express = require('express')
const http = require('http')
const { Server } = require('socket.io')
const cors = require('cors')
const axios = require('axios')

const app = express()

app.use(cors())

const server = http.createServer(app)

const io = new Server(server, {
  cors: {
    origin: '*',
  },
})

const PROMETHEUS =
  process.env.PROMETHEUS_URL || 'http://13.233.204.173:9090'

async function queryPrometheus(query) {

  try {

    const res = await axios.get(
      `${PROMETHEUS}/api/v1/query`,
      {
        params: { query },
      }
    )

    const results = res.data.data.result

    if (!results || results.length === 0) {
      return 0
    }

    let total = 0

    results.forEach((item) => {

      total += Number(item.value[1])

    })

    return total.toFixed(2)

  } catch (err) {

    console.log('Prometheus Query Error:', err.message)

    return 0
  }
}

async function getMetrics() {

  const cpu = await queryPrometheus(
    '100 - (avg(rate(node_cpu_seconds_total{mode="idle"}[5m])) * 100)'
  )

  const memory = await queryPrometheus(
    '(1 - (node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes)) * 100'
  )

  const pods = await queryPrometheus(
    'count(kube_pod_info)'
  )

  const runningPods = await queryPrometheus(
    'count(kube_pod_status_phase{phase="Running"})'
  )

  const failedPods = await queryPrometheus(
    'count(kube_pod_status_phase{phase="Failed"})'
  )

  const nodes = await queryPrometheus(
    'count(kube_node_info)'
  )

  const healthyNodes = await queryPrometheus(
    'count(kube_node_status_condition{condition="Ready",status="true"})'
  )

  return {
    cpu,
    memory,
    pods,
    runningPods,
    failedPods,
    nodes,
    healthyNodes,
  }
}

setInterval(async () => {

  try {

    const metrics = await getMetrics()
      console.log(metrics)
    io.emit('metrics', metrics)

  } catch (err) {

    console.log(err.message)

  }

}, 5000)

app.get('/', (req, res) => {

  res.send('CloudPulse Enterprise Monitoring Backend Running')

})

server.listen(5000, () => {

  console.log('Backend running on port 5000')

})
