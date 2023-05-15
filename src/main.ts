import { GM_getValue, GM_setValue, GM_xmlhttpRequest, unsafeWindow } from '$';
import { GM_fetch } from 'monkey-extra';
import { useCheckedMenu } from './utils';

const defaultValue = [
  `gkd-viewer.songe.li`,
  `gkd-viewer.vercel.app`,
  `gkd-viewer.netlify.app`,
  `gkd-viewer.gitee.io`,
].includes(location.hostname);

const storeKey = `inject_network:` + location.origin;
const menu = useCheckedMenu(
  `inject api to current website`,
  GM_getValue(storeKey, defaultValue),
);

menu.onChange = (checked) => {
  menu.checked = checked;
  GM_setValue(storeKey, checked);
  setTimeout(() => {
    location.reload();
  });
};

if (menu.checked) {
  const __GmNetworkExtension = {
    GM_xmlhttpRequest,
    GM_fetch,
  };
  Object.assign(unsafeWindow, { __GmNetworkExtension });
}
