<template>
    <div class="page">
        <button @click="dialogVisible = true">新建连接</button>

        <div class="tabs" v-if="tabs.length > 0">
            <div v-for="(tab, index) in tabs" :key="index" :class="['tab', { active: index === activeTab }]"
                @click="switchTab(index)">
                连接{{ index + 1 }}
                <span class="close-btn" @click.stop="closeTab(index)">✖</span>
            </div>
        </div>

        <div class="terminal-container" ref="terminalRef"></div>

        <el-dialog title="🔗 新建连接" v-model="dialogVisible" width="400px"
            class="custom-dialog">
            <el-form :model="{ host, port, username, password }" label-position="top" class="connect-form">
                <el-form-item label="服务器 IP">
                    <el-input v-model="host" placeholder="例如：192.168.0.1" clearable />
                </el-form-item>

                <el-form-item label="端口">
                    <el-input v-model="port" placeholder="例如：22" clearable />
                </el-form-item>

                <el-form-item label="用户名">
                    <el-input v-model="username" placeholder="输入用户名" clearable />
                </el-form-item>

                <el-form-item label="密码">
                    <el-input v-model="password" type="password" show-password placeholder="输入密码" clearable />
                </el-form-item>
            </el-form>

            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="dialogVisible = false">取消</el-button>
                    <el-button type="primary"
                        @click="addTab(host, port, username, password, undefined)">连接</el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import router from '@/router';
import { ref, nextTick, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { baseWebsocketUrl } from '@/api/baseRequest';
import 'xterm/css/xterm.css';
import { useStore } from '@/stores';
import { ElMessage } from 'element-plus';

interface Tab {
  terminal: Terminal;
  fitAddon: FitAddon;
  socket: WebSocket;
  heartbeat: number;
  handleResize: () => void;
}

const pinia = useStore();
const currentRoute = useRoute();

const dialogVisible = ref<boolean>(false);
const terminalRef = ref<HTMLElement | null>(null);

const tabs = ref<Tab[]>([]);
const activeTab = ref<number>(0);

const host = ref<string>('192.168.247.149');
const port = ref<string>('31500');
const username = ref<string>('guox');
const password = ref<string>('123456');

const addTab = async (
  host?: string,
  port?: string,
  username?: string,
  password?: string,
  serverId?: string
): Promise<void> => {
  const term = new Terminal({
    // rendererType: 'canvas',
    convertEol: true,
    scrollback: 10000,
    disableStdin: false,
    cursorStyle: 'block',
    cursorBlink: true,
    theme: {
      foreground: '#f0f0f0',
      background: '#1a1a1a',
      cursor: '#ffffff',
    //   selection: '#264f78',
      black: '#000000',
      red: '#e06c75',
      green: '#98c379',
      yellow: '#d19a66',
      blue: '#61afef',
      magenta: '#c678dd',
      cyan: '#56b6c2',
      white: '#abb2bf',
    //   scrollbarThumb: '#444',
    //   scrollbarTrack: '#1a1a1a'
    },
    lineHeight: 1.3,
    fontFamily: 'Monaco, Consolas, monospace',
    fontSize: 14,
    letterSpacing: 0.8
  });

  const fitAddon = new FitAddon();
  term.loadAddon(fitAddon);

  let url: string;
  if (serverId === undefined) {
    url = `ws://127.0.0.1:31500/api/websocket/ssh?host=${encodeURIComponent(
      host ?? ''
    )}&port=${encodeURIComponent(port ?? '')}&username=${encodeURIComponent(
      username ?? ''
    )}&password=${encodeURIComponent(password ?? '')}`;
  } else {
    url = `${baseWebsocketUrl}/autoAuthSsh?serverId=${serverId}&token=${pinia.getToken()}`;
  }

  const socket = new WebSocket(url);
  socket.binaryType = 'arraybuffer';
  dialogVisible.value = false;

  socket.onopen = () => {
    term.write('\r\n🟡 正在建立连接...\r\n');
  };

  socket.onmessage = (resp) => {
    if (resp.data instanceof ArrayBuffer) {
      const decoder = new TextDecoder('utf-8');
      term.write(decoder.decode(resp.data));
    } else if (typeof resp.data === 'string') {
      const socketMessage = JSON.parse(resp.data);
      if (socketMessage.title === 'ShellOut') {
        term.write(socketMessage.message);
      } else if (socketMessage.title === 'FailMessage') {
        term.write(socketMessage.message);
      } else if (socketMessage.title === 'WarningMessage') {
        ElMessage.warning(socketMessage.message);
      }
    }
  };

  socket.onerror = (error: Event) => {
    term.write(`\r\n🔴 连接错误\r\n`);
  };

  socket.onclose = () => {
    term.write('\r\n🔴 连接已断开\r\n');
  };

  term.onData((data) => {
    if (socket.readyState === WebSocket.OPEN) {
      socket.send(constructSocketMessage('USER_TEXT', data));
    }
  });

  const heartbeat = window.setInterval(() => {
    if (socket.readyState === WebSocket.OPEN) {
      socket.send(constructSocketMessage('HEART_BEAT', 'HEART_BEAT'));
    } else {
      clearInterval(heartbeat);
    }
  }, 30000);

  const handleResize = () => {
    if (tabs.value.length === 0) return;
    const currentTab = tabs.value[activeTab.value];
    currentTab.fitAddon.fit();
  };

  window.addEventListener('resize', handleResize);

  tabs.value.push({ terminal: term, fitAddon, socket, heartbeat, handleResize });
  activeTab.value = tabs.value.length - 1;
  await renderActiveTerminal();
};

const constructSocketMessage = (title: string, message: string) => {
  return JSON.stringify({ title, message, status: 200 });
};

const renderActiveTerminal = async () => {
  await nextTick();
  const currentTab = tabs.value[activeTab.value];
  if (terminalRef.value) {
    terminalRef.value.innerHTML = '';
    currentTab.terminal.open(terminalRef.value);
    currentTab.fitAddon.fit();
  }
};

const switchTab = async (index: number) => {
  activeTab.value = index;
  await renderActiveTerminal();
};

const closeTab = (index: number) => {
  const tab = tabs.value[index];
  if (tab.socket && tab.socket.readyState === WebSocket.OPEN) {
    tab.socket.close();
  }
  clearInterval(tab.heartbeat);
  window.removeEventListener('resize', tab.handleResize);
  tab.terminal.dispose();
  tabs.value.splice(index, 1);
  if (tabs.value.length > 0) {
    activeTab.value = index === 0 ? 0 : index - 1;
    renderActiveTerminal();
  } else {
    activeTab.value = 0;
  }
};

onMounted(() => {
  const serverId = currentRoute.query.serverId as string;
  if (serverId !== undefined) {
    addTab(undefined, undefined, undefined, undefined, serverId);
  }
});
</script>

<style scoped>
.page {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 80vh;
    background: #1a1a1a;
}

.connect-form input {
    padding: 8px 12px;
    background: #333;
    color: #fff;
    border: 1px solid #444;
    border-radius: 4px;
    font-size: 14px;
    transition: all 0.3s ease;
}

.connect-form input:focus {
    border-color: #666;
    outline: none;
    box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.2);
}

