// import { invoke } from '@tauri-apps/api';

const fetchLocalCPUInfo = async () => {
  try {
    const res = await invoke('get_cpu_info');
    const data = JSON.parse(res);
    return data;
  } catch (error) {
    console.error('Error fetching CPU info:', error);
    throw error;
  }
};

const fetchRemoteAllInfo = async (remoteHost) => {
  try {
    // const res = await invoke('get_sysinfo', { host: remoteHost });
    const res = { "code": 0, "message": "success", "data": { "cpu_detail": [{ "index": 0, "usage": 6.666666666666665 }, { "index": 1, "usage": 6.451612903225811 }, { "index": 2, "usage": 6.451612903225811 }, { "index": 3, "usage": 100.0 }, { "index": 4, "usage": 6.451612903225811 }, { "index": 5, "usage": 9.375 }, { "index": 6, "usage": 9.375 }, { "index": 7, "usage": 100.0 }, { "index": 8, "usage": 3.2258064516129004 }, { "index": 9, "usage": 0.0 }, { "index": 10, "usage": 6.451612903225811 }, { "index": 11, "usage": 9.090909090909093 }, { "index": 12, "usage": 6.451612903225811 }, { "index": 13, "usage": 6.25 }, { "index": 14, "usage": 6.25 }, { "index": 15, "usage": 6.25 }, { "index": 16, "usage": 6.451612903225811 }, { "index": 17, "usage": 3.2258064516129004 }, { "index": 18, "usage": 100.0 }, { "index": 19, "usage": 100.0 }, { "index": 20, "usage": 6.451612903225811 }, { "index": 21, "usage": 6.451612903225811 }, { "index": 22, "usage": 6.451612903225811 }, { "index": 23, "usage": 6.25 }, { "index": 24, "usage": 9.375 }, { "index": 25, "usage": 6.666666666666665 }, { "index": 26, "usage": 9.090909090909093 }, { "index": 27, "usage": 3.2258064516129004 }, { "index": 28, "usage": 3.3333333333333326 }, { "index": 29, "usage": 9.375 }, { "index": 30, "usage": 3.2258064516129004 }, { "index": 31, "usage": 3.2258064516129004 }, { "index": 32, "usage": 6.25 }, { "index": 33, "usage": 6.451612903225811 }, { "index": 34, "usage": 6.25 }, { "index": 35, "usage": 6.451612903225811 }, { "index": 36, "usage": 3.2258064516129004 }, { "index": 37, "usage": 0.0 }, { "index": 38, "usage": 3.2258064516129004 }, { "index": 39, "usage": 8.823529411764708 }], "cpu_info": { "user_usage": 0.102, "sys_usage": 0.055999998, "usage": 0.15799999 }, "mem_info": { "used": 17946, "free": 41869, "total": 64289 }, "disk_info": "16.5", "disk_detail": [{ "name": "shm", "size": "64M", "used": "0", "avail": "64M", "use_percentage": "0 % ", "mounted_on": " / dev / shm" }, { "name": " / dev / sdb", "size": "7.1T", "used": "217G", "avail": "6.5T", "use_percentage": "4 % ", "mounted_on": " / d1" }, { "name": " / dev / sda2", "size": "196G", "used": "114G", "avail": "73G", "use_percentage": "62 % ", "mounted_on": " / etc / localtime" }, { "name": "udev", "size": "32G", "used": "0", "avail": "32G", "use_percentage": "0 % ", "mounted_on": " / dev / nvidia0" }], "process_info": [{ "pid": "8736", "user": "root", "virt": "27.145g", "res": "2.302g", "cpu": "200.0", "mem": "3.7", "command": "ivauto_quality_\r" }, { "pid": "8728", "user": "root", "virt": "30.062g", "res": "2.842g", "cpu": "193.8", "mem": "4.5", "command": "ivauto_ivs_serv\r" }, { "pid": "8733", "user": "root", "virt": "24.572g", "res": "2.531g", "cpu": "62.5", "mem": "4.0", "command": "ivauto_summary_\r" }, { "pid": "8752", "user": "root", "virt": "2077804", "res": "103496", "cpu": "6.2", "mem": "0.2", "command": "StreamServer\r" }, { "pid": "1", "user": "root", "virt": "18384", "res": "3000", "cpu": "0.0", "mem": "0.0", "command": "bash\r" }, { "pid": "22", "user": "root", "virt": "72308", "res": "3296", "cpu": "0.0", "mem": "0.0", "command": "sshd\r" }, { "pid": "107", "user": "mysql", "virt": "4636", "res": "1784", "cpu": "0.0", "mem": "0.0", "command": "mysqld_safe\r" }, { "pid": "463", "user": "mysql", "virt": "2084984", "res": "197092", "cpu": "0.0", "mem": "0.3", "command": "mysqld\r" }, { "pid": "578", "user": "root", "virt": "66880", "res": "20636", "cpu": "0.0", "mem": "0.0", "command": "supervisord\r" }, { "pid": "628", "user": "root", "virt": "40716", "res": "1116", "cpu": "0.0", "mem": "0.0", "command": "nginx\r" }, { "pid": "629", "user": "nobody", "virt": "45672", "res": "5096", "cpu": "0.0", "mem": "0.0", "command": "nginx\r" }, { "pid": "630", "user": "nobody", "virt": "48512", "res": "8228", "cpu": "0.0", "mem": "0.0", "command": "nginx\r" }, { "pid": "631", "user": "root", "virt": "4576", "res": "828", "cpu": "0.0", "mem": "0.0", "command": "tail\r" }, { "pid": "632", "user": "nobody", "virt": "45672", "res": "5088", "cpu": "0.0", "mem": "0.0", "command": "nginx\r" }, { "pid": "633", "user": "nobody", "virt": "45672", "res": "5088", "cpu": "0.0", "mem": "0.0", "command": "nginx\r" }, { "pid": "634", "user": "nobody", "virt": "45672", "res": "5092", "cpu": "0.0", "mem": "0.0", "command": "nginx\r" }, { "pid": "635", "user": "nobody", "virt": "45672", "res": "5092", "cpu": "0.0", "mem": "0.0", "command": "nginx\r" }, { "pid": "636", "user": "nobody", "virt": "45324", "res": "4192", "cpu": "0.0", "mem": "0.0", "command": "nginx\r" }, { "pid": "763", "user": "root", "virt": "18644", "res": "3428", "cpu": "0.0", "mem": "0.0", "command": "bash\r" }, { "pid": "1950", "user": "root", "virt": "101572", "res": "7000", "cpu": "0.0", "mem": "0.0", "command": "sshd\r" }, { "pid": "1961", "user": "root", "virt": "18648", "res": "3616", "cpu": "0.0", "mem": "0.0", "command": "bash\r" }, { "pid": "1996", "user": "root", "virt": "101572", "res": "6972", "cpu": "0.0", "mem": "0.0", "command": "sshd\r" }, { "pid": "2011", "user": "root", "virt": "13068", "res": "2276", "cpu": "0.0", "mem": "0.0", "command": "sftp - server\r" }, { "pid": "8729", "user": "root", "virt": "332492", "res": "28340", "cpu": "0.0", "mem": "0.0", "command": "StreamServer\r" }, { "pid": "8730", "user": "root", "virt": "99096", "res": "3708", "cpu": "0.0", "mem": "0.0", "command": "ZSUpdate\r" }, { "pid": "8731", "user": "root", "virt": "266480", "res": "8756", "cpu": "0.0", "mem": "0.0", "command": "ivauto_du_manag\r" }, { "pid": "8732", "user": "root", "virt": "982352", "res": "39096", "cpu": "0.0", "mem": "0.1", "command": "LB_intercom\r" }, { "pid": "20589", "user": "root", "virt": "101572", "res": "7168", "cpu": "0.0", "mem": "0.0", "command": "sshd\r" }, { "pid": "20635", "user": "root", "virt": "38588", "res": "3124", "cpu": "0.0", "mem": "0.0", "command": "top\r" }], "net_info": [{ "device": "veth0e84381", "receive": 0.4781901041666667, "transmit": 0.20703125 }, { "device": "docker0", "receive": 0.0, "transmit": 0.0 }, { "device": "veth0a537d2", "receive": 0.3502604166666667, "transmit": 0.5999348958333334 }, { "device": "lo", "receive": 36.994791666666664, "transmit": 36.994791666666664 }, { "device": "eno2", "receive": 0.0, "transmit": 0.0 }, { "device": "vethea25b76", "receive": 0.0, "transmit": 0.0 }, { "device": "eno1", "receive": 38.501953125, "transmit": 1.740234375 }, { "device": "6bee1d02faa1", "receive": 0.7600911458333334, "transmit": 0.8069661458333334 }], "load_info": { "load1": 9.23, "load5": 10.68, "load15": 11.21 }, "gpu_detail": [{ "name": "NVIDIA GeForce RTX 2070", "index": 0, "usage": 0.0, "total_memory": 8192.0, "used_memory": 2090.0, "power": 42.31, "power_limit": 175.0 }, { "name": "NVIDIA GeForce RTX 2070", "index": 1, "usage": 0.0, "total_memory": 8192.0, "used_memory": 2075.0, "power": 37.62, "power_limit": 175.0 }, { "name": "NVIDIA GeForce RTX 2070", "index": 2, "usage": 0.0, "total_memory": 8192.0, "used_memory": 2075.0, "power": 39.6, "power_limit": 175.0 }, { "name": "NVIDIA GeForce RTX 2070", "index": 3, "usage": 0.0, "total_memory": 8192.0, "used_memory": 2075.0, "power": 39.3, "power_limit": 175.0 }] } }
    console.log(res);
    return res.data;
    const json = JSON.parse(res);
    return json;
  } catch (error) {
    console.error('Error fetching all info:', error);
    throw error;
  }
}





export const useSysinfo = () => {
  return {
    // fetchLocalCPUInfo,
    fetchRemoteAllInfo,

  }
}