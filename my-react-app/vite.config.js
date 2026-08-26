import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    // 以下を書き入れることで同じアクセスポイントを共有しているすべての機械と同じローカルホストでの利用を共有する.
    server: {
    host: true, // 0.0.0.0で全ネットワークインターフェースからの接続を受け付ける
  },
})
