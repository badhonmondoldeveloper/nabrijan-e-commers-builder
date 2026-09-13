import mysql from 'mysql2/promise';

const getDatabaseUrl = () => {
  return process.env.DATABASE_URL || "mysql://nabrijan_user:NabrijanSaaS2026!SecurePass@127.0.0.1:3306/nabrijan_db";
};

const pool = mysql.createPool({
  uri: getDatabaseUrl(),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

const TABLE_COLUMNS: Record<string, Set<string>> = {
  User: new Set(['id', 'email', 'passwordHash', 'name', 'avatar', 'phone', 'role', 'isEmailVerified', 'createdAt', 'updatedAt']),
  Store: new Set(['id', 'name', 'slug', 'logo', 'banner', 'category', 'status', 'ownerId', 'createdAt', 'updatedAt']),
  StoreSettings: new Set(['id', 'storeId', 'currency', 'currencySymbol', 'language', 'country', 'phone', 'email', 'address', 'enableCOD', 'enableTax', 'taxRate', 'seoTitle', 'seoDescription', 'metaKeywords', 'customCss', 'whatsappNumber', 'facebookUrl', 'instagramUrl', 'announcementText', 'accentColor']),
  StoreThemeSettings: new Set(['id', 'storeId', 'themeId', 'headerConfig', 'footerConfig', 'colorsConfig', 'typographyConfig', 'customCss', 'updatedAt']),
  ThemeSection: new Set(['id', 'storeThemeSettingsId', 'sectionType', 'title', 'subtitle', 'content', 'sortOrder', 'isVisible']),
  ShippingZone: new Set(['id', 'storeId', 'name', 'regions', 'isActive']),
  ShippingRate: new Set(['id', 'zoneId', 'name', 'rateType', 'minWeight', 'maxWeight', 'minOrderPrice', 'maxOrderPrice', 'price', 'estimatedDays']),
  Order: new Set(['id', 'storeId', 'orderNumber', 'customerId', 'customerName', 'customerPhone', 'customerEmail', 'shippingDivision', 'shippingDistrict', 'shippingArea', 'shippingAddress', 'notes', 'paymentMethod', 'paymentStatus', 'orderStatus', 'subtotal', 'discountAmount', 'shippingFee', 'totalAmount', 'currency', 'exchangeRate', 'estimatedProfit', 'createdAt', 'updatedAt']),
  OrderItem: new Set(['id', 'orderId', 'productId', 'variantId', 'productTitle', 'variantTitle', 'sku', 'price', 'costPrice', 'quantity', 'total', 'sellerOrderId']),
  Customer: new Set(['id', 'storeId', 'name', 'email', 'phone', 'totalOrders', 'totalSpent', 'status', 'notes', 'tags', 'createdAt', 'updatedAt']),
  Product: new Set(['id', 'storeId', 'title', 'slug', 'shortDescription', 'fullDescription', 'regularPrice', 'salePrice', 'costPrice', 'sku', 'barcode', 'categoryId', 'brandId', 'status', 'stock', 'lowStockThreshold', 'weight', 'isFeatured', 'productType', 'seoTitle', 'seoDescription', 'createdAt', 'updatedAt', 'boostExpiresAt', 'isFeaturedMarketplace', 'isMarketplaceListed', 'marketplaceCategory', 'marketplaceStatus']),
  ProductImage: new Set(['id', 'productId', 'url', 'alt', 'isMain', 'sortOrder']),
  ProductVariant: new Set(['id', 'productId', 'title', 'sku', 'price', 'salePrice', 'stock', 'weight', 'status', 'image', 'attributes']),
  Subscription: new Set(['id', 'userId', 'storeId', 'planId', 'status', 'currentPeriodStart', 'currentPeriodEnd', 'cancelAtPeriodEnd', 'canceledAt', 'trialStartsAt', 'trialEndsAt', 'createdAt', 'updatedAt']),
  Plan: new Set(['id', 'name', 'slug', 'description', 'price', 'billingCycle', 'storeLimit', 'productLimit', 'staffLimit', 'storageLimit', 'customDomainAllowed', 'aiCredits', 'features', 'isPopular', 'isActive', 'createdAt', 'updatedAt']),
  AuditLog: new Set(['id', 'actorId', 'actorEmail', 'storeId', 'action', 'resource', 'resourceId', 'details', 'ipAddress', 'createdAt']),
  VerificationToken: new Set(['id', 'userId', 'tokenHash', 'expiresAt', 'createdAt']),
  InventoryTransaction: new Set(['id', 'storeId', 'productId', 'variantId', 'type', 'quantity', 'previousStock', 'newStock', 'reference', 'notes', 'createdById', 'createdAt']),
  Theme: new Set(['id', 'name', 'slug', 'description', 'previewImage', 'isFree', 'price', 'createdAt']),
  Category: new Set(['id', 'storeId', 'name', 'slug', 'description', 'image', 'banner', 'parentId', 'sortOrder', 'isActive', 'seoTitle', 'seoDescription']),
  ShipmentEvent: new Set(['id', 'shipmentId', 'status', 'notes', 'createdAt']),
};

function parseJsonField(val: any, fallback: any = null) {
  if (val === null || val === undefined) return fallback;
  if (typeof val !== 'string') return val;
  try {
    return JSON.parse(val);
  } catch (e) {
    return fallback;
  }
}

function buildWhereClause(where: any) {
  if (!where) return { clause: '', params: [] };
  const clauses: string[] = [];
  const params: any[] = [];

  for (const k of Object.keys(where)) {
    const val = where[k];
    if (val === undefined) continue;

    if (k === 'OR' && Array.isArray(val)) {
      const orClauses: string[] = [];
      for (const condition of val) {
        const sub = buildWhereClause(condition);
        if (sub.clause) {
          orClauses.push(`(${sub.clause.replace(/^\s*WHERE\s+/i, '')})`);
          params.push(...sub.params);
        }
      }
      if (orClauses.length > 0) {
        clauses.push(`(${orClauses.join(' OR ')})`);
      }
    } else if (k === 'AND' && Array.isArray(val)) {
      for (const condition of val) {
        const sub = buildWhereClause(condition);
        if (sub.clause) {
          clauses.push(`(${sub.clause.replace(/^\s*WHERE\s+/i, '')})`);
          params.push(...sub.params);
        }
      }
    } else if (val !== null && typeof val === 'object' && !(val instanceof Date)) {
      const keys = Object.keys(val);
      const isOperatorObj = keys.some(op => ['in', 'notIn', 'gte', 'lte', 'gt', 'lt', 'not', 'contains', 'startsWith', 'endsWith'].includes(op));

      if (isOperatorObj) {
        for (const op of keys) {
          const innerVal = val[op];
          if (op === 'in') {
            if (Array.isArray(innerVal) && innerVal.length > 0) {
              const placeholders = innerVal.map(() => '?').join(', ');
              clauses.push(`\`${k}\` IN (${placeholders})`);
              params.push(...innerVal);
            } else {
              clauses.push('1 = 0');
            }
          } else if (op === 'notIn') {
            if (Array.isArray(innerVal) && innerVal.length > 0) {
              const placeholders = innerVal.map(() => '?').join(', ');
              clauses.push(`\`${k}\` NOT IN (${placeholders})`);
              params.push(...innerVal);
            }
          } else if (op === 'gte') {
            clauses.push(`\`${k}\` >= ?`);
            params.push(innerVal instanceof Date ? innerVal.toISOString().slice(0, 19).replace('T', ' ') : innerVal);
          } else if (op === 'lte') {
            clauses.push(`\`${k}\` <= ?`);
            params.push(innerVal instanceof Date ? innerVal.toISOString().slice(0, 19).replace('T', ' ') : innerVal);
          } else if (op === 'gt') {
            clauses.push(`\`${k}\` > ?`);
            params.push(innerVal instanceof Date ? innerVal.toISOString().slice(0, 19).replace('T', ' ') : innerVal);
          } else if (op === 'lt') {
            clauses.push(`\`${k}\` < ?`);
            params.push(innerVal instanceof Date ? innerVal.toISOString().slice(0, 19).replace('T', ' ') : innerVal);
          } else if (op === 'not') {
            if (innerVal === null) {
              clauses.push(`\`${k}\` IS NOT NULL`);
            } else {
              clauses.push(`\`${k}\` != ?`);
              params.push(innerVal);
            }
          } else if (op === 'contains') {
            clauses.push(`\`${k}\` LIKE ?`);
            params.push(`%${innerVal}%`);
          } else if (op === 'startsWith') {
            clauses.push(`\`${k}\` LIKE ?`);
            params.push(`${innerVal}%`);
          } else if (op === 'endsWith') {
            clauses.push(`\`${k}\` LIKE ?`);
            params.push(`%${innerVal}`);
          }
        }
      } else {
        // Compound key object e.g. storeId_slug: { storeId: '...', slug: '...' }
        for (const innerKey of keys) {
          const innerVal = val[innerKey];
          clauses.push(`\`${innerKey}\` = ?`);
          params.push(typeof innerVal === 'boolean' ? (innerVal ? 1 : 0) : innerVal);
        }
      }
    } else {
      if (val === null) {
        clauses.push(`\`${k}\` IS NULL`);
      } else {
        clauses.push(`\`${k}\` = ?`);
        params.push(typeof val === 'boolean' ? (val ? 1 : 0) : val);
      }
    }
  }

  if (clauses.length === 0) return { clause: '', params: [] };
  return { clause: ' WHERE ' + clauses.join(' AND '), params };
}

async function formatRecord(record: any, tableName: string, options: any = {}) {
  if (!record) return null;
  const formatted = { ...record };

  // Parse common JSON columns
  if ('images' in formatted) {
    let rawImgs = parseJsonField(formatted.images, []);
    if (typeof rawImgs === 'string') rawImgs = [rawImgs];
    if (!Array.isArray(rawImgs)) rawImgs = [];
    formatted.images = rawImgs.map((img: any, idx: number) => {
      if (typeof img === 'string') return { id: `img-${idx}`, url: img };
      if (img && typeof img === 'object') return { id: img.id || `img-${idx}`, url: img.url || '' };
      return { id: `img-${idx}`, url: '' };
    });
  }
  if ('attributes' in formatted) {
    formatted.attributes = parseJsonField(formatted.attributes, {});
  }
  if ('features' in formatted) {
    formatted.features = parseJsonField(formatted.features, []);
  }
  if ('rules' in formatted) {
    formatted.rules = parseJsonField(formatted.rules, []);
  }
  if ('themeConfig' in formatted) {
    formatted.themeConfig = parseJsonField(formatted.themeConfig, {});
  }

  // Handle include & _count options
  const include = options.include;

  if (include) {
    if (include._count) {
      formatted._count = { products: 0, orders: 0, customers: 0, reviews: 0 };
      if (tableName === 'Store' && formatted.id) {
        try {
          const [pRows]: any = await pool.execute('SELECT COUNT(*) as c FROM `Product` WHERE `storeId` = ?', [formatted.id]);
          const [oRows]: any = await pool.execute('SELECT COUNT(*) as c FROM `Order` WHERE `storeId` = ?', [formatted.id]);
          const [cRows]: any = await pool.execute('SELECT COUNT(*) as c FROM `Customer` WHERE `storeId` = ?', [formatted.id]);
          formatted._count.products = pRows[0]?.c || 0;
          formatted._count.orders = oRows[0]?.c || 0;
          formatted._count.customers = cRows[0]?.c || 0;
        } catch (e) {}
      }
    }

    if (include.settings && tableName === 'Store') {
      try {
        const [sRows]: any = await pool.execute('SELECT * FROM `StoreSettings` WHERE `storeId` = ? LIMIT 1', [formatted.id]);
        formatted.settings = sRows[0] || null;
      } catch (e) {
        formatted.settings = null;
      }
    }

    if (include.owner || include.user) {
      const uId = formatted.ownerId || formatted.userId;
      if (uId) {
        try {
          const [uRows]: any = await pool.execute('SELECT `id`, `name`, `email`, `role`, `avatar` FROM `User` WHERE `id` = ? LIMIT 1', [uId]);
          formatted.owner = uRows[0] || { name: 'Merchant', email: 'merchant@nabrijan.site' };
          formatted.user = formatted.owner;
        } catch (e) {
          formatted.owner = { name: 'Merchant', email: 'merchant@nabrijan.site' };
          formatted.user = formatted.owner;
        }
      } else {
        formatted.owner = { name: 'Merchant', email: 'merchant@nabrijan.site' };
        formatted.user = formatted.owner;
      }
    }

    if (include.plan && tableName === 'Subscription') {
      if (formatted.planId) {
        try {
          const [planRows]: any = await pool.execute('SELECT * FROM `Plan` WHERE `id` = ? LIMIT 1', [formatted.planId]);
          formatted.plan = planRows[0] || null;
        } catch (e) {
          formatted.plan = null;
        }
      } else {
        formatted.plan = null;
      }
    }

    if (include.category && tableName === 'Product') {
      if (formatted.categoryId) {
        try {
          const [catRows]: any = await pool.execute('SELECT * FROM `Category` WHERE `id` = ? LIMIT 1', [formatted.categoryId]);
          formatted.category = catRows[0] || null;
        } catch (e) {
          formatted.category = null;
        }
      } else {
        formatted.category = null;
      }
    }

    if (include.store && tableName === 'Product') {
      if (formatted.storeId) {
        try {
          const [stRows]: any = await pool.execute('SELECT * FROM `Store` WHERE `id` = ? LIMIT 1', [formatted.storeId]);
          formatted.store = stRows[0] || null;
        } catch (e) {
          formatted.store = null;
        }
      } else {
        formatted.store = null;
      }
    }

    if (include.images && tableName === 'Product' && formatted.id) {
      try {
        const [imgRows]: any = await pool.execute('SELECT * FROM `ProductImage` WHERE `productId` = ? ORDER BY `sortOrder` ASC LIMIT 10', [formatted.id]);
        if (imgRows && imgRows.length > 0) {
          formatted.images = imgRows.map((img: any) => ({
            id: img.id,
            url: img.url,
            isMain: img.isMain ? true : false,
            sortOrder: img.sortOrder || 0
          }));
        }
      } catch (e) {}
    }

    if (include.products && tableName === 'Store') {
      try {
        const [prodRows]: any = await pool.execute('SELECT * FROM `Product` WHERE `storeId` = ? LIMIT 20', [formatted.id]);
        formatted.products = prodRows || [];
      } catch (e) {
        formatted.products = [];
      }
    }

    if (include.variants && tableName === 'Product') {
      try {
        const [varRows]: any = await pool.execute('SELECT * FROM `ProductVariant` WHERE `productId` = ?', [formatted.id]);
        formatted.variants = (varRows || []).map((v: any) => ({
          ...v,
          attributes: parseJsonField(v.attributes, {})
        }));
      } catch (e) {
        formatted.variants = [];
      }
    }

    if (include.reviews) {
      formatted.reviews = [];
    }
  }

  // Ensure default _count is always safe if accessed
  if (!formatted._count) {
    formatted._count = { products: 0, orders: 0, customers: 0, reviews: 0 };
  }

  if (options.select) {
    const filtered: any = {};
    for (const s of Object.keys(options.select)) {
      if (options.select[s]) filtered[s] = formatted[s];
    }
    return filtered;
  }

  return formatted;
}

function createModelHandler(tableName: string) {
  const validCols = TABLE_COLUMNS[tableName];

  return {
    async findUnique(opts: any = {}) {
      const { where } = opts;
      if (!where) return null;
      const { clause, params } = buildWhereClause(where);
      if (!clause) return null;
      const [rows]: any = await pool.execute(`SELECT * FROM \`${tableName}\`${clause} LIMIT 1`, params);
      if (!rows || rows.length === 0) return null;
      return formatRecord(rows[0], tableName, opts);
    },

    async findFirst(opts: any = {}) {
      const { where, orderBy } = opts;
      const { clause, params } = buildWhereClause(where);
      let sql = `SELECT * FROM \`${tableName}\`${clause}`;

      if (orderBy) {
        const orderKey = Object.keys(orderBy)[0];
        if (orderKey) {
          const dir = typeof orderBy[orderKey] === 'string' ? orderBy[orderKey].toUpperCase() : 'ASC';
          sql += ` ORDER BY \`${orderKey}\` ${dir}`;
        }
      }
      sql += ` LIMIT 1`;
      const [rows]: any = await pool.execute(sql, params);
      if (!rows || rows.length === 0) return null;
      return formatRecord(rows[0], tableName, opts);
    },

    async findMany(opts: any = {}) {
      const { where, orderBy, take, skip } = opts;
      const { clause, params } = buildWhereClause(where);
      let sql = `SELECT * FROM \`${tableName}\`${clause}`;

      if (orderBy) {
        const orderKey = Object.keys(orderBy)[0];
        if (orderKey) {
          const dir = typeof orderBy[orderKey] === 'string' ? orderBy[orderKey].toUpperCase() : 'ASC';
          sql += ` ORDER BY \`${orderKey}\` ${dir}`;
        }
      }
      if (take) {
        sql += ` LIMIT ${parseInt(take, 10)}`;
        if (skip) {
          sql += ` OFFSET ${parseInt(skip, 10)}`;
        }
      }
      const [rows]: any = await pool.execute(sql, params);
      if (!rows) return [];
      return Promise.all(rows.map((r: any) => formatRecord(r, tableName, opts)));
    },

    async count(opts: any = {}) {
      const { where } = opts;
      const { clause, params } = buildWhereClause(where);
      const sql = `SELECT COUNT(*) as count FROM \`${tableName}\`${clause}`;
      const [rows]: any = await pool.execute(sql, params);
      return rows[0]?.count || 0;
    },

    async create({ data, select, include }: any) {
      if (!data) return null;
      const dataToInsert = { ...data };

      // Generate ID & Timestamps if missing
      if (!dataToInsert.id) {
        dataToInsert.id = 'c' + Date.now().toString(36) + Math.random().toString(36).substring(2, 7);
      }
      if (!dataToInsert.createdAt && (validCols ? validCols.has('createdAt') : true)) {
        dataToInsert.createdAt = new Date();
      }
      if (!dataToInsert.updatedAt && (validCols ? validCols.has('updatedAt') : true)) {
        dataToInsert.updatedAt = new Date();
      }

      // Separate main columns from relational nested object creates
      const mainData: Record<string, any> = {};
      const nestedCreates: Record<string, any> = {};

      for (const k of Object.keys(dataToInsert)) {
        const v = dataToInsert[k];
        if (validCols && !validCols.has(k)) {
          if (v && typeof v === 'object') {
            nestedCreates[k] = v;
          }
        } else {
          mainData[k] = v;
        }
      }

      const keys = Object.keys(mainData);
      const values = keys.map(k => {
        const v = mainData[k];
        if (v instanceof Date) return v.toISOString().slice(0, 19).replace('T', ' ');
        if (typeof v === 'boolean') return v ? 1 : 0;
        if (typeof v === 'object' && v !== null) return JSON.stringify(v);
        return v;
      });
      const cols = keys.map(k => `\`${k}\``).join(', ');
      const placeholders = keys.map(() => '?').join(', ');

      const sql = `INSERT INTO \`${tableName}\` (${cols}) VALUES (${placeholders})`;
      await pool.execute(sql, values);

      // Handle Nested Relational Creates
      const parentId = dataToInsert.id;

      // 1. Store settings, themeSettings, shippingZones
      if (tableName === 'Store') {
        if (nestedCreates.settings?.create) {
          const sData = nestedCreates.settings.create;
          const sId = 'cs' + Date.now().toString(36) + Math.random().toString(36).substring(2, 7);
          await pool.execute(
            'INSERT INTO `StoreSettings` (`id`, `storeId`, `currency`, `phone`, `address`, `enableCOD`) VALUES (?, ?, ?, ?, ?, ?)',
            [sId, parentId, sData.currency || 'BDT', sData.phone || '', sData.address || '', sData.enableCOD ? 1 : 0]
          );
        }

        if (nestedCreates.themeSettings?.create) {
          const tsData = nestedCreates.themeSettings.create;
          const tsId = 'cts' + Date.now().toString(36) + Math.random().toString(36).substring(2, 7);
          await pool.execute(
            'INSERT INTO `StoreThemeSettings` (`id`, `storeId`, `themeId`, `headerConfig`, `footerConfig`, `colorsConfig`, `typographyConfig`, `updatedAt`) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())',
            [tsId, parentId, tsData.themeId || '', tsData.headerConfig || '{}', tsData.footerConfig || '{}', tsData.colorsConfig || '{}', tsData.typographyConfig || '{}']
          );

          if (tsData.sections?.create && Array.isArray(tsData.sections.create)) {
            for (const sec of tsData.sections.create) {
              const secId = 'sec' + Date.now().toString(36) + Math.random().toString(36).substring(2, 7);
              await pool.execute(
                'INSERT INTO `ThemeSection` (`id`, `storeThemeSettingsId`, `sectionType`, `title`, `subtitle`, `content`, `sortOrder`, `isVisible`) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                [secId, tsId, sec.sectionType || '', sec.title || '', sec.subtitle || '', sec.content || '{}', sec.sortOrder || 0, sec.isVisible ? 1 : 0]
              );
            }
          }
        }

        if (nestedCreates.shippingZones?.create && Array.isArray(nestedCreates.shippingZones.create)) {
          for (const zone of nestedCreates.shippingZones.create) {
            const zId = 'z' + Date.now().toString(36) + Math.random().toString(36).substring(2, 7);
            await pool.execute(
              'INSERT INTO `ShippingZone` (`id`, `storeId`, `name`, `regions`, `isActive`) VALUES (?, ?, ?, ?, 1)',
              [zId, parentId, zone.name || 'Default Zone', zone.regions || '[]']
            );

            if (zone.rates?.create && Array.isArray(zone.rates.create)) {
              for (const rate of zone.rates.create) {
                const rId = 'r' + Date.now().toString(36) + Math.random().toString(36).substring(2, 7);
                await pool.execute(
                  'INSERT INTO `ShippingRate` (`id`, `zoneId`, `name`, `price`, `estimatedDays`) VALUES (?, ?, ?, ?, ?)',
                  [rId, zId, rate.name || 'Standard', rate.price || 0, rate.estimatedDays || '2-3 Days']
                );
              }
            }
          }
        }
      }

      // 2. Order items
      if (tableName === 'Order' && nestedCreates.items?.create && Array.isArray(nestedCreates.items.create)) {
        for (const item of nestedCreates.items.create) {
          const itemId = 'oi' + Date.now().toString(36) + Math.random().toString(36).substring(2, 7);
          await pool.execute(
            'INSERT INTO `OrderItem` (`id`, `orderId`, `productId`, `variantId`, `productTitle`, `price`, `costPrice`, `quantity`, `total`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [itemId, parentId, item.productId || '', item.variantId || null, item.productTitle || item.title || '', item.price || 0, item.costPrice || 0, item.quantity || 1, item.total || 0]
          );
        }
      }

      // 3. Product images & variants
      if (tableName === 'Product') {
        if (nestedCreates.images?.create && Array.isArray(nestedCreates.images.create)) {
          for (const img of nestedCreates.images.create) {
            const imgId = 'pi' + Date.now().toString(36) + Math.random().toString(36).substring(2, 7);
            const imgUrl = typeof img === 'string' ? img : (img.url || '');
            await pool.execute(
              'INSERT INTO `ProductImage` (`id`, `productId`, `url`, `isMain`, `sortOrder`) VALUES (?, ?, ?, ?, ?)',
              [imgId, parentId, imgUrl, img.isMain ? 1 : 0, img.sortOrder || 0]
            );
          }
        }

        if (nestedCreates.variants?.create && Array.isArray(nestedCreates.variants.create)) {
          for (const v of nestedCreates.variants.create) {
            const vId = 'pv' + Date.now().toString(36) + Math.random().toString(36).substring(2, 7);
            await pool.execute(
              'INSERT INTO `ProductVariant` (`id`, `productId`, `title`, `sku`, `price`, `salePrice`, `stock`, `attributes`) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
              [vId, parentId, v.title || '', v.sku || null, v.price || 0, v.salePrice || null, v.stock || 0, typeof v.attributes === 'object' ? JSON.stringify(v.attributes) : (v.attributes || '{}')]
            );
          }
        }
      }

      return this.findUnique({ where: { id: parentId }, select, include });
    },

    async update({ where, data, select, include }: any) {
      if (!where || !data) return null;
      const { clause, params: whereParams } = buildWhereClause(where);
      if (!clause) return null;

      const dataToUpdate = { ...data };
      if (!dataToUpdate.updatedAt && (validCols ? validCols.has('updatedAt') : true)) {
        dataToUpdate.updatedAt = new Date();
      }

      const setClauses: string[] = [];
      const updateValues: any[] = [];

      for (const k of Object.keys(dataToUpdate)) {
        if (validCols && !validCols.has(k)) continue;
        const v = dataToUpdate[k];

        if (v !== null && typeof v === 'object' && !(v instanceof Date)) {
          if ('increment' in v) {
            setClauses.push(`\`${k}\` = \`${k}\` + ?`);
            updateValues.push(Number(v.increment) || 0);
          } else if ('decrement' in v) {
            setClauses.push(`\`${k}\` = \`${k}\` - ?`);
            updateValues.push(Number(v.decrement) || 0);
          } else if ('set' in v) {
            setClauses.push(`\`${k}\` = ?`);
            updateValues.push(v.set);
          } else {
            setClauses.push(`\`${k}\` = ?`);
            updateValues.push(JSON.stringify(v));
          }
        } else if (v instanceof Date) {
          setClauses.push(`\`${k}\` = ?`);
          updateValues.push(v.toISOString().slice(0, 19).replace('T', ' '));
        } else if (typeof v === 'boolean') {
          setClauses.push(`\`${k}\` = ?`);
          updateValues.push(v ? 1 : 0);
        } else {
          setClauses.push(`\`${k}\` = ?`);
          updateValues.push(v);
        }
      }

      if (setClauses.length > 0) {
        const sql = `UPDATE \`${tableName}\` SET ${setClauses.join(', ')}${clause}`;
        await pool.execute(sql, [...updateValues, ...whereParams]);
      }

      return this.findUnique({ where, select, include });
    },

    async delete({ where }: any) {
      if (!where) return null;
      const { clause, params } = buildWhereClause(where);
      if (!clause) return null;
      const existing = await this.findUnique({ where });
      await pool.execute(`DELETE FROM \`${tableName}\`${clause}`, params);
      return existing;
    },

    async upsert({ where, create, update }: any) {
      const existing = await this.findUnique({ where });
      if (existing) {
        return this.update({ where, data: update });
      } else {
        return this.create({ data: create });
      }
    }
  };
}

export const db: any = new Proxy({}, {
  get(target, prop: string) {
    if (prop === '$queryRaw' || prop === '$executeRaw' || prop === '$queryRawUnsafe' || prop === '$executeRawUnsafe') {
      return async (query: any, ...args: any[]) => {
        if (typeof query === 'string') {
          const [rows] = await pool.query(query, args);
          return rows;
        }
        return [];
      };
    }
    if (prop === '$transaction') {
      return async (fn: any) => {
        if (typeof fn === 'function') {
          return fn(db);
        }
        return null;
      };
    }
    if (prop === '$disconnect' || prop === '$connect') {
      return async () => {};
    }
    const modelName = prop.charAt(0).toUpperCase() + prop.slice(1);
    return createModelHandler(modelName);
  }
});
