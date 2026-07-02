import { TFunction } from 'i18next';

export function getErrorMessage(error: any, t: TFunction): string {
  const msg: string = error?.message ?? String(error);
  if (msg.includes('fetch failed') || msg.includes('Network request failed') || msg.includes('Ağ bağlantısı')) {
    return t('common.networkError');
  }
  return msg.replace(/^Error:\s*/i, '');
}
