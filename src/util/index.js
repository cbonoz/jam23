import { ACTIVE_NETWORK, IPFS_BASE_URL } from "./constants";

export const formatMoney = (m) => {
  var formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",

    // These options are needed to round to whole numbers if that's what you want.
    //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
    //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
  });
  return formatter.format(m);
};

export const isEmpty = (obj) => {
  return !obj || obj.length === 0;
}

export function getExtensionFromFileName(fileName) {
  return fileName.split('.').pop();
}

export function getAverage(array) {
  return array.reduce((a, b) => a + b) / array.length;
}

export const getListingUrl = (address) => {
  return `${window.location.origin}/purchase/${address}`
}

export const capitalize = (s) => {
  if (typeof s !== "string") return "";
  return (s.charAt(0).toUpperCase() + s.slice(1)).replace("-", " ");
};

export const PROXY_URL = 'https://http-proxy.fly.dev/proxy'


export const convertCamelToCapitalSpaces = (s) => {
  if (typeof s !== "string") return "";
  return s.replace(/([A-Z])/g, " $1").replace(/^./, function (str) {
    return str.toUpperCase();
  });
};

export const getRpcError = (e) => {
  if (e.data) {
    return e.data.message;
  }
  return e.message;
};

  export function bytesToSize(bytes) {
    var sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    if (bytes == 0) return "0 Byte";
    var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, i), 2) + " " + sizes[i];
  }

  export const ipfsUrl = (cid, fileName) => {
    // let url = `https://ipfs.io/ipfs/${cid}`;
    let url = `${IPFS_BASE_URL}/${cid}`;
    if (fileName) {
      return `${url}/${fileName}`;
    }
    return url;
  };

  export const transactionUrl = (tx) => `${ACTIVE_NETWORK.url}/tx/${tx}?network=hyperspacenet`;
  export const accountUrl = (account) =>
    `${ACTIVE_NETWORK.url}/account/${account}`;

