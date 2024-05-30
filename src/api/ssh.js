// import { invoke } from '@tauri-apps/api';

const sshConnect = async (host, port, user, password) => {
  try {
    const response = await invoke('add_ssh_connect', {
      host: `${host}:${port}`,
      user: user,
      password: password,
    });

    const data = JSON.parse(response);
    return data;
  } catch (error) {
    throw error;
  }
};

const disconnectSsh = async (host, port) => {
  try {
    const response = await invoke('disconnect_ssh', {
      host: `${host}:${port}`,
    });

    return response;
  } catch (error) {
    throw error;
  }
};

export const useSSH = () => {
  return {
    sshConnect,
    disconnectSsh
  };
};