.connect-form button {
    background: #4caf50;
    color: white;
    padding: 8px 16px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-weight: 500;
    transition: background-color 0.3s ease;
}

.connect-form button:hover {
    background: #45a049;
}

.tabs {
    display: flex;
    background: #2a2a2a;
    padding: 0 4px;
    border-bottom: 1px solid #333;
    font-size: small;
}

.tab {
    padding: 8px 16px;
    color: #bbb;
    cursor: pointer;
    position: relative;
    border-radius: 4px 4px 0 0;
    margin: 4px 2px 0;
    transition: all 0.3s ease;
}

.tab:hover {
    background: #333;
    color: #fff;
}

.tab.active {
    background: #1a1a1a;
    color: #fff;
}

.close-btn {
    margin-left: 8px;
    color: #666;
    font-size: 12px;
    transition: color 0.3s ease;
}

.close-btn:hover {
    color: #ff4444;
}

.terminal-container {
    flex: 1;
    width: 100%;
    height: 100%;
    background: #1a1a1a;
    overflow: hidden;
}

/* 自定义滚动条样式 */
::-webkit-scrollbar {
    width: 8px;
    height: 8px;
}

::-webkit-scrollbar-track {
    background: #1a1a1a;
}

::-webkit-scrollbar-thumb {
    background: #444;
    border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
    background: #555;
}

/* 为xterm.js终端添加自定义样式 */
:deep(.xterm-viewport::-webkit-scrollbar) {
    width: 8px;
    height: 8px;
}

:deep(.xterm-viewport::-webkit-scrollbar-track) {
    background: #1a1a1a;
}

:deep(.xterm-viewport::-webkit-scrollbar-thumb) {
    background: #444;
    border-radius: 4px;
}

:deep(.xterm-viewport::-webkit-scrollbar-thumb:hover) {
    background: #555;
}

.custom-dialog :deep(.el-dialog) {
    border-radius: 12px;
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
}

.connect-form {
    margin-top: 10px;
}

.el-form-item {
    margin-bottom: 18px;
}

.el-input {
    border-radius: 8px;
}

.dialog-footer {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    padding-top: 8px;
}

.el-button {
    min-width: 80px;
    border-radius: 6px;
}
</style>