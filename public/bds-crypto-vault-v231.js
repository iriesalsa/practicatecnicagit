(function () {
  if (typeof window === "undefined") return;

  const SALT_TAG = "pracTICA-PRODHAB-8968-v231";
  const SESSION_SEED_KEY = "bds_vault_seed_v231";

  function bytesToB64(bytes) {
    let bin = "";
    for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
    return btoa(bin);
  }

  function b64ToBytes(b64) {
    const bin = atob(String(b64 || ""));
    const arr = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
    return arr;
  }

  function getSubtle() {
    return (typeof crypto !== "undefined" && crypto.subtle) ? crypto.subtle : null;
  }

  function getDeviceSeed() {
    try {
      let s = sessionStorage.getItem(SESSION_SEED_KEY);
      if (!s) {
        const rnd = new Uint8Array(24);
        if (typeof crypto !== "undefined" && crypto.getRandomValues) crypto.getRandomValues(rnd);
        s = bytesToB64(rnd);
        sessionStorage.setItem(SESSION_SEED_KEY, s);
      }
      return s;
    } catch {
      return SALT_TAG;
    }
  }

  async function hashSHA256(texto, withSalt) {
    const raw = (withSalt ? `${SALT_TAG}|` : "") + String(texto || "").trim().toLowerCase();
    const subtle = getSubtle();
    if (subtle && typeof TextEncoder !== "undefined") {
      const buf = await subtle.digest("SHA-256", new TextEncoder().encode(raw));
      return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
    }
    let h = 2166136261;
    for (let i = 0; i < raw.length; i++) {
      h ^= raw.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return (h >>> 0).toString(16).padStart(8, "0").repeat(8).slice(0, 64);
  }

  async function deriveAesKey(passphrase) {
    const subtle = getSubtle();
    if (!subtle || typeof TextEncoder === "undefined") return null;
    const enc = new TextEncoder();
    const baseKey = await subtle.importKey("raw", enc.encode(String(passphrase || getDeviceSeed())), "PBKDF2", false, ["deriveKey"]);
    return subtle.deriveKey(
      { name: "PBKDF2", salt: enc.encode(SALT_TAG), iterations: 100000, hash: "SHA-256" },
      baseKey,
      { name: "AES-GCM", length: 256 },
      false,
      ["encrypt", "decrypt"]
    );
  }

  async function encryptJSON(obj, passphrase) {
    const subtle = getSubtle();
    const plain = JSON.stringify(obj == null ? {} : obj);
    if (!subtle || typeof TextEncoder === "undefined" || !crypto.getRandomValues) {
      return "plain:" + btoa(unescape(encodeURIComponent(plain)));
    }
    const key = await deriveAesKey(passphrase);
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const cipherBuf = await subtle.encrypt({ name: "AES-GCM", iv }, key, new TextEncoder().encode(plain));
    return `aes256:${bytesToB64(iv)}:${bytesToB64(new Uint8Array(cipherBuf))}`;
  }

  async function decryptJSON(token, passphrase) {
    const raw = String(token || "");
    if (!raw) return null;
    if (raw.startsWith("plain:")) {
      return JSON.parse(decodeURIComponent(escape(atob(raw.slice(6)))));
    }
    if (!raw.startsWith("aes256:")) return null;
    const subtle = getSubtle();
    if (!subtle || typeof TextDecoder === "undefined") return null;
    const parts = raw.split(":");
    if (parts.length !== 3) return null;
    const iv = b64ToBytes(parts[1]);
    const cipher = b64ToBytes(parts[2]);
    const key = await deriveAesKey(passphrase);
    const plainBuf = await subtle.decrypt({ name: "AES-GCM", iv }, key, cipher);
    return JSON.parse(new TextDecoder().decode(plainBuf));
  }

  function maskEmail(email) {
    const s = String(email || "").trim();
    const idx = s.indexOf("@");
    if (idx <= 1) return "***@***";
    return `${s[0]}***${s[idx - 1]}${s.slice(idx)}`;
  }

  function maskName(name) {
    return String(name || "")
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .map((w) => (w.length <= 2 ? w[0] + "*" : w.slice(0, 2) + "*".repeat(Math.min(5, w.length - 2))))
      .join(" ");
  }

  async function secureSetItem(key, dataObj) {
    const enc = await encryptJSON(dataObj);
    localStorage.setItem(String(key), enc);
    return true;
  }

  async function secureGetItem(key, fallback) {
    try {
      const raw = localStorage.getItem(String(key));
      if (!raw) return fallback;
      if (raw.startsWith("aes256:") || raw.startsWith("plain:")) {
        return (await decryptJSON(raw)) ?? fallback;
      }
      return JSON.parse(raw);
    } catch {
      return fallback;
    }
  }

  window.BDS_CRYPTO_VAULT_V231 = {
    hashSHA256,
    encryptJSON,
    decryptJSON,
    maskEmail,
    maskName,
    secureSetItem,
    secureGetItem
  };
})();