import { Product } from '../types';

export interface FormattedOfferMessage {
  title: string;
  highlights: string[];
  oldPrice: number;
  newPrice: number;
  discountPercent: number;
  affiliateUrl: string;
  fullMessageText: string;
}

export function formatOfferForSharing(product: Product, customMessage?: string): FormattedOfferMessage {
  const formatCurrency = (val: number) => `R$ ${val.toFixed(2).replace('.', ',')}`;

  const bulletsText = product.highlights.map(h => `✅ ${h}`).join('\n');

  const fullMessageText = customMessage || 
`🔥 *${product.title.toUpperCase()}*

${bulletsText}

💥 De: ~${formatCurrency(product.oldPrice)}~
🚀 *Por apenas: ${formatCurrency(product.price)}* (${product.discountPercent}% OFF)

🛒 *COMPRE AGORA NO LINK OFICIAL:*
👉 ${product.affiliateUrl}

⚠️ _Oferta por tempo limitado ou enquanto durarem os estoques!_`;

  return {
    title: product.title,
    highlights: product.highlights,
    oldPrice: product.oldPrice,
    newPrice: product.price,
    discountPercent: product.discountPercent,
    affiliateUrl: product.affiliateUrl,
    fullMessageText,
  };
}

export function getWhatsAppShareUrl(text: string): string {
  return `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
}

export function getTelegramShareUrl(text: string): string {
  return `https://t.me/share/url?url=${encodeURIComponent(' ')}&text=${encodeURIComponent(text)}`;
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch (err) {
    console.error('Clipboard write error', err);
  }

  // Fallback for iframe / unsupported
  try {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.opacity = '0';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    return successful;
  } catch (e) {
    console.error('Fallback copy error', e);
    return false;
  }
}
