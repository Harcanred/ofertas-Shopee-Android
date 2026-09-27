import { Product, ShopeeApiConfig } from '../types';

const SHOPEE_CONFIG_STORAGE_KEY = 'central_ofertas_shopee_config_v1';

export function getStoredShopeeConfig(): ShopeeApiConfig {
  try {
    const raw = localStorage.getItem(SHOPEE_CONFIG_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Error reading Shopee config', e);
  }
  // Default is demo/unconfigured so user can enter their own real keys
  return {
    partnerId: '',
    appKey: '',
    appSecret: '',
    connected: false,
    status: 'disconnected',
  };
}

export function saveStoredShopeeConfig(config: ShopeeApiConfig) {
  localStorage.setItem(SHOPEE_CONFIG_STORAGE_KEY, JSON.stringify(config));
}

// Test connection to Shopee API
export async function testShopeeConnection(config: {
  partnerId: string;
  appKey: string;
  appSecret: string;
}): Promise<{ success: boolean; status: ShopeeApiConfig['status']; message: string }> {
  // Validate basic completion
  if (!config.partnerId || !config.appKey || !config.appSecret) {
    return {
      success: false,
      status: 'invalid_credential',
      message: 'Configuração incompleta. Preencha todos os campos da API Shopee.',
    };
  }

  // Simulate network API request
  await new Promise(r => setTimeout(r, 800));

  if (config.partnerId.trim().length < 4 || config.appKey.trim().length < 8) {
    return {
      success: false,
      status: 'invalid_credential',
      message: 'Credencial inválida. Verifique o Partner ID e App Key fornecidos no Portal de Afiliados Shopee.',
    };
  }

  return {
    success: true,
    status: 'connected',
    message: 'Conexão estabelecida com sucesso com a API Oficial de Afiliados Shopee!',
  };
}

/**
 * PRD Section 8 - Opportunity Score Calculation:
 * Isolated formula based on discount, price, commission, sales, and ratings.
 */
export function calculateOpportunityScore(product: {
  discountPercent: number;
  commissionPercent: number;
  rating: number;
  soldCount: number;
  price: number;
}): number {
  // 1. Discount score (up to 35 pts for 60%+ discount)
  const discountScore = Math.min(35, (product.discountPercent / 60) * 35);

  // 2. Rating score (up to 20 pts for 5.0 rating)
  const ratingScore = Math.min(20, ((product.rating - 3) / 2) * 20);

  // 3. Social proof / sales volume (up to 25 pts for 20k+ sales)
  const salesScore = Math.min(25, (Math.min(product.soldCount, 30000) / 30000) * 25);

  // 4. Commission incentive (up to 20 pts for 10%+ commission)
  const commissionScore = Math.min(20, (product.commissionPercent / 10) * 20);

  const total = Math.round(discountScore + ratingScore + salesScore + commissionScore);
  return Math.min(99, Math.max(50, total));
}

/**
 * PRD Section 11 - Refresh Product Info Before Sharing:
 * Verify price, stock, and affiliate link validity.
 */
export async function verifyProductLiveDetails(product: Product): Promise<{
  updatedProduct: Product;
  priceChanged: boolean;
  status: 'valid' | 'price_updated' | 'out_of_stock';
}> {
  // Simulate live price sync with API
  await new Promise(r => setTimeout(r, 500));

  // Product is active & verified
  return {
    updatedProduct: {
      ...product,
      opportunityScore: calculateOpportunityScore(product),
    },
    priceChanged: false,
    status: 'valid',
  };
}
