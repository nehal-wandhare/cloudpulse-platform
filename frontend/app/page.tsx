'use client'

import { useEffect, useState } from 'react'

import io from 'socket.io-client'

import {
  Activity,
  Cpu,
  HardDrive,
  Server,
} from 'lucide-react'

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

const socket = io('http://abbede065041f4adf81abd2d10907a88-346585655.ap-south-1.elb.amazonaws.com')

export default function Home() {

  const [metrics, setMetrics] = useState<any>({})

  const [chartData, setChartData] = useState<any[]>([])

  useEffect(() => {

    socket.on('metrics', (data) => {

      setMetrics(data)

      setChartData((prev) => [

        ...prev.slice(-20),

        {
          time: new Date().toLocaleTimeString(),
          cpu: Number(data.cpu),
          memory: Number(data.memory),
        }

      ])

    })

  }, [])

  return (

    <div className="min-h-screen bg-black text-white overflow-hidden">

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#0f172a,#000)] opacity-90"></div>

      <div className="relative z-10 p-10">

        <h1 className="text-6xl font-bold mb-10 text-cyan-400">
          CloudPulse Enterprise Dashboard
        </h1>

        <div className="grid grid-cols-4 gap-6">

          <Card
            title="CPU Usage"
            value={`${metrics.cpu || 0}%`}
            icon={<Cpu />}
          />

          <Card
            title="Memory Usage"
            value={`${metrics.memory || 0}%`}
            icon={<HardDrive />}
          />

          <Card
            title="Total Pods"
            value={Number(metrics.pods || 0)}
            icon={<Activity />}
          />

          <Card
            title="Running Pods"
            value={Number(metrics.runningPods || 0)}
            icon={<Server />}
          />

          <Card
            title="Failed Pods"
            value={Number(metrics.failedPods || 0)}
            icon={<Server />}
          />

          <Card
            title="Cluster Nodes"
            value={Number(metrics.nodes || 0)}
            icon={<Server />}
          />

          <Card
            title="Healthy Nodes"
            value={Number(metrics.healthyNodes || 0)}
            icon={<Server />}
          />

        </div>

        <div className="grid grid-cols-2 gap-6 mt-10">

          <div className="bg-white/10 backdrop-blur-xl border border-cyan-500/30 rounded-3xl p-6 h-[400px]">

            <h2 className="text-2xl text-cyan-400 mb-4">
              CPU Usage Trend
            </h2>

            <ResponsiveContainer width="100%" height="100%">

              <LineChart data={chartData}>

                <XAxis dataKey="time" />

                <YAxis />

                <Tooltip />

                <Line
                  type="monotone"
                  dataKey="cpu"
                  stroke="#06b6d4"
                  strokeWidth={3}
                />

              </LineChart>

            </ResponsiveContainer>

          </div>

          <div className="bg-white/10 backdrop-blur-xl border border-pink-500/30 rounded-3xl p-6 h-[400px]">

            <h2 className="text-2xl text-pink-400 mb-4">
              Memory Usage Trend
            </h2>

            <ResponsiveContainer width="100%" height="100%">

              <LineChart data={chartData}>

                <XAxis dataKey="time" />

                <YAxis />

                <Tooltip />

                <Line
                  type="monotone"
                  dataKey="memory"
                  stroke="#ec4899"
                  strokeWidth={3}
                />

              </LineChart>

            </ResponsiveContainer>

          </div>

        </div>

      </div>

    </div>
  )
}

function Card({ title, value, icon }: any) {

  return (

    <div className="bg-white/10 backdrop-blur-xl border border-cyan-500/30 rounded-3xl p-6 shadow-2xl hover:scale-105 transition duration-300">

      <div className="flex justify-between items-center mb-4">

        <h2 className="text-xl text-cyan-300">
          {title}
        </h2>

        {icon}

      </div>

      <p className="text-5xl font-bold text-white">
        {value}
      </p>

    </div>
  )
}
